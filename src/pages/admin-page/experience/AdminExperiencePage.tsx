import { Fragment, useCallback, useEffect, useState } from "react";
import {
  Form,
  Button,
  Input,
  Modal,
  Space,
  Table,
  Pagination,
  Select,
  Col,
  Row,
} from "antd";
import { useForm } from "antd/es/form/Form";
import { useNavigate, useParams } from "react-router-dom";
import {
  CloseOutlined,
  SearchOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";

import "./style.scss";
import { LIMIT } from "../../../constants";
import useExperience from "../../../states/adminExperience";
import { request } from "../../../request";

const { confirm } = Modal;
const ExperiencePageAdmin = () => {
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
    handleOk,
    handlePage,
  } = useExperience();

  const { branchId } = useParams<{ branchId: string }>();

  const [form] = useForm();
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [editId, setEditId] = useState<number | null>(null);
  const [branches, setBranches] = useState([] as any[]);
  const [selectedBranch, setSelectedBranch] = useState<string | null>(
    branchId || null
  );
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);

  const getRooms = useCallback(async () => {
    try {
      const { data } = await request.get(`branch/room/${branchId}`);
      setRooms(data.results);
    } catch (err) {
      console.log(err);
    }
  }, [branchId]);

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  useEffect(() => {
    getData(branchId);
    getRooms();
  }, [getData, getRooms, branchId]);

  const handleChangeBranch = (value: string) => {
    setSelectedBranch(value);
    getData(value);
  };

  const showDeleteConfirm = (id: number) => {
    confirm({
      title: "Bu filialni ro'yhatdan o'chirishni hohlaysizmi ?",
      icon: <ExclamationCircleOutlined />,
      content: "Bu amalni ortga qaytarib bo‘lmaydi.",
      okText: "ha",
      okType: "danger",
      cancelText: "ortga",
      onOk() {
        deleteRoom(id);
      },
      onCancel() {
        setDeleteModal(false);
      },
    });
  };

  const deleteRoom = useCallback(
    async (id: number) => {
      try {
        await request.delete(`branch/room-delete/${id}/`);
        getRooms();
        getData(branchId);
      } catch (err) {
        console.log(err);
      }
    },
    [getRooms, getData, branchId]
  );

  const editRoom = useCallback(
    async (id: number) => {
      try {
        const { data } = await request.get(`branch/room/${id}/`);
        const formattedData = {
          id: data.id,
          name: data.name,
          number: data.number,
          max_count: data.max_count,
          branch: data.branch.id,
        };
        setEditId(formattedData.id);
        form.setFieldsValue(formattedData);
      } catch (err) {
        console.error(err);
      }
    },
    [form]
  );

  const getBranches = useCallback(async () => {
    try {
      const { data } = await request.get(`branch/branches/`);
      setBranches(data.results);
    } catch (err) {
      console.log(err);
    }
  }, []);

  useEffect(() => {
    getBranches();
  }, [getBranches]);

  const handleForm = async (values: any) => {
    try {
      if (editId) {
        await request.put(`branch/room-update/${editId}/`, values);
      } else {
        await request.post("branch/room-create/", values);
      }
      setEditId(null);
      handleCancel();
      getRooms();
      getData(branchId);
    } catch (err) {
      console.error(err);
    }
  };

  const columns = [
    {
      title: "Xona nomi",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Xona raqami",
      dataIndex: "number",
      key: "number",
    },
    {
      title: "Xona sig'imi",
      dataIndex: "max_count",
      key: "max_count",
    },
    {
      title: "Fillial",
      render: (data: any) => data.branch.name,
      key: "branch",
    },
    {
      title: "Action",
      dataIndex: "id",
      key: "id",
      render: (id: number) => (
        <Space size="middle">
          <Button
            style={{ backgroundColor: "green" }}
            onClick={() => {
              showModal(form);
              setEditId(id);
              editRoom(id);
            }}
            type="primary"
          >
            Edit
          </Button>
          <Button
            onClick={() => showDeleteConfirm(id)}
            type="primary"
            style={{
              backgroundColor: "red",
            }}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  const selectedBranchName =
    branches.find((branch) => branch.id === branchId)?.name || "";

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
        style={{ width: "1300px" }}
        title={() => (
          <>
            <Row
              justify="space-between"
              align="middle"
              style={{ marginBottom: 20 }}
            >
              <Col>
                <h1>
                  {selectedBranchName} / Xonalar ({total})
                </h1>
              </Col>
              <div
                style={{ display: "flex", alignItems: "center", gap: "70px" }}
              >
                <Col>
                  <div className="search-box">
                    <Input
                      onChange={(e) => SearchSkills(e)}
                      className={
                        isSearchOpen ? "searchInput open" : "searchInput"
                      }
                      placeholder="Search..."
                    />
                    <a href="#" onClick={toggleSearch}>
                      {isSearchOpen ? (
                        <CloseOutlined style={{ color: "white" }} />
                      ) : (
                        <SearchOutlined />
                      )}
                    </a>
                  </div>
                </Col>
                <Col>
                  <Button
                    className="Add"
                    type="primary"
                    onClick={() => showModal(form)}
                  >
                    <div className="center">
                      <button className="btn">
                        <svg
                          width="180px"
                          height="60px"
                          viewBox="0 0 180 60"
                          className="border"
                        >
                          <polyline
                            points="179,1 179,59 1,59 1,1 179,1"
                            className="bg-line"
                          />
                          <polyline
                            points="179,1 179,59 1,59 1,1 179,1"
                            className="hl-line"
                          />
                        </svg>
                        <span>Xona qo'shish</span>
                      </button>
                    </div>
                  </Button>
                </Col>
              </div>
            </Row>
          </>
        )}
        pagination={false}
        dataSource={data}
        columns={columns}
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
        title="Title"
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={() => form.submit()}>
            {editId ? "Saqlash" : "Yaratish"}
          </Button>,
        ]}
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
          <Form.Item
            label="Xona nomi"
            name="name"
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
            label="Xona raqami"
            name="number"
            rules={[
              {
                required: true,
                message: "Please input skill name!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Xona sig'imi"
            name="max_count"
            rules={[
              {
                required: true,
                message: "Please input category description!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Fillial"
            name="branch"
            rules={[
              {
                required: true,
                message: "Please input category description!",
              },
            ]}
          >
            <Select style={{ width: 120 }}>
              {branches.map((branch) => (
                <Select.Option key={branch.id} value={branch.id}>
                  {branch.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </Fragment>
  );
};

export default ExperiencePageAdmin;
