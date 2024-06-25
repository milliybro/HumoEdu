import React, { useEffect, useState } from "react";
import { Button, Table, Modal, Spin, message, List } from "antd";
import { useNavigate } from "react-router-dom";
import { request } from "../../../request";

interface Teacher {
  id: number;
  last_name: string;
  first_name: string;
}

interface Group {
  id: number;
  name: string;
  teacher: Teacher;
  sub_teacher: string | null;
  science: string;
}

interface Schedule {
  id: number;
  start_time: string;
  end_time: string;
  room: number;
  room_name: string;
  days: string[];
  group: Group;
}

interface Student {
  id: number;
  last_name: string;
  first_name: string;
  user: number;
  branch: number;
  phone_number1: string;
  phone_number2: string;
  image: string;
  birthday: string;
  start_at: string | null;
  end_at: string | null;
  status: boolean;
  is_debtor: string;
}

const TeacherAttendance: React.FC = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<number[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      const response = await request.get(`group/lessonschedules/`
      );
      const daysOfWeek = [
        "Yakshanba",
        "Dushanba",
        "Seshanba",
        "Chorshanba",
        "Payshanba",
        "Juma",
        "Shanba",
      ];
      const todayIndex = new Date().getDay(); // Hafta kuni indeksi (0 dan 6 gacha)
      const today = daysOfWeek[todayIndex];
      const todayGroups = response.data.filter((schedule: Schedule) => schedule.days.includes(today))
        .map((schedule: Schedule) => schedule.group);
      setGroups(todayGroups);
    } catch (error) {
      message.error("Failed to fetch groups.");
    } finally {
      setLoading(false);
    }
  };
  console.log(groups)
  const handleAttendanceClick = (groupId: number) => {
    navigate(`/attendance/${groupId}`);
  };

  const handleAddAttendanceClick = async (groupId: number) => {
    try {
      const response = await request.get(
        `group/group-students/?group=${groupId}`
      );
      setStudents(response.data.results);
      setIsModalVisible(true);
    } catch (error) {
      message.error("Failed to fetch students.");
    }
  };

  const handleOk = async () => {
    try {
      const absentStudents = selectedStudents.map((id) => ({
        student: id,
        with_reason: true,
      }));

      
      await request.post(`group/attendance-create/`, {
        attendance_check: {
          lesson: 6,
        },
        absent_students: absentStudents,
      });

      message.success("yo'qlama amalga oshirildi");
      setIsModalVisible(false);
    } catch (error) {
      message.error("Yo'qlamani amalga oshirishda muammo bor");
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleStudentSelection = (studentId: number) => {
    setSelectedStudents((prevSelected) =>
      prevSelected.includes(studentId)
        ? prevSelected.filter((id) => id !== studentId)
        : [...prevSelected, studentId]
    );
  };

  const columns = [
    {
      title: "Group Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: Group) => (
        <>
          <Button
            className="mr-5"
            type="primary"
            onClick={() => handleAttendanceClick(record.id)}
          >
            View Attendance
          </Button>
          <Button onClick={() => handleAddAttendanceClick(record.id)}>
            Add Attendance
          </Button>
        </>
      ),
    },
  ];

  return (
    <div className="p-4">
      {loading ? (
        <Spin size="large" className="text-center flex justify-center" />
      ) : (
        <Table
          dataSource={groups}
          columns={columns}
          rowKey="id"
          pagination={false}
        />
      )}
      <Modal
        title="Select Absent Students"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <List
          dataSource={students}
          renderItem={(student: Student) => (
            <List.Item
              onClick={() => handleStudentSelection(student.id)}
              className={`cursor-pointer ${
                selectedStudents.includes(student.id) ? "bg-red-100" : ""
              }`}
            >
              {student.first_name} {student.last_name}
            </List.Item>
          )}
        />
      </Modal>
    </div>
  );
};

export default TeacherAttendance;
