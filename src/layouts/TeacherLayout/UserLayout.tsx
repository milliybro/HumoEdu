import React from "react";
import { Outlet } from "react-router-dom";
import {
  FaHome,
  FaUser,
  FaCog,

} from "react-icons/fa";
import { Content } from "antd/es/layout/layout";
import { Link } from "react-router-dom";
import { MdOutlinePayments } from "react-icons/md";
import TeacherHeader from "../../components/header/TeacherHeader";
import logoTeacher from '../../assets/logo-teacher-admin.png'
import avatarUrl from '../../assets/avatar-svgrepo-com.svg'
import { useAuth } from "../../states/auth";
const TeacherLayout: React.FC = () => {
    const { role } = useAuth();

  return (
    <div className="flex">
      <div className="fixed inset-y-0 left-0 bg-gray-800 p-4 transition-transform transform w-48">
        <div className="flex items-center justify-between">
          <h1 className="text-white text-2xl font-bold">Admin Panel</h1>
        </div>
        <nav className="mt-0">
          <img
            src={logoTeacher}
            className="text-2xl text-white fond-medium  px-2 py-1 flex items-center justify-center mb-12"
          />
          <Link
            to={role === "teacher" ? "/teacher-home" : ""}
            className="flex items-center p-2 text-gray-400 hover:bg-gray-700 hover:text-white rounded-md"
          >
            <FaHome className="w-6 h-6" />
            <span className="ml-2">Home</span>
          </Link>
          <Link
            to={role === "teacher" ? "/my-groups" : ""}
            className="flex items-center p-2 text-gray-400 hover:bg-gray-700 hover:text-white rounded-md"
          >
            <FaUser className="w-6 h-6" />
            <span className="ml-2">Guruhlar</span>
          </Link>
          <Link
            to={role === "teacher" ? "/teacher-schedule" : ""}
            className="flex items-center p-2 text-gray-400 hover:bg-gray-700 hover:text-white rounded-md"
          >
            <FaCog className="w-6 h-6" />
            <span className="ml-2">Dars Jadvali</span>
          </Link>
          <Link
            to={role === "teacher" ? "/teacher-payments" : ""}
            className="flex items-center p-2 text-gray-400 hover:bg-gray-700 hover:text-white rounded-md"
          >
            <MdOutlinePayments className="w-6 h-6" />
            <span className="ml-2">To'lovlar</span>
          </Link>
        </nav>
      </div>
      <div className="flex-1 flex flex-col min-h-screen">
        <div className="bg-white shadow-md p-4">
          <TeacherHeader avatarUrl={avatarUrl} teacherName={"John Doe"} />
        </div>
        <main className="flex-1 p-4 ml-48">
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