import { Fragment, useCallback, useEffect, useState } from "react";
import {
  Form,
  Button,
  Input,
  Modal,
  Space,
  Table,
  Pagination,
  Row,
  Col,
  Select,
  Checkbox,
  Tag,
} from "antd";
import { useForm } from "antd/es/form/Form";
import { useParams } from "react-router-dom";
import { LIMIT } from "../../../constants";
import { request } from "../../../request";
import useSchedule from "../../../states/adminSchedule";
import { CloseOutlined, SearchOutlined } from "@ant-design/icons";
import { removeNullish, patchChanges } from "../users/functions";

const AdminSchedule = () => {
  const {
    total,
    loading,
    isModalOpen,
    page,
    getData,
    showModal,
    handleCancel,
    handlePage,
    SearchSkills,
  } = useSchedule();
  const { scheduleId } = useParams();
  const [form] = useForm();
  const [schedule, setSchedule] = useState([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [science, setScience] = useState([]);
  const [selectedScience, setSelectedScience] = useState<string | null>(null);
  const [originalData, setOriginalData] = useState(null);
  const [rooms, setRooms] = useState([]);

  const getSchedule = useCallback(async () => {
    try {
      const { data } = await request.get(
        `group/lessonschedules/?group=${scheduleId}`
      );
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

      const formattedValues = {
        ...values,
        days: Array.isArray(values.days) ? values.days : [],
        group: values.group || null,
        room: values.room || null,
        start_time: values.start_time || null,
        end_time: values.end_time || null,
      };

      await request.post("group/lessonschedule-create/", formattedValues);

      getData();
      getSchedule();
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
  }, [getSchedule, getScience]);

  const columns = [
    {
      title: "Xona raqami",
      render: (record) => record.room.number,
      key: "room",
    },
    {
      title: "Xona nomi",
      render: (record) => record.room.name,
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
          <Tag>{" " + record.days + " "} </Tag>
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
  ];

  const handleChangeScience = (value) => {
    setSelectedScience(value);
  };

  useEffect(() => {
    getData(selectedScience);
  }, [getData, selectedScience]);

  const options = [
    { label: "Dushanba", value: "Dushanba" },
    { label: "Seshanba", value: "Seshanba" },
    { label: "Chorshanba", value: "Chorshanba" },
    { label: "Payshanba", value: "Payshanba" },
    { label: "Juma", value: "Juma" },
    { label: "Shanba", value: "Shanba" },
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
        style={{ width: "1300px" }}
        title={() => (
          <>
            <Row
              justify="space-between"
              align="middle"
              style={{ marginBottom: 20 }}
            >
              <Col>
                <h1>Dars jadvali ({schedule.length})</h1>
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
              </div>
            </Row>
            <Row
              justify="start"
              align="middle"
              style={{ gap: "20px" }}
              className="filtrTable"
            ></Row>
          </>
        )}
        pagination={false}
        dataSource={schedule}
        columns={columns}
      />
      {total > LIMIT && (
        <Pagination
          className="pagination"
          total={total}
          pageSize={LIMIT}
          current={page}
          onChange={handlePage}
        />
      )}
      <Modal
        open={isModalOpen}
        title="Dars jadvali qo'shish"
        onCancel={handleCancel}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleOk}>
          <Form.Item
            label="Xona"
            name="room"
            rules={[{ required: true, message: "Please fill!" }]}
          >
            <Select placeholder="Xona tanlang" allowClear>
              {rooms.map((room) => (
                <Select.Option key={room.id} value={room.id}>
                  {room.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="Guruh"
            name="group"
            rules={[{ required: true, message: "Please fill!" }]}
          >
            <Select
              placeholder="Fan tanlang"
              onChange={handleChangeScience}
              allowClear
            >
              {science.map((value) => (
                <Select.Option key={value.id} value={value.id}>
                  {value.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="Hafta kunlari"
            name="days"
            rules={[{ required: true, message: "Please fill!" }]}
          >
            <Checkbox.Group options={options} />
          </Form.Item>
          <Form.Item
            label="Boshlanish vaqti"
            name="start_time"
            rules={[{ required: true, message: "Please input start time!" }]}
          >
            <Input type="time" />
          </Form.Item>
          <Form.Item
            label="Tugash vaqti"
            name="end_time"
            rules={[{ required: true, message: "Please input end time!" }]}
          >
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
