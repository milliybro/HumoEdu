import { Outlet } from "react-router-dom";
import Sidebar from "../../components/side-bar/Sidebar";
import UserHeader from "../../components/header/UserHeader";

import "./userLayout.scss";
import { useAuth } from "../../states/auth";
import { toast } from "react-toastify";
import { request } from "../../request";
import { useCallback, useEffect, useState } from "react";
import TeacherHeader from "../../components/header/TeacherHeader";
import TeacherSidebar from "../../components/side-bar/Sidebar-teacher";
const TeacherLayout = () => {
  const { userId } = useAuth();
  const [isClient, setClient] = useState(null);
  const [showCheckClient, setShowCheckClient] = useState(false);
  // const getUserClient = useCallback(async () => {
  //   try {
  //     const { data } = await request(`users/${userId}`);
  //     setClient(data.role);
  //     console.log(data.role);

  //     console.log(data);
  //   } catch (err) {
  //     toast.error("Could not get user client");
  //   }
  // }, [userId]);

  // useEffect(() => {
  //   getUserClient();
  // }, [getUserClient]);


  
  useEffect(() => { 
    const timeoutId = setTimeout(() => {
      setShowCheckClient(true);
    }, 1000);
    return () => {
      clearTimeout(timeoutId);
    };
  }, [isClient]);

  return (
    <div className="user__layout">
      <div style={{ display: "flex" }}>
        <TeacherSidebar />
        <TeacherHeader />
      </div>
      <main className="user__layout__contents">
        <div className="content__container">
          <Outlet />
        </div>
      </main>
      
    </div>
  );
};

export default TeacherLayout;
