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
import { ExclamationCircleOutlined } from "@ant-design/icons";

import { useForm } from "antd/es/form/Form";
import { useNavigate, useParams } from "react-router-dom";
import { CloseOutlined, SearchOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
import { LIMIT } from "../../../constants";
import { request } from "../../../request";
import useStudent from "../../../states/adminStudents";
import { patchChanges, removeNullish } from "../../../utils/functions";
import useDebotStudent from "../../../states/debtorStudent";

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
  const [editId, setEditId] = useState(null);
  const [originalData, setOriginalData] = useState({});
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(false);

   ////// delete modal states ////
  const [deleteModal, setDeleteModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      await getData(selectedBranch);
      await getBranches();
    };
    fetchData();
  }, [getData, selectedBranch]);

  const getBranches = useCallback(async () => {
    try {
      const { data } = await request.get("branch/branches/");
      setBranches(data.results);
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
          width={80}
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
      title: "Telefon raqam",
      dataIndex: "phone_number1",
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
            style={{ backgroundColor: "green" }}
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
    async (id:number) => {
      try {
        const { data } = await request.get(`account/student-profile/${id}/`);
        console.log(data, "data");
        
        const formattedData = {
          id: data.id,
          last_name: data.last_name,
          first_name: data.first_name,
          phone_number1: data.phone_number1,
          phone_number2: data.phone_number2,
          user: {
            id:data.user.id,
            password: data.user.password,
            username: data.user.username,
          },
          branch: data.branch.id,
          birthday: data.birthday,
          status: data.status,
        };
        setEditId(formattedData.id);
        setOriginalData(data);
        form.setFieldsValue(formattedData);
      } catch (err) {
        console.error(err);
      }
    },
    [form]
  );
console.log(originalData, "originalData");

  const handleChangeBranch = (value:string) => {
    setSelectedBranch(value);
  };

  const handleForm = async (formData) => {
    try {
      const values = await form.validateFields();
      if (editId) {
        const payload = patchChanges(originalData, removeNullish(formData));
        await request.patch(`account/student-profile-update/${editId}/`, payload);
      } else {
        await request.post("/account/student-profile-create/", values);
      }
      setEditId(null);
      handleCancel();
      getData();
    } catch (err) {
      if(err) toast.error(err.message);
      console.error(err);
    }
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
        style={{width:'1300px'}}
        title={() => (
          <>
            <Row justify="space-between" align="middle" style={{ marginBottom: 20 }}>
              <Col>
                <h1>O'quvchilar ({total})</h1>
              </Col>
              <div style={{ display: "flex", alignItems: "center", gap: "70px" }}>
                <Col>
                  <div className="search-box">
                    <Input
                      onChange={(e)=>{
                        SearchSkills(e);
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
                        <span>O'quvchi yaratish</span>
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
                {Array.isArray(branches) &&
                  branches.map((value) => (
                    <Select.Option key={value.id} value={value.id}>
                      {value.name}
                    </Select.Option>
                  ))}
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
        title={editId ? "Edit Student" : "Create Student"}
        onCancel={handleCancel}
        footer={null}
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
            maxWidth: 600,
          }}
          initialValues={{
            remember: true,
          }}
          onFinish={handleForm}
          autoComplete="off"
          form={form}
        >
          <div style={{ display: "flex", gap: "10px" }}>
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
          </div>

          <Form.Item
            label="Tug'ilgan kun"
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

          <div style={{ display: "flex", gap: "10px" }}>
            <Form.Item
              label="telefon raqami 1"
              name="phone_number1"
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
              label="telefon raqami 2"
              name="phone_number2"
            >
              <Input />
            </Form.Item>
          </div>
          <Form.Item
            label="Username"
            name={["user", "username"]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Parol"
            name={["user", "password"]}
          >
            <Input />
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
            <Select style={{ width: "100%" }}>
              {branches.map((value) => (
                <Select.Option key={value.id} value={value.id}>
                  {value.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Status"
            name="status"
          >
            <Select placeholder="Status tanlang" onChange={handleChangeStatus}>
              <Select.Option value={true}>Active</Select.Option>
              <Select.Option value={false}>Inactive</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            wrapperCol={{
              span: 24,
            }}
          >
            <Button
              style={{
                width: "100%",
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

export default AdminStudents;
