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
      className: "text-center", // Center aligns the content
    },
    {
      title: "To'langan summa",
      dataIndex: "price_sum",
      key: "price_sum",
      render: (price_sum: number) => (
        <span className="text-green-600 px-2 py-1 rounded-lg inline-block">
          {price_sum}
        </span>
      ),
      className: "text-center md:text-left", 
    },
    {
      title: "O'quvchi",
      dataIndex: "student",
      key: "student",
      render: (student: string) => `${student.first_name} ${student.last_name}`,
      className: "text-center md:text-left", 
    },
    {
      title: "Guruh nomi",
      dataIndex: "group",
      key: "group",
      render: (group: string) => group?.name,
      className: "text-center md:text-left", 
    },
    {
      title: "To'lov vaqti",
      dataIndex: "paid_time",
      key: "paid_time",
      render: (paid_time: number) => new Date(paid_time).toLocaleString(),
      className: "text-center md:text-left",
    },
  ];
  return (
    <section className="overflow-x-auto">
      <Spin size="small" spinning={loading}>
        <Table
          dataSource={portfolioData}
          columns={columns}
          rowKey="id"
          pagination={false}
          className="w-full"
        />
      </Spin>
    </section>
  );
};

export default Portfolios;
