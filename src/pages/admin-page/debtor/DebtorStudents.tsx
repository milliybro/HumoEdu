import React, { useEffect, useState, useCallback } from "react";
import {
  Table,
  Button,
  Checkbox,
  message,
  Modal,
  Spin,
  Select,
  Input,
} from "antd";
import { CheckboxChangeEvent } from "antd/es/checkbox";
import { request } from "../../../request";
import moment from "moment";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

const { Option } = Select;
const { TextArea } = Input;

interface Student {
  id: number;
  last_name: string;
  first_name: string;
  balance: string;
  user: {
    id: number;
    username: string;
    roles: string;
  };
  branch: {
    id: number;
    name: string;
    address: string;
    start_at: string;
    created_at: string;
    end_at: string | null;
    status: boolean;
  };
  group: {
    id: number;
    name: string;
  }[];
  phone_number1: string;
  phone_number2: string;
  birthday: string;
  image: string;
  created_at: string;
  start_at: string;
  end_at: string | null;
  status: boolean;
  last_action_time: string | null;
}

interface Message {
  id: number;
  content: string;
}

interface Branch {
  id: number;
  name: string;
}

interface Group {
  id: number;
  name: string;
}

const DebtorStudents: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessageVisible, setNewMessageVisible] = useState(false);
  const [newMessageContent, setNewMessageContent] = useState("");
  const [editMessageId, setEditMessageId] = useState<number | null>(null);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedBranch, setSelectedBranch] = useState<number | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<number | null>(null);

  const fetchDebtorStudents = useCallback(async () => {
    setLoading(true);
    try {
      const response = await request.get("/account/debtor-student-profiles/", {
        params: {
          branch: selectedBranch,
          group: selectedGroup,
        },
      });
      const data: Student[] = response.data.results;
      setStudents(data);
    } catch (error) {
      console.error("Error fetching debtor students:", error);
    } finally {
      setLoading(false);
    }
  }, [selectedBranch, selectedGroup]);

  const fetchMessages = useCallback(async () => {
    try {
      const response = await request.get("/account/payments-messages/");
      setMessages(response.data.results);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  }, []);

  const fetchBranches = useCallback(async () => {
    try {
      const response = await request.get("/branch/branches/");
      setBranches(response.data.results);
    } catch (error) {
      console.error("Error fetching branches:", error);
    }
  }, []);

   const fetchGroups = useCallback(async (branchId: number | null = null) => {
     try {
       const response = await request.get(`/group/groups/?branch=${branchId}`);
       setGroups(response.data.results);
     } catch (error) {
       console.error("Error fetching groups:", error);
     }
   }, []);

  useEffect(() => {
    fetchDebtorStudents();
    fetchMessages();
    fetchBranches();
    fetchGroups();
  }, [fetchDebtorStudents, fetchMessages, fetchBranches, fetchGroups]);

  const handleSelectAll = (e: CheckboxChangeEvent) => {
    if (e.target.checked) {
      setSelectedStudents(students.map((student) => student.id));
    } else {
      setSelectedStudents([]);
    }
    setSelectAll(e.target.checked);
  };

  const handleSelectStudent = (id: number) => {
    setSelectedStudents((prevSelectedStudents) =>
      prevSelectedStudents.includes(id)
        ? prevSelectedStudents.filter((studentId) => studentId !== id)
        : [...prevSelectedStudents, id]
    );
  };

  const handleSendSMS = async () => {
    if (selectedMessage === null) {
      message.error("Istimos sms yuborish uchun textni tanlang");
      return;
    }

    try {
      await request.post("/account/student-send-sms/", {
        students: selectedStudents,
        message: selectedMessage,
      });
      message.success("SMS muvaffaqiyatli jo'natildi");
      setSelectedStudents([]);
      setSelectAll(false);
      setModalVisible(false);
      setSelectedMessage(null);
    } catch (error) {
      message.error(error.message || "Sms jo'natishda muammo bor");
    }
  };

  const handleAddMessage = async () => {
    try {
      const response = await request.post("/account/payments-messages/", {
        message: newMessageContent,
      });
      setMessages((prevMessages) => [...prevMessages, response.data]);
      setNewMessageContent("");
      message.success("Sms textni muvaffaqiyatli yaratildi.");
    } catch (error) {
      message.error("Sms jo'natishda muammo bor.");
    }
  };

  const handleEditMessage = async (id: number) => {
    try {
      const response = await request.get(`/account/payments-messages/${id}/`);
      setNewMessageContent(response.data.message);
      setEditMessageId(id);
      setNewMessageVisible(true);
    } catch (error) {
      message.error("Message ni tahrirlashda muammo bor. ");
    }
  };

  const handleUpdateMessage = async () => {
    if (editMessageId === null) return;

    try {
      await request.put(`/account/payments-messages/${editMessageId}/`, {
        message: newMessageContent,
      });
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.id === editMessageId
            ? { ...msg, message: newMessageContent }
            : msg
        )
      );
      setNewMessageContent("");
      setEditMessageId(null);
      message.success("Text muvaffaqiyatli yangilandi");
    } catch (error) {
      message.error("Textni yangilashda xatolik bor");
    }
  };

  const handleDeleteMessage = async (id: number) => {
    try {
      await request.delete(`/account/payments-messages/${id}/`);
      setMessages((prevMessages) =>
        prevMessages.filter((msg) => msg.id !== id)
      );
      message.success("Messsage o'chirildi.");
    } catch (error) {
      message.error("Messageni o'chirishda muammo bor.");
    }
  };

   const handleBranchChange = (value: number) => {
     setSelectedBranch(value);
     console.log(value)
     fetchGroups(value);
   };

  const handleGroupChange = (value: number) => {
    setSelectedGroup(value);
  };

  const columns = [
    {
      title: "Select",
      dataIndex: "select",
      key: "select",
      render: (_: any, record: Student) => (
        <Checkbox
          checked={selectedStudents.includes(record.id)}
          onChange={() => handleSelectStudent(record.id)}
        />
      ),
    },
    {
      title: "N",
      dataIndex: "index",
      key: "index",
      render: (text, record, index) => index + 1,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (_: any, record: Student) =>
        `${record.first_name} ${record.last_name}`,
    },
    {
      title: "Branch",
      dataIndex: "branch",
      key: "branch",
      render: (_: any, record: Student) => record.branch.name,
    },
    {
      title: "Phone Number",
      dataIndex: "phone_number1",
      key: "phone_number1",
    },
    {
      title: "Oxirgi sms jo'natilgan sana",
      dataIndex: "last_action_time",
      key: "last_action_time",
      render: (text: string) => (text ? moment(text).format("L , LT") : "N/A"),
    },
    {
      title: "Guruh nomi",
      dataIndex: "group",
      key: "group",
      render: (_: any, record: Student) =>
        record.group.length > 0
          ? record.group.map((g) => g.name).join(", ")
          : "guruh biriktirilmagan",
    },
  ];

  return (
    <div className="p-4">
      <Spin spinning={loading}>
        <div className="flex items-center mb-4">
          <Checkbox
            checked={selectAll}
            onChange={handleSelectAll}
            className="mr-1"
          />
          <span>Hammasi</span>
          <Button
            type="primary"
            onClick={() => setModalVisible(true)}
            disabled={selectedStudents.length === 0}
            className="ml-12"
          >
            SMS yuborish
          </Button>
          <Button
            type="primary"
            onClick={() => setNewMessageVisible(true)}
            className="ml-4"
          >
            Text qo'shish
          </Button>
          <Select
            placeholder="Filialni tanlang"
            onChange={handleBranchChange}
            allowClear
            className="ml-4"
          >
            {branches.map((branch) => (
              <Option key={branch.id} value={branch.id}>
                {branch.name}
              </Option>
            ))}
          </Select>
          <Select
            placeholder="Guruhni tanlang"
            onChange={handleGroupChange}
            allowClear
            className="ml-4"
          >
            {groups.map((group) => (
              <Option key={group.id} value={group.id}>
                {group.name}
              </Option>
            ))}
          </Select>
        </div>
        <Table
          dataSource={students}
          columns={columns}
          rowKey="id"
          pagination={false}
        />
      </Spin>
      <Modal
        title="Sms ni yuborish"
        open={modalVisible}
        onOk={handleSendSMS}
        onCancel={() => setModalVisible(false)}
        okText="Sms ni yuborish"
        cancelText="Bekor qilish"
      >
        <Select
          allowClear
          placeholder="Sms textni tanlang"
          onChange={(value) => setSelectedMessage(value)}
          className="w-full mb-4"
        >
          {messages.map((message) => (
            <Option key={message.id} value={message.id}>
              {message.message}
            </Option>
          ))}
        </Select>
      </Modal>
      <Modal
        title={editMessageId ? "Textni tahrirlash" : "Yangi Textni yaratish"}
        open={newMessageVisible}
        onOk={editMessageId ? handleUpdateMessage : handleAddMessage}
        onCancel={() => {
          setNewMessageVisible(false);
          setEditMessageId(null);
          setNewMessageContent("");
        }}
        okText={editMessageId ? "Yangilash" : "Yaratish"}
        cancelText="Bekor qilish"
      >
        <TextArea
          rows={2}
          value={newMessageContent}
          onChange={(e) => setNewMessageContent(e.target.value)}
        />
        <div className="mt-3">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className="flex items-center justify-between mb-2 bg-blue-100 p-1 rounded px-2"
            >
              <span>{msg.message}</span>
              <div className="flex items-center">
                <EditOutlined
                  onClick={() => handleEditMessage(msg.id)}
                  className="text-blue-500 cursor-pointer mr-2"
                />
                <DeleteOutlined
                  onClick={() => handleDeleteMessage(msg.id)}
                  className="text-red-500 cursor-pointer"
                />
              </div>
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
};

export default DebtorStudents;
