
import React, { useEffect, useState } from "react";
import { Button, Table, Modal, Spin, message, List, Checkbox,Radio, Input } from "antd";
import { useNavigate } from "react-router-dom";
import { request } from "../../../request";
import { Student, Schedule } from "../types";

const TeacherAttendance: React.FC = () => {
  const [groups, setGroups] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<number[]>([]);
  const [lessonId, setLessonId] = useState<number | null>(null);
  const [withReasonMap, setWithReasonMap] = useState<{ [key: number]: boolean }>({});
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      const response = await request.get(`group/lessonschedules/`);
      const daysOfWeek = [
        "Yakshanba",
        "Dushanba",
        "Seshanba",
        "Chorshanba",
        "Payshanba",
        "Juma",
        "Shanba",
      ];
      const todayIndex = new Date().getDay();
      const today = daysOfWeek[todayIndex];
      const todayGroups = response.data
        .filter((schedule: Schedule) => schedule.days.includes(today))
        .map((schedule: Schedule) => schedule);
      setGroups(todayGroups);
    } catch (error) {
      message.error("Guruhlarni yuklab olishda xatolik yuz berdi.");
    } finally {
      setLoading(false);
    }
  };

  const fetchLessonSchedules = async (groupId: number) => {
    try {
      const response = await request.get(
        `group/lessonschedules/?group=${groupId}`
      );
      if (response.data.length > 0) {
        const firstSchedule = response.data[0];
        setLessonId(firstSchedule.id);
      } else {
        message.error("Ushbu guruh uchun dars jadvali topilmadi.");
      }
    } catch (error) {
      message.error("Dars jadvalini yuklashda xatolik yuz berdi.");
    }
  };

  const handleAttendanceClick = (groupId: number) => {
    navigate(`/teacher-attendance/${groupId}`);
  };

  const handleAddAttendanceClick = async (groupId: number) => {
    try {
      const response = await request.get(
        `group/group-students/?group=${groupId}`
      );
      setStudents(response.data.results);
      await fetchLessonSchedules(groupId);
      setIsModalVisible(true);
    } catch (error) {
      message.error("Talabalarni yuklashda xatolik yuz berdi.");
    }
  };

  const handleOk = async () => {
    try {
      if (!lessonId) {
        message.error("Dars ID'si aniqlanmagan.");
        return;
      }

      const absentStudents = students
        .filter((student) => selectedStudents.includes(student.id))
        .map((student) => ({
          student: student.id,
          with_reason: withReasonMap[student.id] || false, // Default to false if withReasonMap[student.id] is undefined
        }));

      await request.post("group/attendance-create/", {
        attendance_check: {
          lesson: lessonId,
        },
        absent_students: absentStudents,
      });

      message.success("yo'qlama qilindi");
      setIsModalVisible(false); 
      setSelectedStudents([]); 
      setWithReasonMap({}); 
      setStudents([]); 
    } catch (error) {
      message.error("Siz bugungi yo'qlamani qilib bo'lgansiz ");
    }
  };
  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedStudents([]); 
    setWithReasonMap({}); 
    setStudents([]); 
  };

  const handleStudentSelection = (studentId: number) => {
    setSelectedStudents((prevSelected) =>
      prevSelected.includes(studentId)
        ? prevSelected.filter((id) => id !== studentId)
        : [...prevSelected, studentId]
    );

    setWithReasonMap((prevMap) => ({
      ...prevMap,
      [studentId]: false,
    }));
  };

  const columns = [
    {
      title: "№",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Guruh Nomi",
      dataIndex: "groupName",
      key: "groupName",
    },
    {
      title: "Fan",
      dataIndex: "science",
      key: "science",
    },
    {
      title: "O'qituvchi",
      dataIndex: "teacher",
      key: "teacher",
    },
    {
      title: "Xona",
      dataIndex: "roomName",
      key: "roomName",
    },
    {
      title: "Boshlanish Vaqti",
      dataIndex: "startTime",
      key: "startTime",
    },
    {
      title: "Tugash Vaqti",
      dataIndex: "endTime",
      key: "endTime",
    },
    {
      title: "Yo'qlamalarni ko'rish va qo'shish",
      key: "actions",
      render: (record) => (
        <>
          <Button
            className="mr-5"
            type="primary"
            onClick={() => handleAttendanceClick(record.groupId)}
          >
            Yo'qlamalarni ko'rish
          </Button>
          <Button onClick={() => handleAddAttendanceClick(record.groupId)}>
            Yo'qlama qilish
          </Button>
        </>
      ),
    },
  ];

  const tableData = groups.map((group, index) => ({
    key: group.id,
    id: index + 1,
    groupId: group.group.id,
    groupName: group.group.name,
    science: group.group.science,
    teacher: group.group.teacher
      ? `${group.group.teacher.last_name} ${group.group.teacher.first_name}`
      : "-",
    roomName: group.room_name,
    startTime: group.start_time,
    endTime: group.end_time,
  }));


   const filteredStudents = students.filter(
    (student) =>
      student.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.last_name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
    <div className="p-4">
      <h2 className="text-medium text-2xl mb-3">
        Bugun dars o'tadigan guruhlaringiz
      </h2>
      {loading ? (
        <Spin size="small" className="text-center flex justify-center" />
      ) : (
        <Table
          dataSource={tableData}
          columns={columns}
          rowKey="id"
          pagination={false}
        />
      )}
      <Modal
        title="Yo'qlamalarni tanlash"
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Input
          placeholder="Ism yoki familiya bo'yicha qidirish"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ marginBottom: 16 }}
        />
        <List
          dataSource={filteredStudents}
          renderItem={(student: Student) => (
            <List.Item
              className="cursor-pointer"
              // onClick={() => handleStudentSelection(student.id)}
            >
              <Checkbox
                checked={selectedStudents.includes(student.id)}
                onChange={() => handleStudentSelection(student.id)}
              >
                {student.first_name} {student.last_name}
              </Checkbox>
              {selectedStudents.includes(student.id) && (
                <Radio
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setWithReasonMap((prevMap) => ({
                      ...prevMap,
                      [student.id]: checked,
                    }));
                  }}
                  checked={withReasonMap[student.id] || false}
                >
                  sababli
                </Radio>
              )}
            </List.Item>
          )}
        />
      </Modal>
    </div>
  );
};

export default TeacherAttendance;