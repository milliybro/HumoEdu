import { Outlet } from "react-router-dom";
import Sidebar from "../../components/side-bar/Sidebar";
import UserHeader from "../../components/header/UserHeader";

import "./userLayout.scss";
const UserLayout = () => {
  


  return (
    <div className="user__layout bg-[#F4F7FE]">
      <div style={{ display: "flex" }}>
        <Sidebar />
        <UserHeader />
      </div>
      <main className="user__layout__contents overflow-y-auto">
        <div className="content__container">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default UserLayout;
