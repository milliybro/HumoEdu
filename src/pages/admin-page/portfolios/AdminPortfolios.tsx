import React, { Fragment, useCallback, useEffect, useState } from "react";
import { Form, Button, Input, Modal, Space, Table, Pagination, Row, Col, Select, Checkbox } from "antd";
import { useForm } from "antd/lib/form/Form";
import { CloseOutlined, SearchOutlined } from "@ant-design/icons";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import usePortfolios from "../../../states/adminPortfolios";
import { request } from "../../../request";
import { LIMIT } from "../../../constants";
import "./style.scss";

const { confirm } = Modal;
const PortfoliosPageAdmin = () => {
  const {
    total,
    loading,
    isModalOpen,
    data,
    page,
    getData,
    SearchSkills,
    showModal,
    handleCancel,
    handlePage,
    handleStatusChange,
  } = usePortfolios();
  
  const [editId, setEditId] = useState(null);
  const [form] = useForm();
  const navigate = useNavigate();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");
   const [deteleModal , setDeleteModal] = useState(false);
  useEffect(() => {
    getData();
  }, [getData]);

  const formatDateTime = (dateTimeStr) => {
    const options = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };
    const dateTime = new Date(dateTimeStr);
    return dateTime.toLocaleString("en-US", options).replace(",", "");
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      if (editId) {
        values.id = editId;
        await request.put(`branch/branch-update/${editId}/`, values);
      } else {
        await request.post("branch/branch-create/", values);
      }
      setEditId(null);
      handleCancel();
      getData();
      form.resetFields();
    } catch (err) {
      console.error(err);
    }
  };

  const handleChangeStatus = (value) => {
    setSelectedStatus(value);
    handleStatusChange(value);
  };

  const editBranch = useCallback(
    async (id) => {
      try {
        const { data } = await request.get(`branch/branch/${id}/`);
        const formattedData = {
          id: data.id,
          name: data.name,
          address: data.address,
          start_at: moment(data.start_at).format("YYYY-MM-DD"),
          end_at: moment(data.end_at).format("YYYY-MM-DD"),
          status: data.status,
        };
        setEditId(formattedData.id);
        form.setFieldsValue(formattedData);
      } catch (err) {
        console.error(err);
      }
    },
    [form]
  );
 ////////////  delete modal   ////////////////
 const showDeleteConfirm = (id: number) => {
   confirm({
     title: "Bu filialni ro'yhatdan o'chirishni hohlaysizmi ?",
     icon: <ExclamationCircleOutlined />,
     content: "Bu amalni ortga qaytarib bo‘lmaydi.",
     okText: "ha",
     okType: "danger",
     cancelText: "ortga",
     onOk() {
       deleteBranch(id);
     },
     onCancel() {
       setDeleteModal(false);
     },
   });
 };

 ///////////  delete funtion ///////////
  const deleteBranch = useCallback(
    async (id) => {
      try {
        await request.delete(`branch/branch-delete/${id}/`);
        getData();
      } catch (err) {
        console.error(err);
      }
    },
    [getData]
  );

  const nextRoom = (id) => {
    localStorage.setItem("branchId", String(id));
    navigate(`/adminBranch/${id}`);
  };

  const columns = [
    {
      title: "N",
      dataIndex: "index",
      key: "index",
      render: (text, record, index) => index + 1,
    },
    {
      title: "Fillial nomi",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Manzil",
      dataIndex: "address",
      key: "address",
      render: (address) => (
        <a href={address} target="_blank" rel="noopener noreferrer">
          {address}
        </a>
      ),
    },
    {
      title: "Ishga tushirilgan vaqti",
      dataIndex: "start_at",
      key: "start_at",
      render: (startAt) =>
        startAt !== null ? formatDateTime(startAt) : "Ishga tushirilmagan",
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
              editBranch(id);
            }}
            type="primary"
          >
            Edit
          </Button>
          <Button
            onClick={() => showDeleteConfirm(id)}
            type="primary"
            style={{ backgroundColor: "#f54949" }}
          >
            Delete
          </Button>
          <Button onClick={() => nextRoom(id)}>Xonalarni ko'rish</Button>
        </Space>
      ),
    },
  ];

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
                <h1>Filliallar ({total})</h1>
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
                size="large"
                defaultValue=""
                style={{ width: 250 }}
                onChange={handleChangeStatus}
                options={[
                  { value: "", label: "Hammasi" },
                  { value: "false", label: "Faoliyada emas" },
                  { value: "true", label: "Faoliyatda" },
                ]}
              />
            </Row>
          </>
        )}
        pagination={false}
        dataSource={data}
        columns={columns}
      />
      {(total > LIMIT || total > data.length) && (
        <Pagination
          className="pagination"
          total={total}
          pageSize={LIMIT}
          current={page}
          onChange={(page) => handlePage(page, navigate)}
        />
      )}
      <Modal
        visible={isModalOpen}
        title="Fillial "
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          name="basic"
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }}
          style={{ maxWidth: 600 }}
          initialValues={{ remember: true }}
          onFinish={handleOk}
          autoComplete="off"
          form={form}
        >
          <Form.Item
            label="Fillial"
            name="name"
            rules={[{ required: true, message: "Please input skill name!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Manzil"
            name="address"
            rules={[{ required: true, message: "Please fill!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="Ishga tushirilgan vaqti" name="start_at">
            <Input type="date" />
          </Form.Item>
          <Form.Item label="Yopilgan vaqti" name="end_at">
            <Input type="date" />
          </Form.Item>
          <Form.Item name="status" valuePropName="checked">
            <Checkbox> Faoliyatda</Checkbox>
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 0, span: 24 }}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </Fragment>
  );
};

export default PortfoliosPageAdmin;
