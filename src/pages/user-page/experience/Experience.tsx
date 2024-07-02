import React, { useEffect, useState } from "react";
import { Table, Tag } from "antd";
import { request } from "../../../request";
import { useParams } from "react-router-dom";
import "../../../components/accordion/accordion.scss";
import "./experience.scss";

interface Attendance {
  id: number;
  attendance_check: {
    id: number;
    lesson: number;
    created_at: string;
    updated_at: string;
  };
  student: number;
  with_reason: boolean;
}

const Experience: React.FC = () => {
  const [attendanceData, setAttendanceData] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const {groupId} = useParams();
  useEffect(() => {
    setLoading(true);
    request
      .get(`group/attendance-student/?group=${groupId}`)
      .then((response) => {
        setAttendanceData(response.data.results);
        setLoading(false);
      })
      .catch((error) => {
        console.error("There was an error fetching the data!", error);
        setLoading(false);
      });
  }, [groupId]);

  const columns = [
    {
      title: "N",
      dataIndex: "index",
      key: "index",
      render: (text: any, record: any, index: number) => index + 1,
    },
    {
      title: "yo'qlama vaqti",
      dataIndex: ["attendance_check", "created_at"],
      key: "created_at",
      render: (created_at: string) => new Date(created_at).toLocaleString(),
    },
    {
      title: "Sabab",
      dataIndex: "with_reason",
      key: "with_reason",
      render: (with_reason: boolean) => (
        <Tag
          className="font-medium text-sm"
          color={with_reason === true ? "green" : "red"}
        >
          {with_reason === true ? "Sababli" : "Sababsiz"}
        </Tag>
      ),
    },
  ];

  return (
    <div className="overflow-x-auto">
      <h1 className="text-2xl font-bold mb-4">Dars qoldirilgan kunlar</h1>
      <Table
        dataSource={attendanceData}
        columns={columns}
        rowKey="id"
        loading={loading}
        pagination={false}
        bordered
        className="min-w-full"
      />
    </div>
  );
};

export default Experience;
