import { Fragment, useCallback, useEffect, useState } from "react";
import { Form, Button, Flex, Input, Modal, Space, Table, Pagination, Select, Col, Row } from "antd";
import { useForm } from "antd/es/form/Form";
import { useNavigate, useParams } from "react-router-dom";
import { CloseOutlined, SearchOutlined } from "@ant-design/icons";

import "./style.scss";
import { LIMIT } from "../../../constants";
import useExperience from "../../../states/adminExperience";
import { request } from "../../../request";

const RoomsPageAdmin = () => {
  const { total, loading, isModalOpen, data, page, getData, editData, deleteData, SerachSkills, showModal, handleCancel, handleOk, handlePage } = useExperience();

  const { branchId } = useParams<{ branchId: string }>();

  const [form] = useForm();
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [editId, setEditId] = useState<number | null>(null);
  const [branch, setBranch] = useState([] as any[]);
  const [branchName, setBranchName] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<string | null>(null);

  const getRooms = useCallback(async () => {
    try {
      const { data } = await request.get(`branch/rooms/`);
      setRooms(data.results); // Assuming 'data' is an array of room objects
    } catch (err) {
      console.log(err);
    }
  }, []);

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

  const deleteRoom = useCallback(
    async (id: number) => {
      try {
        await request.delete(`branch/room-delete/${id}/`);
        getRooms();
        getData(); // Refresh data after deletion
      } catch (err) {
        console.log(err);
      }
    },
    [getData, getRooms]
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

  const getRoomName = useCallback(async () => {
    try {
      const { data } = await request.get(`branch/room/${branchId}/`);
      setBranchName(data.branch.name);
    } catch (err) {
      console.log(err);
    }
  }, []);

  console.log(branchName);

  const getBranch = useCallback(async () => {
    try {
      const res = await request.get(`branch/branches/`);
      const data = res.data;
      setBranch(data.results);
    } catch (err) {
      console.log(err);
    }
  }, []);

  useEffect(() => {
    getBranch();
    getRoomName();
  }, [getBranch, getRoomName]);

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
      getData(); // Refresh data after adding new staff or editing existing one
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
              setEditId(id); // Set the id when Edit button is clicked
              editRoom(id);
            }}
            type="primary"
          >
            Edit
          </Button>
          <Button
            onClick={() => deleteRoom(id)}
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
                <h1>{branchName} / Xonalar ({total})</h1>
              </Col>
              <div style={{ display: "flex", alignItems: "center", gap: "70px" }}>
                <Col>
                  <div className="search-box">
                    <Input onChange={(e) => SerachSkills(e)} className={isSearchOpen ? "searchInput open" : "searchInput"} placeholder="Search..." />
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
                        <span>Xona qo'shish</span>
                      </button>
                    </div>
                  </Button>
                </Col>
              </div>
            </Row>
            <Row justify="start" align="middle" style={{ gap: "20px" }} className="filtrTable">
              <Select size="large" defaultValue={branchName} style={{ width: 250 }} onChange={handleChangeBranch}>
                <Select.Option key={branchName} value={branchName}>
                  {branchName ? branchName : "Filliallar"}
                </Select.Option>
                {branch.map((value) => (
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
      />
      {total > LIMIT ? <Pagination className="pagination" total={total} pageSize={LIMIT} current={page} onChange={(page) => handlePage(page, navigate)} /> : null}
      <Modal
        visible={isModalOpen}
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
              {branch.map((value) => (
                <Select.Option key={value.id} value={value.id}>
                  {value.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </Fragment>
  );
};

export default RoomsPageAdmin;
