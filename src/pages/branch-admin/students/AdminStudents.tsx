import { Fragment, useCallback, useEffect, useState } from "react";
import {
  Form,
  Button,
  Space,
  Table,
  Pagination,
  Select,
  Input,
  Modal,
  Image,
  Row,
  Col,
} from "antd";
import { useForm } from "antd/es/form/Form";
import { useNavigate} from "react-router-dom";
import {
  CloseOutlined,
  SearchOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { toast } from "react-toastify";
import { LIMIT } from "../../../constants";
import { request } from "../../../request";
import useStudent from "../../../states/adminStudents";
import { patchChanges, removeNullish } from "../../../utils/functions";
import { useAuth } from "../../../states/auth";

const BranchStudents = () => {
  const { confirm } = Modal;
  const {
    total,
    loading,
    isModalOpen,
    data,
    page,
    getData,
    editData,
    deleteData,
    SearchSkills,
    showModal,
    handleCancel,
    handleStatusChange,
    handleOk,
    handlePage,
  } = useStudent();
  const { branchId } = useAuth();
  const [form] = useForm();
  const navigate = useNavigate();
  // const [branch, setBranch] = useState([]);
 const [showPasswordFields, setShowPasswordFields] = useState(false);

  const [editId, setEditId] = useState(null);
  const [originalData, setOriginalData] = useState({});
  const [selectedStatus, setSelectedStatus] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [deleteStudent, setDeleteStudent] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(false);
  const [groups, setGroups] = useState([]);


 

  useEffect(() => {
    const fetchData = async () => {
      await getData(
        null,
        null,
        null,
        null,
        null,
        null,
        selectedStatus,
        selectedGroup
      ); // selectedGroup qo'shildi
    };
    fetchData();
  }, [getData, selectedGroup, selectedStatus]);
   
  const getGroups = useCallback(async (branchId: number) => {
    try {
      const { data } = await request.get(`group/groups/?branch=${branchId}`);
      setGroups(data.results);
    } catch (err) {
      console.error(err);
    }
  }, []);
   useEffect(() => {
     getData(); // Fetch data based on the selected branch
   }, [getData]);

   useEffect(() => {
     getData();
     getGroups(branchId);
   }, [getData, getGroups]);
  

  const columns = [
    {
      title: "Rasm",
      dataIndex: "image",
      key: "image",
      render: (image) => (
        <Image
          className="rounded-full"
          width={50}
          height={50}
          src={image}
          preview={{
            src: image,
          }}
        />
      ),
    },
    {
      title: "Familiya",
      dataIndex: "last_name",
      key: "last_name",
    },
    {
      title: "Ism",
      dataIndex: "first_name",
      key: "first_name",
    },
    {
      title: "Username",
      dataIndex: "user",
      key: "username",
      render: (user) => user?.username || "N/A",
    },
    {
      title: "Telefon raqam1",
      dataIndex: "phone_number1",
      key: "phone_number1",
    },
    {
      title: "Telefon raqam2",
      dataIndex: "phone_number2",
      key: "phone_number1",
    },
    {
      title: "Fillial",
      dataIndex: "branch",
      key: "branch",
      render: (branch) => branch?.name || "N/A",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) =>
        status ? (
          <h5 style={{ color: "green" }}>Faol</h5>
        ) : (
          <h5 style={{ color: "red" }}>Faol emas</h5>
        ),
    },
    {
      title: "Action",
      key: "action",
      render: (record) => (
        <Space size="middle">
          <Button
            onClick={() => {
              showModal(form);
              setEditId(record.id);
              editStudent(record.id);
            }}
            type="primary"
          >
            Edit
          </Button>
          <Button
            onClick={() => showDeleteConfirm(record.id)}
            type="primary"
            danger
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  const editStudent = useCallback(
    async (id) => {
      try {
        const { data } = await request.get(`account/student-profile/${id}/`);
        const formattedData = {
          id: data.id,
          last_name: data.last_name,
          first_name: data.first_name,
          phone_number1: data.phone_number1,
          phone_number2: data.phone_number2,
          user: {
            password: data.user.password,
            username: data.user.username,
          },
          branch: data.branch.id,
          birthday: data.birthday,
          status: data.status,
        };
        setEditId(formattedData.id);
        setOriginalData(formattedData);
        form.setFieldsValue(formattedData);
      } catch (err) {
        console.error(err);
      }
    },
    [form]
  );
  ////////////delete ////////////////
   const showDeleteConfirm = (id: number) => {
     confirm({
       title: "Bu o'quvchini  ro'yhatdan o'chirishni hohlaysizmi?",
       icon: <ExclamationCircleOutlined />,
       content: "Bu amalni ortga qaytarib bo‘lmaydi.",
       okText: "ha",
       okType: "danger",
       cancelText: "ortga",
       onOk() {
         deleteStudentFunc(id);
       },
       onCancel() {
         setDeleteStudent(false);
       },
     });
   };
   const deleteStudentFunc = useCallback(
     async (id: number) => {
       try {
         await request.delete(`account/student-profile-delete/${id}/`);
         getData();
       } catch (err) {
         console.error(err);
       }
     },
     [getData]
   );
  

 const handleForm = async (formData) => {
   const branch = branchId;
     try {
      if (formData.user && !formData.user.roles) {
        formData.user.roles = "student";
        formData.branch = branch;

      }
       if (editId) {
          if (
            formData.user &&
            formData.user.password1 === "" &&
            formData.user.password2 === ""
          ) {
            delete formData.user.password1;
            delete formData.user.password2;
          }
         await request.put(
           `account/student-profile-update/${editId}/`,
           formData
         );
         setEditId(null);
         handleCancel();
         getData();
       } else {
         
         await request.post("/account/student-profile-create/", formData);
         setEditId(null);
         handleCancel();
         getData();
       }

       
       message.success(`${ editId ? "O'zgartirish" : "Qo'shish"} muvaffaqiyatli amalga oshirildi!`);
     } catch (err) {
       console.error(err);
       message.error(`Xatolik yuz berdi: ${err.message}`);
     }
   };

  

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };
  
  const handleChangeGroup = (value: string) => {
    setSelectedGroup(value);
  };
  const handleChangeStatus = (value) => {
    setSelectedStatus(value);
    // handleStatusChange(value);
  };

   const handleChangePassword = () => {
     if(editId){
       setShowPasswordFields((prev) => !prev);
     }

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
              style={{ marginBottom: 20 }}
            >
              <Col>
                <h1 className="font-medium text-2xl">
                  O'quvchilar <span className="text-green-500">({total})</span>{" "}
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
                    onClick={() => {
                      showModal(form);
                      setShowPasswordFields(true);
                    }}
                  >
                    Student qo'shish
                  </Button>
                </Col>
              </div>
            </Row>
            <Row>
              <Select
                size="middle"
                defaultValue="Guruhlar"
                style={{ width: 250 , marginRight:"20px"}}
                onChange={handleChangeGroup}
              >
                <Select.Option key="" value="">
                  Guruhlar
                </Select.Option>
                {Array.isArray(groups) &&
                  groups.map((value) => (
                    <Select.Option key={value.id} value={value.id}>
                      {value.name}
                    </Select.Option>
                  ))}
              </Select>
              <Select
                size="middle"
                className="w-48"
                placeholder="Status tanlang"
                onChange={handleChangeStatus}
                allowClear
              >
                <Select.Option value=" "> Status </Select.Option>
                <Select.Option value="true">Faol</Select.Option>
                <Select.Option value="false">Faol emas</Select.Option>
              </Select>
            </Row>
          </>
        )}
        pagination={false}
        dataSource={data}
        columns={columns}
        rowKey="id"
      />
      {total > LIMIT ? (
        <Pagination
          className="pagination"
          total={total}
          pageSize={LIMIT}
          current={page}
          onChange={(page) => handlePage(page, navigate)}
        />
      ) : null}
      <Modal
        open={isModalOpen}
        title={editId ? "Studentni tahrirlash" : "Student qo'shish"}
        onCancel={handleCancel}
        footer={null}
        width={800}
      >
        <Form
          form={form}
          name="basic"
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }}
          style={{ maxWidth: 850, margin: "0 auto" }}
          onFinish={handleForm}
          autoComplete="off"
        >
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                label="Familiyasi"
                name="last_name"
                rules={[{ required: true, message: "Iltimos, to'ldiring!" }]}
              >
                <Input placeholder="Familiya" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Ismi"
                name="first_name"
                rules={[{ required: true, message: "Iltimos, to'ldiring!" }]}
              >
                <Input placeholder="Ismi" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Tug'ilgan kun"
                name="birthday"
                rules={[{ required: true, message: "Iltimos, to'ldiring!" }]}
              >
                <Input type="date" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                label="Telefon raqami 1"
                name="phone_number1"
                rules={[{ required: true, message: "Iltimos, to'ldiring!" }]}
              >
                <Input placeholder="Telefon raqami 1" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Telefon raqami 2" name="phone_number2">
                <Input placeholder="Telefon raqami 2" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Username" name={["user", "username"]}>
                <Input placeholder="Username" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            {showPasswordFields && (
              <>
                <Col span={8}>
                  <Form.Item label="Parol" name={["user", "password1"]}>
                    <Input.Password placeholder="Parol" />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="takrorlash" name={["user", "password2"]}>
                    <Input.Password placeholder="Parolni tasdiqlang" />
                  </Form.Item>
                </Col>
              </>
            )}
          </Row>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item label="Status" name="status">
                <Select placeholder="Status tanlang">
                  <Select.Option value={true}>Faol</Select.Option>
                  <Select.Option value={false}>Faol emas</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item wrapperCol={{ span: 24 }}>
                <Button
                  style={{ width: "100%" }}
                  type="primary"
                  htmlType="submit"
                >
                  {editId ? "O'zgartirish" : "Qo'shish"}
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
        {editId ? (
          <Button
            type="primary"
            htmlType="submit"
            onClick={handleChangePassword}
          >
            {editId ? "parolni yangilash" : "parol yaratish"}
          </Button>
        ) : null}
      </Modal>
    </Fragment>
  );
};

export default BranchStudents;
