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
  message
} from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";

import { useForm } from "antd/es/form/Form";
import { useNavigate } from "react-router-dom";
import { CloseOutlined, SearchOutlined } from "@ant-design/icons";
// import { toast } from "react-toastify";
import { LIMIT } from "../../../constants";
import { request } from "../../../request";
import useStudent from "../../../states/adminStudents";
// import { patchChanges, removeNullish } from "../../../utils/functions";
// import useDebotStudent from "../../../states/debtorStudent";
import { Student } from '../../teacher-page/types';

const { confirm } = Modal;

const AdminStudents = () => {
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
   
  // const { branchId } = useParams();
  const [form] = useForm();
  const navigate = useNavigate();
  const [branches, setBranches] = useState([]);
  const [groups, setGroups] = useState([]);
  const [editId, setEditId] = useState(null);
  const [originalData, setOriginalData] = useState({});
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(false);
 const [showPasswordFields, setShowPasswordFields] = useState(false);
   ////// delete modal states ////
  const [deleteModal, setDeleteModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      await getData(
        selectedBranch,
        null,
        null,
        null,
        null,
        null,
        selectedStatus,
        selectedGroup
      ); // selectedGroup qo'shildi
      await getBranches();
    };
    fetchData();
  }, [getData, selectedBranch, selectedGroup,selectedStatus]);

  const getBranches = useCallback(async () => {
    try {
      const { data } = await request.get("branch/branches/");
      setBranches(data.results);
    } catch (err) {
      console.error(err);
    }
  }, []);

  const getGroups = useCallback(async (branchId:number) => {
    try {
      const { data } = await request.get(`group/groups/?branch=${branchId}`);
      setGroups(data.results);
    } catch (err) {
      console.error(err);
    }
  }, []);

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

  const editStudent= async (id) => {
    try {
      const { data } = await request.get(`account/student-profile/${id}/`);
      setOriginalData(data);

      const formattedData = {
        id: data.id,
        last_name: data.last_name,
        first_name: data.first_name,
        phone_number1: data.phone_number1,
        phone_number2: data.phone_number2,
        user: {
          id: data.user.id,
          username: data.user.username,
          password1: "", // Bu erda backenddan olishga kerak
          password2: "", // Bu erda backenddan olishga kerak
        },
        branch: data.branch.id,
        birthday: data.birthday,
        status: data.status,
      };

      form.setFieldsValue(formattedData);
    } catch (err) {
      console.error(err);
    }
  };
// console.log(originalData, "originalData");

  const handleChangeBranch = (value:string) => {
    setSelectedBranch(value);
    getGroups(value);
  };
  const handleChangeGroup = (value: string) => {
    setSelectedGroup(value);
  };
 
 
   

   const handleForm = async (formData) => {
     try {
      if (formData.user && !formData.user.roles) {
        formData.user.roles = "student";
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
       } else {
         
         await request.post("/account/student-profile-create/", formData);
       }

       setEditId(null);
       handleCancel();
       getData();
       message.success(
         `${
           editId ? "O'zgartirish" : "Qo'shish"
         } muvaffaqiyatli amalga oshirildi!`
       );
     } catch (err) {
       console.error(err);
       message.error(`Xatolik yuz berdi: ${err.message}`);
     }
   };

    const handleChangePassword = () => {
      setShowPasswordFields((prev) => !prev);
    };
  /////// delete modal /////
    const showDeleteConfirm = (id: number) => {
      confirm({
        title: "Bu o'quvchini ro'yhatdan o'chirishni hohlaysizmi ?",
        icon: <ExclamationCircleOutlined />,
        content: "Bu amalni ortga qaytarib bo‘lmaydi.",
        okText: "ha",
        okType: "danger",
        cancelText: "ortga",
        onOk() {
          deleteStudent(id);
        },
        onCancel() {
          setDeleteModal(false);
        },
      });
    }; 

    const deleteStudent = useCallback(
      async (id: number) => {
        setDeleteModal(true);
        try {
          await request.delete(`account/student-profile-delete/${id}/`);
          getData(); // Refresh data after deletion
        } catch (err) {
          console.log(err);
        } finally {
          setDeleteModal(false);
        }
      },
      [getData]
    );
  const [isSearchOpen, setIsSearchOpen] = useState(false);
 
  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  ////// search input function code start /////
  
  ///// search input function code end ///////

  const handleChangeStatus = (value) => {
    setSelectedStatus(value);
    handleStatusChange(value);
  };

  return (
    <Fragment>
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
                    onClick={() => showModal(form)}
                  >
                    Student qo'shish
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
                {Array.isArray(branches) &&
                  branches.map((value) => (
                    <Select.Option key={value.id} value={value.id}>
                      {value.name}
                    </Select.Option>
                  ))}
              </Select>
              <Select
                size="middle"
                defaultValue="Guruhlar"
                style={{ width: 250 }}
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
            <Col span={8}>
              <Form.Item
                label="Filiali"
                name="branch"
                rules={[{ required: true, message: "Iltimos, to'ldiring!" }]}
              >
                <Select
                  style={{ width: "100%" }}
                  placeholder="Filialni tanlang"
                >
                  {branches.map((branch) => (
                    <Select.Option key={branch.id} value={branch.id}>
                      {branch.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
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
        <Button type="primary" htmlType="submit" onClick={handleChangePassword}>
          Parolni o'zgartirish
        </Button>
      </Modal>
    </Fragment>
  );
};

export default AdminStudents;
