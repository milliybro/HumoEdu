import { Fragment, useCallback, useEffect, useState } from "react";
import { Form, Button, Input, Modal, Space, Table, Pagination, Select, Row, Col, message,DatePicker, Checkbox } from "antd";
import { useForm } from "antd/es/form/Form";
import "./style.scss";
import moment from "moment";
import { LIMIT, USERID } from "../../../constants";
import { useNavigate } from "react-router-dom";
import useUsers from "../../../states/adminUsers";
import { request } from "../../../request";
import Cookies from "js-cookie";
import { patchChanges, removeNullish } from "./functions";
import { SearchOutlined, CloseOutlined ,ExclamationCircleOutlined } from "@ant-design/icons";
import parsePhoneNumberFromString, { isValidNumber } from "libphonenumber-js";
import { toast } from "react-toastify";
import { useAuth } from "../../../states/auth";


const  { confirm } = Modal
const UsersPageBranch = () => {
  const { total, loading, isModalOpen, data, page, getData, SearchSkills, showModal, handleCancel, handleOk, handlePage } = useUsers();
  const { branchId} = useAuth();
  console.log(branchId);
  const [form] = useForm();
  const navigate = useNavigate();
  const [editId, setEditId] = useState(null);
  const [user, setUser] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedUser, setSelectedUser] = useState("");
  const [position, setPosition] = useState([]);
  const [deleteStaff, setDeleteStaff] = useState(false)
  //  const [branch, setBranch] = useState([]);
  const [positionOption, setPositionOption] = useState([]);
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(null);
  
   useEffect(() => {
     getData(
       null,
       selectedRole,
       null,
       null,
       null,
       null,
       selectedStatus
     ); // Fetch data based on the selected branch
   }, [getData,  selectedRole, selectedStatus]);

  

  const editData = useCallback(
    async (id) => {
      try {
        const { data } = await request.get(`/account/staff-profile/${id}/`);
        console.log(data)
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
          salary: data.salary,
          position: data.position[0].id,
          birthday: data.birthday,
          status: data.status,
          branch: branchId,
        };
        setEditId(formattedData.id);
        form.setFieldsValue(formattedData);
        localStorage.setItem("editData", JSON.stringify(formattedData));
      } catch (err) {
        console.error(err);
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
      render: (record) => record.user.username,
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
      render: (record) => record.branch.name,
      key: "branch",
    },
    {
      title: "Lavozimi",
      render: (record) => record.position[0].name,
      key: "position",
    },
    {
      title: "Oylik maosh",
      dataIndex: "salary",
      key: "salary",
    },

    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) =>
        status ? (
          <h3 style={{ color: "green" }}>Faoliyatda</h3>
        ) : (
          <h3 style={{ color: "red" }}>Faoliyatda emas</h3>
        ),
    },
    {
      title: "Action",
      dataIndex: "id",
      key: "id",
      render: (id, record) => (
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
            onClick={() => showDeleteConfirm(id)}
            type="primary"
            style={{ backgroundColor: "#f54949" }}
          >
            O'chirish
          </Button>
        </Space>
      ),
    },
  ];

  // const [branch, setBranch] = useState([]);

  const handleForm = async (formData) => {
    try {
      const values = await form.validateFields();
      let originalData = JSON.parse(localStorage.getItem("editData"));

      
      const branch = branchId;
      const updatedFormData = {
        ...formData,
        branch,
        start_at: values.start_at
          ? moment(values.start_at).format("YYYY-MM-DD HH:mm:ss")
          : null,
        end_at: values.end_at
          ? moment(values.end_at).format("YYYY-MM-DD HH:mm:ss")
          : null,
      };

      const payload = patchChanges(
        originalData,
        removeNullish(updatedFormData)
      );

      if (editId) {
        await request.patch(
          `/account/staff-profile-update/${editId}/`,
          payload
        );
      } else {
        await request.post("/account/staff-profile-create/", updatedFormData);
      }

      setEditId(null);
      handleCancel();
      getData();
    } catch (error) {
      toast.error(error.message);
      console.error(error);
    }
  };
   ////////////////////// delete function ///////////////////
   const showDeleteConfirm = (id: number) => {
      confirm({
        title: "Bu xodimni  ro'yhatdan o'chirishni hohlaysizmi?",
        icon: <ExclamationCircleOutlined />,
        content: "Bu amalni ortga qaytarib bo‘lmaydi.",
        okText: "ha",
        okType: "danger",
        cancelText: "ortga",
        onOk() {
          deleteStaffFunc(id);
        },
        onCancel() {
          setDeleteStaff(false);
        },
      });
    };
  const deleteStaffFunc = useCallback(
    async (id:number) => {
      try {
        await request.delete(`account/staff-profile-delete/${id}/`);
        getData();
      } catch (err) {
        console.error(err);
      }
    },
    [getData]
  );
  const getPosition = useCallback(async () => {
    try {
      const res = await request.get(`account/positions/`);
      const data = res.data.results;
      setPosition(data);
    } catch (err) {
      console.log(err);
    }
  }, []);
  const userId = Cookies.get(USERID) || "";

  const getUser = useCallback(async () => {
    try {
      const res = await request.get(`account/staff-profiles/?user=${userId}`);
      const data = res?.data?.results;
      setUser(data);
    } catch (err) {
      console.log(err);
    }
  }, []);


  // console.log(position, "position");
   useEffect(() => {
     const PosOption = position.map((data) => ({
       value: data.id,
       label: data.name,
     }));
     setPositionOption(PosOption);
   }, [position]);

  useEffect(() => {
    getPosition();
    getUser();
  }, [ getPosition, getUser]);

  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  const handleChange = (value: any) => {
    setSelectedRole(value); // Update the selected role state
  };

  const handleUser = (value: any) => {
    setSelectedUser(value); // Update the selected role state
  };

  useEffect(() => {
    getData(branchId, selectedRole, selectedUser); // Fetch data based on the selected role
  }, [getData, branchId, selectedRole, selectedUser]);

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





  const togglePasswordFields = () => {
    if(!editId){
      setShowPasswordFields(true);
    }
    if(editId){
    setShowPasswordFields(!showPasswordFields);
    }
  };

  const handleChangeStatus = (value) => {
    setSelectedStatus(value);
  };
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
            <Row>
              <Select
                size="middle"
                defaultValue=""
                style={{ width: "150px" }}
                onChange={handleChangeStatus}
                options={[
                  { value: "", label: "Hammasi" },
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
                  <Select.Option value="teacher">Teacher</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={6}>
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

            <Col span={8}>
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
                  size="middle"
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
            <Col span={4}>
              <Form.Item
                name="status"
                valuePropName="checked"
                label="status"
                rules={[
                  {
                    required: true,
                    message: "Please fill!",
                  },
                ]}
              >
                <Checkbox>Faoliyatda</Checkbox>
              </Form.Item>
            </Col>
            {editId ? (
              <Col span={4}>
                <Button
                  className="mt-10"
                  type="primary"
                  onClick={togglePasswordFields}
                >
                  parolni o'zgartirish
                </Button>
              </Col>
            ) : (
              <Row gutter={16} style={{ marginTop: 16 }}>
                <Col span={8}>
                  <Form.Item
                    label="Parol"
                    name={["user", "password1"]}
                    style={{ marginBottom: 0 }}
                    rules={[
                      {
                        required: false,
                        message: "Please fill!",
                      },
                    ]}
                  >
                    <Input.Password />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label="Parolni takrorlash"
                    name={["user", "password2"]}
                    style={{ marginBottom: 0 }}
                    rules={[
                      {
                        required: false,
                        message: "Please fill!",
                      },
                    ]}
                  >
                    <Input.Password />
                  </Form.Item>
                </Col>
              </Row>
            )}
          </Row>
          <Row gutter={16} style={{ marginTop: 16 }}>
            {editId ? (
              <Col span={8}>
                <Form.Item
                  label="ent_at"
                  name="end_at"
                  rules={[
                    { required: false, message: "Please select an end date!" },
                  ]}
                >
                  <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />
                </Form.Item>
              </Col>
            ) : (
              <Col span={8}>
                <Form.Item
                  label="Yaratilgan vaqt"
                  name="start_at"
                  rules={[
                    {
                      required: true,
                      message: "Please select a start date!",
                    },
                  ]}
                >
                  <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />
                </Form.Item>
              </Col>
            )}
            {showPasswordFields && (
              <>
                <Col span={8}>
                  <Form.Item
                    label="Parol"
                    name={["user", "password1"]}
                    style={{ marginBottom: 0 }}
                    rules={[
                      {
                        required: false,
                        message: "Please fill!",
                      },
                    ]}
                  >
                    <Input.Password />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label="Parolni takrorlash"
                    name={["user", "password2"]}
                    style={{ marginBottom: 0 }}
                    rules={[
                      {
                        required: false,
                        message: "Please fill!",
                      },
                    ]}
                  >
                    <Input.Password />
                  </Form.Item>
                </Col>
              </>
            )}
          </Row>

          <Form.Item
            wrapperCol={{
              span: 24,
            }}
          >
            <Button
              style={{
                backgroundColor: "#264653",
                width: "100%",
                marginTop: "15px",
              }}
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

export default UsersPageBranch;
