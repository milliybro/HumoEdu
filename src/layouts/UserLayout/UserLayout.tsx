import { Outlet } from "react-router-dom";
import Sidebar from '../../components/side-bar/Sidebar';
import UserHeader from "../../components/header/UserHeader";

import "./userLayout.scss";
const UserLayout = () => {
  


  return (
    <div className="flex">
      <div className="fixed inset-y-0 left-0 bg-gray-800  transition-transform transform w-64">
        <Sidebar />
      </div>
      <div className="flex-1 flex flex-col h-screen">
        <div className="bg-white mb-12">
          <UserHeader />
        </div>
        <main className="flex-1 p-4 ml-64 bg-[#F4F7FE] mt-6  overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default UserLayout;
