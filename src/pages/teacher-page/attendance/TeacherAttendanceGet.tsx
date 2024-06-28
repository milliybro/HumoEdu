import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Table,Button } from "antd";
import { request } from "../../../request";
import moment from "moment";

interface Attendance {
  id: number;
  created_at: string;
}

const TeacherAttendanceGet: React.FC = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const navigate = useNavigate(); // useNavigate hook
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchAttendances = async () => {
      try {
        const response = await request.get(
          `group/attendance-attendances/?lesson__group=${groupId}`
        );
        setAttendances(response.data.results);
      } catch (error) {
        console.error("Error fetching attendances:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendances();
  }, [groupId]);

  const handleRowClick = (record: Attendance) => {
    navigate(`/teacher-attendance/${groupId}/${record.id}`); // Navigate to specific route
  };

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
      title: "Yo'qlama qilingan vaqt",
      dataIndex: "created_at",
      key: "created_at",
      render: (text: string) => moment(text).format("YYYY-MM-DD HH:mm:ss"),
      className: "px-6 py-4 whitespace-nowrap text-sm text-gray-500",
    },
    {
      title: "Student",
      key: "actions",
      render: (record) => (
        <>
          <Button type="primary" onClick={() => handleRowClick(record)}>
            Studentlarni ko'rish
          </Button>
        </>
      ),
    },
  ];

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-5">Guruh yo'qlamalari</h1>
      <Table
        className="w-full border-collapse border border-gray-200"
        columns={columns}
        dataSource={attendances}
        loading={loading}
        rowKey={(record) => record.id.toString()}
      />
    </div>
  );
};

export default TeacherAttendanceGet;
