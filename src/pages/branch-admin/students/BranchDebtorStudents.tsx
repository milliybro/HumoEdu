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
import { useAuth } from "../../../states/auth";
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

interface Group {
  id: number;
  name: string;
}

const BranchDebtorStudents: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<number | null>(null);
  const { branchId } = useAuth();

  const fetchDebtorStudents = useCallback(async () => {
    setLoading(true);
    try {
      const response = await request.get("/account/debtor-student-profiles/", {
        params: {
          branch: branchId,
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
  }, [selectedGroup]);
      console.log(students);
 
  const fetchMessages = useCallback(async () => {
    try {
      const response = await request.get("/account/payments-messages/");
      setMessages(response.data.results);
    } catch (error) {
      console.error("Error fetching messages:", error);
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
    fetchGroups(branchId);
  }, [fetchDebtorStudents, fetchMessages, fetchGroups]);

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
    {
      title:"kechikkan kun",
      dataIndex: "debtor_days",
      key:"debtor_days",

    }
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
    </div>
  );
};

export default BranchDebtorStudents;
