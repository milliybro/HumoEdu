import React, { useEffect, useState, useCallback } from "react";
import { Table, Tag } from "antd";
import { useParams } from "react-router-dom";
import { AxiosResponse } from "axios";
import { request } from "../../../request";

interface Student {
  id: number;
  first_name: string;
  last_name: string;
  with_reason: boolean;
  participated: boolean;
}

const GetAttendanceStudents: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const { lessonId } = useParams<{ lessonId: string }>();

  const getStudentAttendance = useCallback(async (lessonId: string) => {
    try {
      const res: AxiosResponse<{ results: Student[] }> = await request.get(
        `group/attendance-students/${lessonId}/`
      );
      console.log(res.data);
      setStudents(res.data.results);
    } catch (error) {
      console.error("Error fetching student attendance:", error);
    }
  }, []);

  useEffect(() => {
    if (lessonId) {
      getStudentAttendance(lessonId);
    }
  }, [lessonId, getStudentAttendance]);

  const columns = [
    {
      title: "N",
      dataIndex: "id",
      key: "id",
      render: (text: any, record: Attendance, index: number) => index + 1,
      className:
        "px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900",
    },
    {
      title: "Ism",
      dataIndex: "first_name",
      key: "first_name",
    },
    {
      title: "Familiya",
      dataIndex: "last_name",
      key: "last_name",
    },
    {
      title: "Darsga qatnashish",
      dataIndex: "participated",
      key: "participated",
      render: (participated: boolean) => (
        <Tag color={participated ? "green" : "red"}>
          {participated ? "Qatnashgan" : "Qatnashmagan"}
        </Tag>
      ),
    },
    {
      title: "Sabab",
      dataIndex: "with_reason",
      key: "with_reason",
      render: (withReason: boolean) => (
        <Tag color={withReason ? "green" : "red"}>
          {withReason ? "Sababli" : "Sababsiz"}
        </Tag>
      ),
    },
  ];

  return (
    <div>
      <h2 className="font-medium text-2xl mb-3">O'quvchilar ro'yxati</h2>
      <Table columns={columns} dataSource={students} pagination={false}/>
    </div>
  );
};

export default GetAttendanceStudents;
