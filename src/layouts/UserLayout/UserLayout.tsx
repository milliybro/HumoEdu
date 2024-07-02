import { Outlet } from "react-router-dom";
import Sidebar from '../../components/side-bar/Sidebar';
import UserHeader from "../../components/header/UserHeader";

import "./userLayout.scss";
const UserLayout = () => {
  


  return (
    <div className="flex">
      <div className="fixed inset-y-0 left-0 bg-gray-800 w-64 lg:w-64 lg:translate-x-0 transform -translate-x-full lg:fixed">
         <Sidebar />
      </div>
      <div className="flex-1 flex flex-col h-screen lg:pl-64">
        <header className="w-full lg:w-5/6 mx-auto bg-white h-20 p-2 px-6 fixed top-0 z-10">
           <UserHeader />
        </header>

        <main className="flex-1 p-4 bg-gray-100 mt-20 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default UserLayout;
