import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Table, Tag } from "antd";
import { request } from "../../../request";
import { Student } from "../../admin-page/types";
import { toast } from "react-toastify";

const BranchGroupsStudents = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const [students, setStudents] = useState<Student[]>([]);
  const [groupName, setGroupName] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await request.get(
          `account/student-profiles/?group=${groupId}`
        );
        const { results } = response.data;
        if (results.length > 0) {
          setStudents(results);
          // Assuming group name is the same for all students in the results
          const group = results[0].group.find(
            (g) => g.id === parseInt(groupId)
          );
          if (group) {
            setGroupName(group.name);
          }
        }
      } catch (error) {
        toast.error("Error fetching students:", error);
      }
    };

    fetchData();
  }, [groupId]);

  const columns = [
    {
      title: "N",
      dataIndex: "index",
      key: "index",
      render: (text, record, index) => index + 1,
    },
    {
      title: "Familiya",
      dataIndex: "last_name",
      key: "last_name",
    },
    {
      title: "Ism",
      dataIndex: "first_name",
      key: "first_name",
    },
    {
      title: "Hisobi",
      dataIndex: "balance",
      key: "balance",
    },
    {
      title: "Foydalanuvchi nomi",
      dataIndex: ["user", "username"],
      key: "username",
    },
    {
      title: "Filiali",
      dataIndex: ["branch", "name"],
      key: "branch",
    },
    {
      title: "Telefon raqam 1",
      dataIndex: "phone_number1",
      key: "phone_number1",
    },
    {
      title: "Telefon raqam 2",
      dataIndex: "phone_number2",
      key: "phone_number2",
    },
    {
      title: "Tug'ulgan kun",
      dataIndex: "birthday",
      key: "birthday",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: boolean) => (
        <Tag color={status ? "green" : "red"}>
          {status ? "Active" : "Inactive"}
        </Tag>
      ),
    },
  ];

  return (
    <div>
      <h1 className="text-2xl mb-3 font-medium">
        <span className="text-[#15d1cb]">{groupName}</span> guruhi o'quvchilari
      </h1>
      <Table  dataSource={students} columns={columns} pagination={false} />
    </div>
  );
};

export default BranchGroupsStudents;
