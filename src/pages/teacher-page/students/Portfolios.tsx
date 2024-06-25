import { useCallback, useState, useEffect } from "react";
import { Table, Select } from "antd";
import { request } from "../../../request";
import { useAuth } from "../../../states/auth";
import { toast } from "react-toastify";
import "./portfolios.scss";
import { Portfolio, Group } from "../types";

const { Option } = Select;

const TeacherPortfolios: React.FC = () => {
  const { branchId } = useAuth();
  const [portfolioData, setPortfolioData] = useState<Portfolio[]>([]);
  const [loading, setLoading] = useState(false);
  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<string | undefined>(
    undefined
  );
  const { userId } = useAuth();
  console.log(portfolioData);

  const getPortfolios = useCallback(async () => {
    try {
      setLoading(true);
      const res = await request.get(
        `account/payments/${selectedGroup ? `?group=${selectedGroup}` : ""}`
      );
      setPortfolioData(res.data.results);
    } catch (err) {
      toast.error("Failed to get portfolio data");
    } finally {
      setLoading(false);
    }
  }, [selectedGroup, userId]);

  const getGroups = useCallback(async () => {
    try {
      const res = await request.get(`group/groups/?branch=${branchId}`);
      setGroups(res.data.results);
    } catch (err) {
      toast.error("Failed to get groups data");
    }
  }, [branchId]);

  useEffect(() => {
    getGroups();
    getPortfolios();
  }, [getGroups, getPortfolios]);

  const handleGroupChange = (value: string) => {
    setSelectedGroup(value);
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "To'langan summa",
      dataIndex: "price_sum",
      key: "price_sum",
    },
    {
      title: "Ism Familiya",
      dataIndex: ["teacher", "name"],
      key: "teacher_name",
      render: (_: any, record: Portfolio) =>
        `${record.teacher.first_name} ${record.teacher.last_name}`,
    },
    {
      title: "Guruh nomi",
      dataIndex: ["group", "name"],
      key: "group_name",
    },
    {
      title: "Guruh oylik to'lovi",
      dataIndex: ["group", "price"],
      key: "group_price",
    },
    {
      title: "Fan nomi",
      dataIndex: ["group", "science"],
      key: "science",
    },
    {
      title: "boshlab",
      dataIndex: "from_date",
      key: "from_date",
      render: (text: string) => text,
    },
    {
      title: "gacha",
      dataIndex: "to_date",
      key: "to_date",
      render: (text: string) => text,
    },
  ];

  return (
    <section className="mt-6">
      <div className=" mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">To'lovlar</h1>
        <div className="mb-4">
          <Select
            placeholder="Guruhni tanlang"
            onChange={handleGroupChange}
            style={{ width: 200 }}
          >
            {groups.map((group) => (
              <Option key={group.id} value={group.id}>
                {group.name}
              </Option>
            ))}
          </Select>
        </div>
        <Table
          columns={columns}
          dataSource={portfolioData}
          loading={loading}
          rowKey="id"
          className="shadow-md rounded-md"
        />
      </div>
    </section>
  );
};

export default TeacherPortfolios;
