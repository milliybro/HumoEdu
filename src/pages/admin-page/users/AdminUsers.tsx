import { Fragment, useCallback, useEffect, useState } from "react";
import { Form, Button, Input, Modal, Space, Table, Pagination, Select, Row, Col, Checkbox } from "antd";
import { useForm } from "antd/es/form/Form";
import "./style.scss";
import { LIMIT } from "../../../constants";
import { useNavigate } from "react-router-dom";
import useUsers from "../../../states/adminUsers";
import { request } from "../../../request";
// import { patchChanges, removeNullish } from "./functions";
import { SearchOutlined, CloseOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";

const UsersPageAdmin = () => {
  const { total, loading, isModalOpen, data, page, getData, SearchSkills, showModal, handleCancel, handlePage } = useUsers();

  const [form] = useForm();
  const navigate = useNavigate();
  const [editId, setEditId] = useState(null);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [selectedRole, setSelectedRole] = useState("");
  const [position, setPosition] = useState([]);
  const [positionOption, setPositionOption] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState(null)
  useEffect(() => {
    getData(selectedBranch,selectedRole, null, null, null, null, selectedStatus); // Fetch data based on the selected branch
  }, [getData, selectedBranch, selectedRole, selectedStatus]);

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
              toast.error("Failed to delete data.");
            }
          },
        });
      } catch (err) {
        console.log(err);
        toast.error("Failed to delete data.");
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
          position: data.position.map((pos) => pos.id),
          birthday: data.birthday,
          status: data.status,
        };
        setEditId(formattedData.id);
        form.setFieldsValue(formattedData);
        localStorage.setItem("editData", JSON.stringify(formattedData));
      } catch (err) {
        console.error(err);
        toast.error("Failed to load user data.");
      }
    },
    [form]
  );

  const columns = [
    {
      title: "N",
      dataIndex: "index",
      key: "index",
      render: (text, record, index) => (
        <span style={{ fontSize: "12px" }}>{index + 1}</span>
      ),
      width: 50,
    },
    {
      title: "Ism",
      dataIndex: "first_name",
      key: "first_name",
      render: (text) => <span style={{ fontSize: "12px" }}>{text}</span>,
      width: 150,
    },
    {
      title: "Familiya",
      dataIndex: "last_name",
      key: "last_name",
      render: (text) => <span style={{ fontSize: "12px" }}>{text}</span>,
      width: 150,
    },
    {
      title: "Username",
      render: (record) => (
        <span style={{ fontSize: "12px" }}>{record?.user?.username}</span>
      ),
      key: "username",
      width: 150,
    },
    {
      title: "Tug'ilgan kun",
      render: (record) => (
        <span style={{ fontSize: "12px" }}>{record?.birthday}</span>
      ),
      key: "birthday",
      width: 200,
    },
    {
      title: "Telefon raqam",
      dataIndex: "phone_number",
      key: "phone_number",
      render: (text) => <span style={{ fontSize: "12px" }}>{text}</span>,
      width: 150,
    },
    {
      title: "Fillial",
      render: (record) => (
        <span style={{ fontSize: "12px" }}>{record?.branch?.name}</span>
      ),
      key: "branch",
      width: 150,
    },
    {
      title: "Lavozimi",
      render: (record) => (
        <span style={{ fontSize: "12px" }}>{record.position[0]?.name}</span>
      ),
      key: "position",
      width: 150,
    },
    {
      title: "Oylik maosh",
      dataIndex: "salary",
      key: "salary",
      render: (text) => <span style={{ fontSize: "12px" }}>{text}</span>,
      width: 150,
    },
    {
      title: "Foydalanuvchi roli",
      render: (record) => (
        <span style={{ fontSize: "12px" }}>{record?.user?.roles}</span>
      ),
      key: "user_roles",
      width: 150,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <h5 style={{ fontSize: "12px", color: status ? "green" : "red" }}>
          {status ? "Faoliyatda" : "Faoliyatda emas"}
        </h5>
      ),
      width: 150,
    },
    {
      title: "Action",
      dataIndex: "id",
      key: "id",
      render: (id) => (
        <Space size="middle">
          <Button
            style={{ backgroundColor: "#264653", fontSize: "12px" }}
            onClick={() => {
              showModal(form);
              setEditId(id);
              editData(id);
            }}
            type="primary"
          >
            Tahrirlash
          </Button>
          <Button
            onClick={() => deleteStaff(id)}
            type="primary"
            style={{ backgroundColor: "#f54949", fontSize: "12px" }}
          >
            O'chirish
          </Button>
        </Space>
      ),
      width: 150,
    },
  ];


  const [branch, setBranch] = useState([]);

 const handleForm = async () => {
   try {
     const values = await form.validateFields();
     const changeData = {
       ...values,
       position: values?.position, // faqat id-larni jo'natish kerak
     };

     if (editId) {
       await request.put(`account/staff-profile-update/${editId}/`, changeData);
     } else {
       await request.post("/account/staff-profile-create/", changeData);
     }

     setEditId(null);
     handleCancel();
     getData();
   } catch (error) {
     if (error?.response?.data?.position) {
       toast.error(error.response.data.position[0]);
     } else {
       toast.error("Failed to submit form.");
     }
     console.error("Form submission error:", error.response?.data || error);
   }
 };
  const handleChangeBranch = (value) => {
    setSelectedBranch(value);
  };

  const getBranches = useCallback(async () => {
    try {
      const res = await request.get(`branch/branches/`);
      const data = res.data;
      setBranch(data.results);
    } catch (err) {
      console.log(err);
      toast.error("Failed to load branches.");
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
      value: data.id,
      label: data.name,
    }));
    setPositionOption(PosOption);
  }, [position]);

  useEffect(() => {
    getBranches();
    getPosition();
  }, [getBranches, getPosition]);

  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  const handleChange = (value) => {
    setSelectedRole(value); // Update the selected role state
  };
  const handleChangeStatus = (value) => {
    setSelectedStatus(value); 
  };

  useEffect(() => {
    getData(selectedBranch, selectedRole, null, null, null, null, selectedStatus); // Fetch data based on the selected role
  }, [getData, selectedBranch, selectedRole, selectedStatus]);

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
        style={{ width: "100%", maxWidth: "1500px" }}
        title={() => (
          <>
            <Row
              justify="space-between"
              align="middle"
              style={{ width: "100%", maxWidth: "1500px" }}
            >
              <Col>
                <h1 className="font-medium text-2xl mb-2">
                  Xodimlar <span className="text-green-500">({total})</span>{" "}
                </h1>
              </Col>
              <div
                style={{ display: "flex", alignItems: "center", gap: "30px" }}
              >
                <Col>
                  <div className="relative flex items-center bg-blue-500 p-1 rounded-full px-2">
                    <Input
                      onChange={(e) => {
                        SearchSkills(e);
                        console.log(e.target.value);
                      }}
                      className={`transition-width duration-300 ease-in-out ${
                        isSearchOpen ? "w-64 px-4 py-1" : "w-0 px-0 py-1"
                      } bg-white rounded-md shadow-md outline-none`}
                      placeholder="Search..."
                      style={{ opacity: isSearchOpen ? 1 : 0 }}
                    />
                    <a
                      href="#"
                      onClick={toggleSearch}
                      className="ml-2 mr-2 text-white"
                    >
                      {isSearchOpen ? <CloseOutlined /> : <SearchOutlined />}
                    </a>
                  </div>
                </Col>
                <Col>
                  <Button
                    className="text-center"
                    type="primary"
                    onClick={() => showModal(form)}
                  >
                    Xodim qo'shish
                  </Button>
                </Col>
              </div>
            </Row>
            <Row
              justify="start"
              align="middle"
              style={{ gap: "20px" }}
              className="filtrTable"
            >
              <Select
                size="middle"
                defaultValue="Filliallar"
                style={{ width: 150 }}
                onChange={handleChangeBranch}
              >
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
                size="middle"
                defaultValue=""
                style={{ width: 150 }}
                onChange={handleChange}
                options={[
                  { value: "", label: "Rollar" },
                  { value: "superadmin", label: "Superadmin" },
                  { value: "admin", label: "Admin" },
                  { value: "teacher", label: "Teacher" },
                ]}
              />
              <Select
                size="middle"
                defaultValue=""
                style={{ width: "150px" }}
                onChange={handleChangeStatus}
                options={[
                  { value: "", label: "Status" },
                  { value: "true", label: "Faoliyatda" },
                  { value: "false", label: "Faoliyatda emas" },
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
      {total > LIMIT && (
        <Pagination
          defaultCurrent={1}
          className="pagination"
          total={total}
          pageSize={LIMIT}
          current={page}
          onChange={(offset) => handlePage(offset, navigate)}
        />
      )}
      <Modal
        open={isModalOpen}
        title={editId ? "Xodimni tahrirlash" : "Yangi xodim qo'shish"}
        onCancel={handleCancel}
        footer={null}
        width={900}
      >
        <Form
          name="basic"
          labelCol={{
            span: 24,
          }}
          wrapperCol={{
            span: 24,
          }}
          style={{
            maxWidth: 850,
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
            <Col span={8}>
              <Form.Item
                label="Familiyasi"
                name="last_name"
                style={{ marginBottom: 0 }}
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
            <Col span={8}>
              <Form.Item
                label="Ismi"
                name="first_name"
                style={{ marginBottom: 0 }}
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

            <Col span={8}>
              <Form.Item
                label="Tug'ilgan kuni"
                name="birthday"
                style={{ marginBottom: 0 }}
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
          </Row>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                label="Telefon raqami"
                style={{ marginBottom: 0 }}
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

            <Col span={8}>
              <Form.Item
                label="username"
                name={["user", "username"]}
                style={{ marginBottom: 0 }}
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
            <Col span={8}>
              <Form.Item
                label="Parol"
                name={["user", "password"]}
                style={{ marginBottom: 0 }}
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
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Rol"
                name={["user", "roles"]}
                style={{ marginBottom: 0 }}
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
            </Col>

            <Col span={12}>
              <Form.Item
                label="Filliali"
                name="branch"
                style={{ marginBottom: 0 }}
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
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Oylik"
                name="salary"
                style={{ marginBottom: 0 }}
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
                label="Lavozimi"
                name="position"
                style={{ marginBottom: 0 }}
                rules={[
                  {
                    required: true,
                    message: "Please fill!",
                  },
                ]}
              >
                <Select
                  mode="multiple"
                  size="large"
                  style={{ marginBottom: 0 }}
                  placeholder="lavozimni tanlang"
                  onChange={handleChange}
                >
                  {positionOption.map((student) => (
                    <Select.Option key={student.value} value={student.value}>
                      {student.label}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="status" valuePropName="checked">
            <Checkbox> Faoliyatda</Checkbox>
          </Form.Item>
          <Form.Item
            wrapperCol={{
              span: 24,
            }}
          >
            <Button
              style={{ backgroundColor: "#264653", width: "100%" }}
              type="primary"
              htmlType="submit"
            >
              {editId ? "Saqlash" : "Yaratish"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </Fragment>
  );
};

export default UsersPageAdmin;

