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
          position: data.position.map((pos) => [{
            value:  pos?.id,
            label: pos?.name
          }]),
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
      render: (text, record, index) => index + 1,
    },
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
      render: (record) => record?.user?.username,
      key: "username",
    },
    {
      title: "Tug'ilgan kun",
      render: (record) => record?.birthday,
      key: "birthday",
    },
    {
      title: "Telefon raqam",
      dataIndex: "phone_number",
      key: "phone_number",
    },
    {
      title: "Fillial",
      render: (record) => record?.branch?.name,
      key: "branch",
    },
    {
      title: "Lavozimi",
      render: (record) => record.position[0]?.name,
      key: "position",
    },
    {
      title: "Oylik maosh",
      dataIndex: "salary",
      key: "salary",
    },
    {
      title: "Foydalanuvchi roli",
      render: (record) => record?.user?.roles,
      key: "user_roles",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) =>
        status ? (
          <h5 style={{ color: "green" }}>Faoliyatda</h5>
        ) : (
          <h5 style={{ color: "red" }}>Faoliyatda emas</h5>
        ),
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

          <Button
            onClick={() => deleteStaff(id)}
            type="primary"
            style={{ backgroundColor: "#f54949" }}
          >
            O'chirish
          </Button>
        </Space>
      ),
    },
  ];

  const [branch, setBranch] = useState([]);

 const handleForm = async () => {
   try {
     const values = await form.validateFields();
    //  const originalData = JSON.parse(localStorage.getItem("editData"));
    //  const cleanedValues = removeNullish(values);
    //  const payload = patchChanges(originalData, cleanedValues);

     if (editId) {
       await request.put(`account/staff-profile-update/${editId}/`, values);
     } else {
       await request.post("/account/staff-profile-create/", values);
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
      label: data.name,
      value: data.id,
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
        style={{ width: "1500px" }}
        title={() => (
          <>
            <Row
              justify="space-between"
              align="middle"
              style={{ marginBottom: 20 }}
            >
              <Col>
                <h1>Xodimlar ({total})</h1>
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
                style={{ width: 250 }}
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
                style={{ width: 250 }}
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
                style={{ width: "250px" }}
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
