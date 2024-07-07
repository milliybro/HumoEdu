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
  } = useSchedule();
  const { scheduleId } = useParams();
  const [form] = useForm();
  const [schedule, setSchedule] = useState([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [science, setScience] = useState([]);
  const [selectedScience, setSelectedScience] = useState<string | null>(null);
  const [originalData, setOriginalData] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // Yangi holat (state) qo'shildi

  const getSchedule = useCallback(async () => {
    try {
      const { data } = await request.get(
        `group/lessonschedules/?group=${scheduleId}`
      );
      setSchedule(data);
      setOriginalData(data); // Asl ma'lumotlarni saqlaymiz
    } catch (err) {
      console.error("Failed to fetch schedule:", err);
      setSchedule([]); // Optionally reset schedule on error
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

      if (currentRecord) {
        await request.patch(
          `group/lessonschedule-update/${currentRecord.id}/`,
          formattedValues
        );
      } else {
        await request.post("group/lessonschedule-create/", formattedValues);
      }

      getData();
      getSchedule();
      handleCancel();
      form.resetFields();
      setEditModalVisible(false);
      setCurrentRecord(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async () => {
    try {
      await request.delete(`group/lessonschedule-delete/${deleteItemId}/`);
      setDeleteModalVisible(false);
      getData();
      getSchedule();
    } catch (err) {
      console.error("Failed to delete schedule:", err);
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

  const getRooms = useCallback(async () => {
    try {
      const res = await request.get(`branch/rooms/`);
      setRooms(res.data.results);
    } catch (err) {
      console.error("Failed to fetch rooms:", err);
    }
  }, []);

  useEffect(() => {
    getSchedule();
    getScience();
    getRooms();
  }, [getSchedule, getScience, getRooms]);

  const handleEdit = (record) => {
    setCurrentRecord(record);
    form.setFieldsValue({
      room: record.room.id,
      group: record.group.id,
      days: record.days,
      start_time: record.start_time,
      end_time: record.end_time,
    });
    setEditModalVisible(true);
  };

  const handleCreateSchedule = () => {
    setCurrentRecord(null);
    form.resetFields();
    setEditModalVisible(true);
  };

  const handleConfirmDelete = (record) => {
    setDeleteItemId(record.id);
    setDeleteModalVisible(true);
  };

  const handleCancelDelete = () => {
    setDeleteModalVisible(false);
    setDeleteItemId(null);
  };

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
    {
      title: "Actions",
      render: (record) => (
        <Space size="middle">
          <Button type="primary" onClick={() => handleEdit(record)}>
            Edit
          </Button>
          <Button
            type="primary"
            danger
            onClick={() => handleConfirmDelete(record)}
          >
            Delete
          </Button>
        </Space>
      ),
      key: "actions",
    },
  ];

  const handleChangeScience = (value) => {
    setSelectedScience(value);
  };

  useEffect(() => {
    getData(selectedScience);
  }, [getData, selectedScience]);

  useEffect(() => {
    if (searchTerm === "") {
      setSchedule(originalData);
    } else {
      const filteredSchedule = originalData.filter((item) =>
        item.room.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSchedule(filteredSchedule);
    }
  }, [searchTerm, originalData]);

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
                <h1>Dars jadvali ({schedule ? schedule.length : 0})</h1>
              </Col>
              <div
                style={{ display: "flex", alignItems: "center", gap: "70px" }}
              >
                <Col>
                  <div className="search-box">
                    <Input
                      onChange={(e) => setSearchTerm(e.target.value)}
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
                  <Button type="primary" onClick={handleCreateSchedule}>
                    Dars jadvali yaratish
                  </Button>
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
      <Pagination
        style={{ paddingTop: "20px", float: "right" }}
        onChange={handlePage}
        current={page}
        total={total}
        pageSize={LIMIT}
      />
      <Modal
        title={currentRecord ? "Edit Schedule" : "Create Schedule"}
        open={editModalVisible}
        onOk={handleOk}
        onCancel={() => setEditModalVisible(false)}
        okText={currentRecord ? "Save Changes" : "Create"}
        cancelText="Cancel"
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Xona"
            name="room"
            rules={[{ required: true, message: "Iltimos xonani tanlang" }]}
          >
            <Select placeholder="Xonani tanlang">
              {rooms.map((room) => (
                <Select.Option key={room.id} value={room.id}>
                  {room.number} - {room.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="Guruh"
            name="group"
            rules={[{ required: true, message: "Iltimos guruhni tanlang" }]}
          >
            <Select placeholder="Guruhni tanlang">
              {science.map((group) => (
                <Select.Option key={group.id} value={group.id}>
                  {group.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="Kunlar"
            name="days"
            rules={[{ required: true, message: "Iltimos kunlarni tanlang" }]}
          >
            <Checkbox.Group options={options} />
          </Form.Item>
          <Form.Item
            label="Boshlanish vaqti"
            name="start_time"
            rules={[
              { required: true, message: "Iltimos boshlanish vaqtini tanlang" },
            ]}
          >
            <Input type="time" />
          </Form.Item>
          <Form.Item
            label="Tugash vaqti"
            name="end_time"
            rules={[
              { required: true, message: "Iltimos tugash vaqtini tanlang" },
            ]}
          >
            <Input type="time" />
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="Confirm Deletion"
        open={deleteModalVisible}
        onOk={handleDelete}
        onCancel={handleCancelDelete}
        okText="Delete"
        cancelText="Cancel"
        width={600}
      >
        <p>Are you sure you want to delete this schedule?</p>
      </Modal>
    </Fragment>
  );
};

export default AdminSchedule;
