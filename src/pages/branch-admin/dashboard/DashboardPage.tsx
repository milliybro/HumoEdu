import React, { useCallback, useEffect, useState } from "react";
import { Select, Spin } from "antd";
import { ArrowDownOutlined, ArrowUpOutlined } from "@ant-design/icons";
import ReactApexChart from "react-apexcharts";
import CountUp from "react-countup";
import moment from "moment";
import { request } from "../../../request";
import "./style.scss";

const BranchDashboardPage = () => {
  const [regis, setRegis] = useState([]);
  const [staff, setStaff] = useState([]);
  const [science, setScience] = useState([]);
  const [student, setStudent] = useState([]);
  const [studentCount, setStudentCount] = useState([]);
  const [payments, setPayments] = useState({ monthly: 0, yearly: 0, weekly: 0 });
  const [chartData, setChartData] = useState({
    series: [{ name: "Registrations", data: [] }],
    options: {
      chart: { height: 350, type: "bar" },
      plotOptions: { bar: { borderRadius: 0, dataLabels: { position: "top" } } },
      dataLabels: {
        enabled: true,
        formatter: (val) => val + "",
        offsetY: -20,
        style: { fontSize: "12px", colors: ["#304758"] },
      },
      xaxis: { categories: [], position: "top", axisBorder: { show: false }, axisTicks: { show: false }, tooltip: { enabled: true } },
      yaxis: { axisBorder: { show: false }, axisTicks: { show: false }, labels: { show: false, formatter: (val) => val + "%" } },
      title: { text: "Monthly Registrations", floating: true, offsetY: 330, align: "center", style: { color: "#444" } },
    },
  });
  const [donutChartData, setDonutChartData] = useState({
    series: [],
    chart: {
      width: "100%",
      type: "pie",
    },
    theme: {
      monochrome: {
        enabled: true,
      },
    },
    plotOptions: {
      pie: {
        dataLabels: {
          offset: -5,
        },
      },
    },
    title: {
      text: "Filliallar bo'yicha o'qituvchilar",
    },
    labels: [],
    dataLabels: {
      enabled: true,
      formatter: (val) => val + "%",
      offsetY: -20,
      style: { fontSize: "12px", colors: ["#fff"] },
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200,
          },
          legend: {
            position: "bottom",
          },
        },
      },
    ],
  });
  const [donutChartStudent, setDonutChartStudent] = useState({
    series: [],
    chart: {
      width: "100%",
      type: "pie",
    },
    theme: {
      monochrome: {
        enabled: true,
      },
    },
    plotOptions: {
      pie: {
        dataLabels: {
          offset: -5,
        },
      },
    },
    title: {
      text: "Filliallar bo'yicha o'quvchilar",
    },
    labels: [],
    dataLabels: {
      enabled: true,
      formatter: (val) => val + "%",
      offsetY: -20,
      style: { fontSize: "12px", colors: ["#fff"] },
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200,
          },
          legend: {
            position: "bottom",
          },
        },
      },
    ],
  });

  // Fetch data from server
  const fetchData = useCallback(async () => {
    try {
      const fromMonthly = moment().subtract(1, "months").format("YYYY-MM-DD");
      const fromYearly = moment().subtract(1, "years").format("YYYY-MM-DD");
      const fromWeekly = moment().subtract(1, "weeks").format("YYYY-MM-DD");
      const toDate = moment().format("YYYY-MM-DD");

      const [regRes, staffRes, studentRes, payMonthlyRes, payYearlyRes, payWeeklyRes, scienceRes, studentCountRes] = await Promise.all([
        request.get("dashboard/registration/"),
        request.get("dashboard/staff/"),
        request.get("dashboard/student/"),
        request.get("dashboard/payment/", { params: { from_date: fromMonthly } }),
        request.get("dashboard/payment/", { params: { from_date: fromYearly } }),
        request.get("dashboard/payment/", { params: { from_date: fromWeekly } }),
        request.get("dashboard/science/"),
        request.get("dashboard/science-students/"),
      ]);

      setRegis(regRes.data || []);
      setStaff(staffRes.data || []);
      setStudent(studentRes.data || []);
      setScience(scienceRes.data || []);
      setPayments({
        monthly: payMonthlyRes.data.sum || 0,
        yearly: payYearlyRes.data.sum || 0,
        weekly: payWeeklyRes.data.sum || 0,
      });
      setStudentCount(studentCountRes.data || []);
    } catch (err) {
      console.error("Failed to fetch data:", err);
    }
  }, []);

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Update chart data when registration data changes
  useEffect(() => {
    setChartData((prevData) => ({
      ...prevData,
      series: [{ ...prevData.series[0], data: regis?.monthly?.map((value) => value.count || 0) }],
      options: {
        ...prevData.options,
        xaxis: { categories: regis?.monthly?.map((value) => value?.date || "") },
      },
    }));
  }, [regis]);

  // Update donut chart data when staff data changes
  useEffect(() => {
    setDonutChartData((prevData) => ({
      ...prevData,
      // series: [{ ...prevData.series, data: staff.map((value) => value.staffs_count || 0) }],
      labels: staff.map((value) => value?.name || "N/A"),
      series: staff.map((value) => value?.staffs_count || 0),
    }));
  }, [staff]);

  useEffect(() => {
    setDonutChartStudent((prevData) => ({
      ...prevData,
      // series: [{ ...prevData.series, data: staff.map((value) => value.staffs_count || 0) }],
      labels: student.map((value) => value?.name || "N/A"),
      series: student.map((value) => value?.student_count || 0),
    }));
  }, [student]);

  console.log(science, "donut");
  const totalStaffCount = staff.reduce((acc, current) => acc + current.staffs_count, 0);
  const totalStudentCount = student.reduce((acc, current) => acc + current.student_count, 0);
  const totalScienceCount = science?.length || 0;
  console.log(totalScienceCount);

  // Handle select change
  const handleChange = (value) => {
    console.log(`selected ${value}`);
  };

  useEffect(() => {
    const Studentoptions = {
      series: [
        {
          name: "Jami o'quvchilar",
          data: studentCount.map((student) => student.students_count || 0),
        },
        {
          name: "Maksimal o'quvchilar",
          data: studentCount.map((student) => student?.total_room_capacity - student?.students_count || 0),
        },
      ],
      chart: {
        type: "bar",
        height: 350,
        width: `950px`,
        stacked: true,
      },
      stroke: {
        width: 1,
        colors: ["#fff"],
      },
      dataLabels: {
        formatter: (val) => {
          return val;
        },
      },
      plotOptions: {
        bar: {
          horizontal: true,
        },
      },
      xaxis: {
        categories: studentCount.map((student) => student?.name),
        labels: {
          formatter: (val) => {
            return val;
          },
        },
      },
      fill: {
        opacity: 1,
      },
      colors: ["#008FFB", "#80c7fd"],
      legend: {
        position: "top",
        horizontalAlign: "left",
      },
    };

    console.log(studentCount, "cou");

    const chart = new ApexCharts(document.querySelector("#stchart"), Studentoptions);
    chart.render();

    // Cleanup function to destroy the chart instance
    return () => {
      chart.destroy();
    };
  }, []);
  return (
    <Spin spinning={false}>
      <section>
        <div className="dashboard-container">
          <div className="dashboard-high-header">
            <div className="dashboard-header-main">
              <h3>Dashboard</h3>
              <p>Welcome to the education management dashboard.</p>
            </div>
            <div className="main-stats">
              <Select
                defaultValue="monthly"
                style={{ width: 150 }}
                onChange={handleChange}
                options={[
                  { value: "monthly", label: "Last 30 days" },
                  { value: "half-year", label: "Last 6 months" },
                  { value: "year", label: "Last year" },
                ]}
              />
            </div>
          </div>
          <div className="dashboard-row first-dashboard">
            <div className="col-md-6">
              <div className="card">
                <div className="nk-ecwg nk-ecwg3">
                  <div className="card-inner pb-0">
                    <div className="card-title-group">
                      <div className="card-title">
                        <h6 className="title">O'qituvchilar soni</h6>
                      </div>
                    </div>
                    <div className="data">
                      <div className="data-group">
                        <div className="amount fw-normal">
                          <CountUp end={totalStaffCount} />
                        </div>
                        {/* <div className="info text-end">
                          <span className="change up text-danger">
                            <ArrowUpOutlined /> 5.93%
                          </span>
                          <br />
                          <span>compared to last year</span>
                        </div> */}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card">
                <div className="nk-ecwg nk-ecwg3">
                  <div className="card-inner pb-0">
                    <div className="card-title-group">
                      <div className="card-title">
                        <h6 className="title">O'quvchilar soni</h6>
                      </div>
                    </div>
                    <div className="data">
                      <div className="data-group">
                        <div className="amount fw-normal">
                          <CountUp end={totalStudentCount} />
                        </div>
                        {/* <div className="info text-end">
                          <span className="change up text-danger">
                            <ArrowUpOutlined /> 4.63%
                          </span>
                          <br />
                          <span>compared to last month</span>
                        </div> */}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card">
                <div className="nk-ecwg nk-ecwg3">
                  <div className="card-inner pb-0">
                    <div className="card-title-group">
                      <div className="card-title">
                        <h6 className="title">Fanlar soni</h6>
                      </div>
                    </div>
                    <div className="data">
                      <div className="data-group">
                        <div className="amount fw-normal">
                          <CountUp end={totalScienceCount} />
                        </div>
                        {/* <div className="info text-end">
                          <span className="change up text-danger">
                            <ArrowUpOutlined /> 7.13%
                          </span>
                          <br />
                          <span>compared to last week</span>
                        </div> */}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="all-charts">
            <div className="dashboard-charts">
              <div className="card-title">
                <h3>Student Registrations</h3>
                <p>Admissions in the last 30 days</p>
              </div>
              <div className="align-end gy-3 gx-5 flex-wrap flex-md-nowrap flex-lg-wrap flex-xxl-nowrap">
                <div className="nk-sale-data-group flex-md-nowrap g-4">
                  <div className="nk-sale-data">
                    <span className="sub-title">This Month</span>
                    <span className="amount">
                      <h3>
                        <CountUp end={regis?.monthly?.at(-1)?.count || 0} />
                      </h3>
                      <span className={`change ${(regis?.monthly?.at(-1)?.count || 0) > (regis?.monthly?.at(-2)?.count || 0) ? "up text-success" : "down text-danger"}`}>
                        {(regis?.monthly?.at(-1)?.count || 0) > (regis?.monthly?.at(-2)?.count || 0) ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                        {regis?.monthly?.at(-2)?.count ? (((regis?.monthly?.at(-1)?.count || 0) * 100) / regis?.monthly?.at(-2)?.count).toFixed(2) : 0}%
                      </span>
                    </span>
                  </div>
                  <div className="nk-sale-data">
                    <span className="sub-title">This Week</span>
                    <span className="amount">
                      <h3>
                        <CountUp end={245} />
                      </h3>
                      <span className="change up text-success">
                        <ArrowDownOutlined />
                        4.26%
                      </span>
                    </span>
                  </div>
                </div>
                <div className="nk-sales-ck sales-revenue">
                  <div id="chart">
                    <ReactApexChart options={chartData.options} series={chartData.series} type="bar" height={150} />
                  </div>
                </div>
              </div>
            </div>
            <div style={{ display: "flex", gap: "15px" }}>
              <div>
                <div id="chart">
                  <ReactApexChart options={donutChartData} series={donutChartData.series} type="donut" className="donut-chart" height={258} width={400} />
                </div>
                <div id="html-dist"></div>
              </div>
              <div>
                <div id="chart">
                  <ReactApexChart options={donutChartStudent} series={donutChartStudent.series} type="donut" className="donut-chart" height={258} width={400} />
                </div>
                <div id="html-dist"></div>
              </div>
            </div>
          </div>
          <div className="dashboard-row">
            <div className="col-md-6">
              <div className="card">
                <div className="nk-ecwg nk-ecwg3">
                  <div className="card-inner pb-0">
                    <div className="card-title-group">
                      <div className="card-title">
                        <h6 className="title">Yearly Sales</h6>
                      </div>
                    </div>
                    <div className="data">
                      <div className="data-group">
                        <div className="amount fw-normal">
                          <CountUp end={payments.yearly} /> so'm
                        </div>
                        <div className="info text-end">
                          <span className="change up text-danger">
                            <ArrowUpOutlined /> 5.93%
                          </span>
                          <br />
                          <span>compared to last year</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card">
                <div className="nk-ecwg nk-ecwg3">
                  <div className="card-inner pb-0">
                    <div className="card-title-group">
                      <div className="card-title">
                        <h6 className="title">Monthly Sales</h6>
                      </div>
                    </div>
                    <div className="data">
                      <div className="data-group">
                        <div className="amount fw-normal">
                          <CountUp end={payments.monthly} /> so'm
                        </div>
                        <div className="info text-end">
                          <span className="change up text-danger">
                            <ArrowUpOutlined /> 4.63%
                          </span>
                          <br />
                          <span>compared to last month</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card">
                <div className="nk-ecwg nk-ecwg3">
                  <div className="card-inner pb-0">
                    <div className="card-title-group">
                      <div className="card-title">
                        <h6 className="title">Weekly Sales</h6>
                      </div>
                    </div>
                    <div className="data">
                      <div className="data-group">
                        <div className="amount fw-normal">
                          <CountUp end={payments.weekly} /> so'm
                        </div>
                        <div className="info text-end">
                          <span className="change up text-danger">
                            <ArrowUpOutlined /> 7.13%
                          </span>
                          <br />
                          <span>compared to last week</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="science-charts">
          <div className=" col-lg-6">
            <div className="card card-full">
              <div className="card-inner">
                <div className="card-title-group align-start mb-4">
                  <div className="card-title">
                    <h6 className="title mb-1">Top Categories</h6>
                    <p>In last 15 days buy and sells overview.</p>
                  </div>
                  <div className="card-tools">
                    {/* Chart */}
                    <div id="stchart"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Spin>
  );
};

export default BranchDashboardPage;
