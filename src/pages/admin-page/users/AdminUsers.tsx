import { Fragment, useCallback, useEffect, useState } from "react";
import { Form, Button, Input, Modal, Space, Table, Pagination, Select, Row, Col, message, Checkbox } from "antd";
import { useForm } from "antd/es/form/Form";
import "./style.scss";
import { LIMIT } from "../../../constants";
import { useNavigate } from "react-router-dom";
import useUsers from "../../../states/adminUsers";
import { request } from "../../../request";
import { patchChanges, removeNullish } from "./functions";
import { SearchOutlined, CloseOutlined } from "@ant-design/icons";
import parsePhoneNumberFromString, { isValidNumber } from "libphonenumber-js";
import { toast } from "react-toastify";

const UsersPageAdmin = () => {
  const { total, loading, isModalOpen, data, page, getData, SerachSkills, showModal, handleCancel, handleOk, handlePage } = useUsers();

  const [form] = useForm();
  const navigate = useNavigate();
  const [editId, setEditId] = useState(null);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [selectedRole, setSelectedRole] = useState("");
  const [position, setPosition] = useState([]);

  const [positionOption, setPositionOption] = useState([]);

  useEffect(() => {
    getData(selectedBranch); // Fetch data based on the selected branch
  }, [getData, selectedBranch]);

  const deleteStaff = useCallback(
    async (id) => {
      try {
        Modal.confirm({
          title: "O'chirmoqchimisiz?",
          onOk: async () => {
            try {
              await request.delete(`/account/staff-profile-delete/${id}/`);
              await getData(selectedBranch); // Fetch updated data after deletion
            } catch (error) {
              console.error("Failed to delete data:", error);
            }
          },
        });
      } catch (err) {
        console.log(err);
      }
    },
    [getData, selectedBranch]
  );

  const editData = useCallback(
    async (id) => {
      try {
        const { data } = await request.get(`/account/staff-profile/${id}/`);
        const formattedData = {
          id: data.id,
          first_name: data.first_name,
          last_name: data.last_name,
          phone_number: data.phone_number,
          user: {
            username: data.user.username,
            password: data.user.password,
            roles: data.user.roles,
          },
          branch: data.branch.id,
          salary: data.salary,
          position: data.position.map((pos) => pos?.id),
          // position: data.position?.id,
          birthday: data.birthday,
          status: data.status,
        };
        setEditId(formattedData.id);
        form.setFieldsValue(formattedData);
        localStorage.setItem("editData", JSON.stringify(formattedData));
      } catch (err) {
        console.log(err);
        
        console.error(err);
      }
    },
    [form]
  );

  const columns = [
    {
      title: "Ism",
      dataIndex: "first_name",
      key: "first_name",
    },
    {
      title: "Familiya",
      dataIndex: "last_name",
      key: "last_name",
    },
    {
      title: "Username",
      render: (record:any) => record?.user?.username,
      key: "username",
    },
    {
      title: "Tug'ilgan kun",
      render: (record:any) => record?.birthday,
      key: "birthday",
    },
    {
      title: "Telefon raqam",
      dataIndex: "phone_number",
      key: "phone_number",
    },
    {
      title: "Fillial",
      render: (record:any) => record?.branch?.name,
      key: "branch",
    },
    {
      title: "Lavozimi",
      render: (record:any) => record.position[0]?.name,
      key: "position",
    },
    {
      title: "Oylik maosh",
      dataIndex: "salary",
      key: "salary",
    },
    {
      title: "Foydalanuvchi roli",
      render: (record:any) => record?.user?.roles,
      key: "user_roles",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status:any) => (status ? <h3 style={{ color: "green" }}>Faoliyatda</h3> : <h3 style={{ color: "red" }}>Faoliyatda emas</h3>),
    },
    {
      title: "Action",
      dataIndex: "id",
      key: "id",
      render: (id) => (
        <Space size="middle">
          <Button
            style={{ backgroundColor: "#264653" }}
            onClick={() => {
              showModal(form);
              setEditId(id);
              editData(id);
            }}
            type="primary"
          >
            Tahrirlash
          </Button>
  
          <Button onClick={() => deleteStaff(id)} type="primary" style={{ backgroundColor: "#f54949" }}>
            O'chirish
          </Button>
        </Space>
      ),
    },
  ];

  const [branch, setBranch] = useState([]);

  const handleForm = async (formData) => {
    try {
      const values = await form.validateFields();
      let originalData = JSON.parse(localStorage.getItem("editData"));

      const payload = patchChanges(originalData, removeNullish(formData));

      if (editId) {
        await request.patch(`account/staff-profile-update/${editId}/`, payload);
      } else {
        await request.post("/account/staff-profile-create/", formData);
      }
      setEditId(null);
      handleCancel();
      getData();
    } catch (error) {
      toast.error(error?.response?.data.position[0]);
      console.error(error.response.data);
    }
  };

  const handleChangeBranch = (value: any) => {
    setSelectedBranch(value);
  };

  const getBranches = useCallback(async () => {
    try {
      const res = await request.get(`branch/branches/`);
      const data = res.data;
      setBranch(data.results);
    } catch (err) {
      console.log(err);
    }
  }, []);
  const getPosition = useCallback(async () => {
    try {
      const res = await request.get(`account/positions/`);
      const data = res.data.results;
      setPosition(data);
    } catch (err) {
      console.log(err);
    }
  }, []);

  useEffect(() => {
    const PosOption = position.map((data) => ({
      label: `${data.name}`,
      value: data.id,
    }));
    setPositionOption(PosOption);
  }, [position]);

  console.log(position, "position");

  useEffect(() => {
    getBranches();
    getPosition();
  }, [getBranches, getPosition]);

  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  const handleChange = (value: any) => {
    setSelectedRole(value); // Update the selected role state
  };
  useEffect(() => {
    getData(selectedBranch, selectedRole); // Fetch data based on the selected role
  }, [getData, selectedBranch, selectedRole]);

  const [positionOptions, setPositionOptions] = useState([]);

  useEffect(() => {
    const updatePositionOptions = () => {
      const options = position.map((value) => ({
        label: value?.name,
        value: value.id,
      }));
      setPositionOptions(options);
    };
    updatePositionOptions();
  }, [position]);
  return (
    <Fragment>
      <section id="search">
        <div className="container">
          <div className="search-container"></div>
        </div>
      </section>
      <Table
        loading={loading}
        className="table"
        title={() => (
          <>
            <Row justify="space-between" align="middle" style={{ marginBottom: 20 }}>
              <Col>
                <h1>Xodimlar ({total})</h1>
              </Col>
              <div style={{ display: "flex", alignItems: "center", gap: "70px" }}>
                <Col>
                  <div className="search-box">
                    <Input
                      onChange={(e) => {
                        SerachSkills(e);
                        console.log(e.target.value);
                      }}
                      className={isSearchOpen ? "searchInput open" : "searchInput"} // Apply different class based on isSearchOpen state
                      placeholder="Search..."
                    />
                    <a href="#" onClick={toggleSearch}>
                      {isSearchOpen ? <CloseOutlined style={{ color: "white" }} /> : <SearchOutlined />}
                    </a>
                  </div>
                </Col>
                <Col>
                  <Button className="Add" type="primary" onClick={() => showModal(form)}>
                    <div className="center">
                      <button className="btn">
                        <svg width="180px" height="60px" viewBox="0 0 180 60" className="border">
                          <polyline points="179,1 179,59 1,59 1,1 179,1" className="bg-line" />
                          <polyline points="179,1 179,59 1,59 1,1 179,1" className="hl-line" />
                        </svg>
                        <span>Xodim qo'shish</span>
                      </button>
                    </div>
                  </Button>
                </Col>
              </div>
            </Row>
            <Row justify="start" align="middle" style={{ gap: "20px" }} className="filtrTable">
              <Select size="large" defaultValue="Filliallar" style={{ width: 250 }} onChange={handleChangeBranch}>
                <Select.Option key="" value="">
                  Filliallar
                </Select.Option>
                {branch.map((value) => (
                  <Select.Option key={value.id} value={value.id}>
                    {value.name}
                  </Select.Option>
                ))}
              </Select>
              <Select
                size="large"
                defaultValue=""
                style={{ width: 250 }}
                onChange={handleChange}
                options={[
                  { value: "", label: "Rollar" },
                  { value: "superadmin", label: "Superadmin" },
                  { value: "admin", label: "Admin" },
                  { value: "teacher", label: "Teacher" },
                ]}
              />
            </Row>
          </>
        )}
        pagination={false}
        dataSource={data}
        columns={columns}
        rowKey="id"
      />
      {total > LIMIT && <Pagination defaultCurrent={1} className="pagination" total={total} pageSize={LIMIT} current={page} onChange={(offset) => handlePage(offset, navigate)} />}
      <Modal open={isModalOpen} title={editId ? "Xodimni tahrirlash" : "Yangi xodim qo'shish"} onCancel={handleCancel} footer={null}>
        <Form
          name="basic"
          labelCol={{
            span: 24,
          }}
          wrapperCol={{
            span: 24,
          }}
          style={{
            maxWidth: 600,
            margin: "0 auto",
          }}
          initialValues={{
            remember: true,
          }}
          onFinish={handleForm}
          autoComplete="off"
          form={form}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Familiyasi"
                name="last_name"
                rules={[
                  {
                    required: true,
                    message: "Please fill!",
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Ismi"
                name="first_name"
                rules={[
                  {
                    required: true,
                    message: "Please fill!",
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Col span={12}>
            <Form.Item
              label="Tug'ilgan kuni"
              name="birthday"
              rules={[
                {
                  required: true,
                  message: "Please fill!",
                },
              ]}
            >
              <Input type="date" />
            </Form.Item>
          </Col>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Telefon raqami"
                // onChange={handlePhoneNumberChange}

                name="phone_number"
                rules={[
                  {
                    required: true,
                    message: "Please fill!",
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Username"
                name={["user", "username"]}
                rules={[
                  {
                    required: false,
                    message: "Please fill!",
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label="Parol"
            name={["user", "password"]}
            rules={[
              {
                required: false,
                message: "Please fill!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Rol"
            name={["user", "roles"]}
            rules={[
              {
                required: true,
                message: "Please fill!",
              },
            ]}
          >
            <Select>
              <Select.Option value="admin">Admin</Select.Option>
              <Select.Option value="superadmin">Superadmin</Select.Option>
              <Select.Option value="teacher">Teacher</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Filliali"
            name="branch"
            rules={[
              {
                required: true,
                message: "Please fill!",
              },
            ]}
          >
            <Select>
              {branch.map((value) => (
                <Select.Option key={value.id} value={value.id}>
                  {value.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Oylik"
            name="salary"
            rules={[
              {
                required: true,
                message: "Please fill!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Lavozimi"
            name="position"
            rules={[
              {
                required: true,
                message: "Please fill!",
              },
            ]}
          >
            <Select mode="multiple" size="large" placeholder="lavozimni tanlang" onChange={handleChange}>
              {positionOption.map((student) => (
                <Select.Option key={student.value} value={student.value}>
                  {student.label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="status" valuePropName="checked">
            <Checkbox> Faoliyatda</Checkbox>
          </Form.Item>
          <Form.Item
            wrapperCol={{
              span: 24,
            }}
          >
            <Button style={{ backgroundColor: "#264653", width: "100%" }} type="primary" htmlType="submit">
              {editId ? "Saqlash" : "Yaratish"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </Fragment>
  );
};

export default UsersPageAdmin;
