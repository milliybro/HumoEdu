import React, { useCallback, useState, useEffect } from "react";
import { request } from "../../../request";
import { portfolioTypes } from "../../../types";
import { useAuth } from "../../../states/auth";
import { toast } from "react-toastify";
import { Table, Spin } from "antd";

const Portfolios = () => {
  const [portfolioData, setPortfolioData] = useState<portfolioTypes[]>([]);
  const [loading, setLoading] = useState(false);
  const { teacherId } = useAuth();

  const getPortfolios = useCallback(async () => {
    try {
      setLoading(true);
      const res = await request.get(`account/payments/`);
      setPortfolioData(res.data.results);
    } catch (err) {
      toast.error("Failed to get portfolio data");
    } finally {
      setLoading(false);
    }
  }, [teacherId]);

  useEffect(() => {
    getPortfolios();
  }, [getPortfolios]);

  const columns = [
    {
      title: "N",
      dataIndex: "index",
      key: "index",
      render: (text: any, record: any, index: number) => index + 1,
    },
    {
      title: "To'langan summa",
      dataIndex: "price_sum",
      key: "price_sum",
      render: (price_sum: any) => (
        <span style={{ color: "green", padding: "0.5rem" }}>{price_sum}</span>
      ),
    },
    {
      title: "O'quvchi",
      dataIndex: "student",
      key: "student",
      render: (student: any) => `${student.first_name} ${student.last_name}`,
    },
    {
      title: "Guruh nomi",
      dataIndex: "group",
      key: "group",
      render: (group: any) => group.name,
    },
    {
      title: "To'lov vaqti",
      dataIndex: "paid_time",
      key: "paid_time",
      render: (paid_time: any) => new Date(paid_time).toLocaleString(),
    },
  ];

  return (
    <section className="fixed">
      <Spin size="small" spinning={loading}>
        <Table
          dataSource={portfolioData}
          columns={columns}
          rowKey="id"
          pagination={false}
          style={{width:'1200px'}}
        />
      </Spin>
    </section>
  );
};

export default Portfolios;
