// DemoColumn.js
import React from "react";
import { Column } from "@ant-design/charts";

const data = [
  { type: "1-3秒", value: 0.16 },
  { type: "4-10秒", value: 0.125 },
  { type: "11-30秒", value: 0.24 },
  { type: "31-60秒", value: 0.19 },
  { type: "1-3分", value: 0.22 },
  { type: "3-10分", value: 0.05 },
  { type: "10-30分", value: 0.01 },
  { type: "30+分", value: 0.015 },
];

const DemoColumn = () => {
  const config = {
    data,
    xField: "type",
    yField: "value",
    meta: {
      type: { alias: "Type" },
      value: { alias: "Value" },
    },
    label: {
      formatter: (v) => `${(v * 100).toFixed(1)}%`,
    },
    tooltip: { formatter: (v) => ({ value: `${(v * 100).toFixed(1)}%` }) },
    color: ({ type }) => {
      if (type === "10-30分" || type === "30+分") {
        return "#22CBCC";
      }
      return "#2989FF";
    },
    legend: false,
  };
  return <Column {...config} />;
};

export default DemoColumn;
