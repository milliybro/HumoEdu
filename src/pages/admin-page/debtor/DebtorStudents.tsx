import React, { useEffect, useState, useCallback } from "react";
import { List, Button, Checkbox, message, Modal, Spin } from "antd";
import { CheckboxChangeEvent } from "antd/es/checkbox";
import { request } from "../../../request";
import moment from "moment";

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

const DebtorStudents: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [loading, setLoading] = useState(false); // Loading state

  // Fetching students from API
  const fetchDebtorStudents = useCallback(async () => {
    setLoading(true); // Set loading to true before fetching data
    try {
      const response = await request.get("/account/debtor-student-profiles/");
      const data: Student[] = response.data.results;
      setStudents(data);
    } catch (error) {
      console.error("Error fetching debtor students:", error);
    } finally {
      setLoading(false); // Set loading to false after fetching data
    }
  }, []);

  const showModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  useEffect(() => {
    fetchDebtorStudents();
  }, [fetchDebtorStudents]);

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
    try {
      await request.post("/account/student-send-sms/", {
        students: selectedStudents,
        message: messageText,
      });
      message.success("Sms muvaffaqiyatli jo'natildi ");
      setSelectedStudents([]);
      setSelectAll(false);
      setModalVisible(false);
      setMessageText("");
    } catch (error) {
      message.error(error);
    }
  };

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessageText(e.target.value);
  };

  return (
    <div className="p-4 bg-blue-100">
      <Spin spinning={loading}>
        <div className="flex items-center mb-4">
          <Checkbox
            checked={selectAll}
            onChange={handleSelectAll}
            className="mr-1"
          />
          <span>Select All</span>
          <Button
            type="primary"
            onClick={showModal}
            disabled={selectedStudents.length === 0}
            className="ml-12"
          >
            Send SMS
          </Button>
        </div>
        <List
          dataSource={students}
          renderItem={(student) => (
            <List.Item
              key={student.id}
              actions={[
                <Checkbox
                  checked={selectedStudents.includes(student.id)}
                  onChange={() => handleSelectStudent(student.id)}
                />,
              ]}
            >
              <div>
                <p>
                  <strong>Name:</strong> {student.first_name}{" "}
                  {student.last_name}
                </p>
                <p>
                  <strong>Branch:</strong> {student.branch.name}
                </p>
                <p>
                  <strong>Phone Number:</strong> {student.phone_number1}
                </p>
                <p>
                  <strong>Oxirgi sms jo'natilgan sana:</strong>{" "}
                  {moment(student?.last_action_time).format("L , LT")}
                </p>
                <p>
                  <strong>Guruh nomi:</strong>{" "}
                  {student?.group[0]  ? student?.group?.map((g) => g?.name).join(", ") : "guruh biriktirilmagan"}
                </p>
              </div>
            </List.Item>
          )}
        />
        <Modal
          title="Send SMS"
          open={modalVisible}
          onOk={handleSendSMS}
          onCancel={closeModal}
        >
          <p>Jo'natmoqchi bo'lgan habaringizni yozing</p>
          <textarea
            className="w-full h-32 border border-gray-300 p-2"
            value={messageText}
            onChange={handleMessageChange}
          />
        </Modal>
      </Spin>
    </div>
  );
};

export default DebtorStudents;
