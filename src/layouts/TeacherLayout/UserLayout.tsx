import React from "react";
import { Outlet } from "react-router-dom";
import { Menu } from "antd";
import { HomeOutlined,UsergroupAddOutlined,CreditCardOutlined ,ScheduleOutlined } from "@ant-design/icons";
import { Content } from "antd/es/layout/layout";
import { Link } from "react-router-dom";
import TeacherHeader from "../../components/header/TeacherHeader";
import logoTeacher from '../../assets/logo-teacher-admin.png'
import avatarUrl from '../../assets/avatar-svgrepo-com.svg'
import { useAuth } from "../../states/auth";
import iconAttendance from '../../assets/yoqlama.webp'
const TeacherLayout: React.FC = () => {
    const { role } = useAuth();
    const menuItems = [
      {
        key: "/teacher-home",
        icon: <HomeOutlined />,
        label: (
          <Link to={role === "teacher" ? "/teacher-home" : ""}>
            <span className="ml-2">Home</span>
          </Link>
        ),
      },
      {
        key: "/my-groups",
        icon: <UsergroupAddOutlined />,
        label: (
          <Link to={role === "teacher" ? "/my-groups" : ""}>
            <span className="ml-2">Guruhlar</span>
          </Link>
        ),
      },

      {
        key: "/teacher-schedule",
        icon: <ScheduleOutlined />,
        label: (
          <Link to={role === "teacher" ? "/teacher-schedule" : ""}>
            <span className="ml-2">Dars Jadvali</span>
          </Link>
        ),
      },

      {
        key: "/teacher-payments",
        icon: <CreditCardOutlined />,
        label: (
          <Link to={role === "teacher" ? "/teacher-payments" : ""}>
            <span className="ml-2">To'lovlar</span>
          </Link>
        ),
      },
      {
        key: "/teacher-attendance",
        icon: <CreditCardOutlined />,
        label: (
          <Link to={role === "teacher" ? "/teacher-attendance" : ""}>
            <span className="ml-2">Yo'qlama</span>
          </Link>
        ),
      },
    ];

  return (
    <div className="flex">
      <div className="fixed inset-y-0 left-0 bg-gray-800 p-4 transition-transform transform w-48">
        <div className="flex items-center justify-between">
          <h1 className="text-white text-2xl font-bold">Admin Panel</h1>
        </div>
        <img
          src={logoTeacher}
          className="text-2xl text-white fond-medium  px-2 py-1 flex items-center justify-center mb-12"
        />
        <Menu
          className="bg-gray-800"
          theme="dark"
          mode="inline"
          items={menuItems}
        />
      </div>
      <div className="flex-1 flex flex-col min-h-screen">
        <div className="bg-white shadow-md p-4">
          <TeacherHeader avatarUrl={avatarUrl} teacherName={"John Doe"} />
        </div>
        <main className="flex-1 p-4 ml-48 bg-[#F4F7FE] mt-6">
          <Content
            className="dashboard-main"
            style={{
              padding: 12,
              minHeight: 280,
            }}
          >
            <Outlet />
          </Content>
        </main>
      </div>
    </div>
  );
};

export default TeacherLayout ;


         
          
          