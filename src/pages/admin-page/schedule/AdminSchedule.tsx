import { Fragment, useCallback, useEffect, useState } from "react";
import { Form, Button, Input, Modal, Space, Table, Pagination, Row, Col, Select, Checkbox } from "antd";
import { useForm } from "antd/es/form/Form";
import { useNavigate, useParams } from "react-router-dom";
import useExperience from "../../../states/adminExperience";
import { LIMIT } from "../../../constants";
import { request } from "../../../request";
import useSchedule from "../../../states/adminSchedule";
import { CloseOutlined, SearchOutlined } from "@ant-design/icons";

const AdminSchedule = () => {
  const { total, loading, isModalOpen, page, getData, editData, deleteData, showModal, handleCancel, handlePage, SerachSkills } = useSchedule();

  const { scheduleId } = useParams();
  const [form] = useForm();
  const [schedule, setSchedule] = useState([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [science, setScience] = useState([]);
  const [selectedScience, setSelectedScience] = useState<string | null>(null);

  const getSchedule = useCallback(async () => {
    try {
      const { data } = await request.get(`group/lessonschedules/?group=${scheduleId}`);
      if (Array.isArray(data)) {
        setSchedule(data);
      } else {
        console.error("Data received is not an array:", data);
        setSchedule([]);
      }
    } catch (err) {
      console.error("Failed to fetch schedule:", err);
    }
  }, [scheduleId]);
  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      if (editId) {
        values.id = editId;
        await request.put(`group/lessonschedule-update/${editId}/`, values);
      } else {
        await request.post("group/lessonschedule-create/", values);
      }
      getData();
      getSchedule();
      setEditId(null);
      handleCancel();
      form.resetFields();
    } catch (err) {
      console.error(err);
    }
  };
  const getScience = useCallback(async () => {
    try {
      const res = await request.get(`group/groups/`);
      setScience(res.data.results);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    getSchedule();
    getScience();
  }, [getSchedule]);

  const columns = [
    {
      title: "Xona nomi",
      dataIndex: "room",
      key: "room",
    },
    {
      title: "Guruh",
      render: (record) => record.group.name,
      key: "group",
    },
    {
      title: "Kunlar",
      render: (record) => (
        <div style={{ display: "flex", flexDirection: "row" }}>
          <h5>{" " + record.days + ""} </h5>
        </div>
      ),
      key: "group",
    },
    {
      title: "Boshlanish vaqti",
      dataIndex: "start_time",
      key: "start_time",
    },
    {
      title: "Tugash vaqti",
      dataIndex: "end_time",
      key: "end_time",
    },
    {
      title: "Action",
      dataIndex: "id",
      key: "id",
      render: (id) => (
        <Space size="middle">
          <Button
            onClick={() => {
              showModal(form);
              setEditId(id);
              editSchedule(id);
            }}
            type="primary"
            style={{ backgroundColor: "green" }}
          >
            Edit
          </Button>
          <Button onClick={() => deleteSchedule(id)} type="primary" style={{ backgroundColor: "red" }}>
            Delete
          </Button>
        </Space>
      ),
    },
  ];
  const handleChangeScience = (value) => {
    setSelectedScience(value);
  };

  useEffect(() => {
    getData(selectedScience);
  }, [getData, selectedScience]);

  const editSchedule = useCallback(
    async (id) => {
      try {
        const { data } = await request.get(`group/lessonschedule/${id}/`);
        const formattedData = {
          id: data.id,
          room: data.room,
          group: data.group.name,
          days: data.days,
          start_time: data.start_time,
          end_time: data.end_time,
        };
        setEditId(formattedData.id);
        form.setFieldsValue(formattedData);
      } catch (err) {
        console.error(err);
      }
    },
    [form]
  );
  const deleteSchedule = useCallback(
    async (id) => {
      try {
        await request.delete(`group/lessonschedule-delete/${id}/`);
        getSchedule();
      } catch (err) {
        console.error(err);
      }
    },
    [getData]
  );
  const options = [
    { label: "Dushanba", value: "Dushanba" },
    { label: "Seshanba", value: "Seshanba" },
    { label: "Chorshanba", value: "Chorshanba" },
    { label: "Payshanba", value: "Payshanba" },
    { label: "Juma", value: "Juma" },
    { label: "Shanba", value: "Shanba" },
  ];

  const onChange = (value) => {
    console.log(value);
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
        title={() => (
          <>
            <Row justify="space-between" align="middle" style={{ marginBottom: 20 }}>
              <Col>
                <h1>Dars jadvali ({schedule.length})</h1>
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
                        <span>Fillial qo'shish</span>
                      </button>
                    </div>
                  </Button>
                </Col>
              </div>
            </Row>
            <Row justify="start" align="middle" style={{ gap: "20px" }} className="filtrTable"></Row>
          </>
        )}
        pagination={false}
        dataSource={schedule}
        columns={columns}
      />
      {total > LIMIT && <Pagination className="pagination" total={total} pageSize={LIMIT} current={page} onChange={handlePage} />}
      <Modal visible={isModalOpen} title="Dars jadvali qo'shish" onCancel={handleCancel} footer={null}>
        <Form form={form} layout="vertical" onFinish={() => handleOk(form)}>
          <Form.Item label="Xona" name="room" rules={[{ required: true, message: "Please fill!" }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Guruh" name="group" rules={[{ required: true, message: "Please fill!" }]}>
            <Select placeholder="Fan tanlang" onChange={handleChangeScience} allowClear>
              {science.map((value) => (
                <Select.Option key={value.id} value={value.id}>
                  {value.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="Hafta kunlari" name="days" rules={[{ required: true, message: "Please fill!" }]}>
            <Checkbox.Group options={options} defaultValue={["Apple"]} onChange={onChange} />
          </Form.Item>
          <Form.Item label="Boshlanish vaqti" name="start_time" rules={[{ required: true, message: "Please input start time!" }]}>
            <Input type="time" />
          </Form.Item>
          <Form.Item label="Tugash vaqti" name="end_time" rules={[{ required: true, message: "Please input end time!" }]}>
            <Input type="time" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
              Add
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </Fragment>
  );
};

export default AdminSchedule;
