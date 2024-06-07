import "./Sidebar.scss";
import { useEffect, useState, Fragment } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { request } from "../../request";
import ConfirmationModal from "../confirmation/ConfirmationModal";
import { useAuth } from "../../states/auth";
import { toast } from "react-toastify";
import exampleLogo from "../../assets/humo oquv markazi.png";

import dashboard from "../../assets/dashboard.png";
import payment from "../../assets/payment.png";
import groups from "../../assets/groups.png";
import schedule from "../../assets/schedule.png";
import settings from "../../assets/settings.png";
import logoutIcon from "../../assets/logout.png";
import { Button, Modal } from "antd";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { logout } = useAuth();

  const navigationLinks = [
    { path: "/home", label: "Home", icon: dashboard },
    { path: "/skilss", label: "Dars jadvali", icon: schedule },
    { path: "/my-group", label: "Guruhlarim", icon: groups },
    { path: "/payments", label: "To'lovlar", icon: payment },
  ];

  // const handleLogout = () => {
  //   try {
  //     setIsModalOpen(true);
  //   } catch (err) {
  //     toast.error("Could not log out");
  //   }
  // };
  const handleConfirmLogout = () => {
    try {
      setIsModalOpen(false);
      logout(navigate);
      navigate("/login");
    } catch (err) {
      toast.error("Could not log out");
    } finally {
      setIsModalOpen(false);
    }
  };
  const cancelDelete = () => {
    setIsModalOpen(false);
  };

  return (
    <Fragment>
      <div className="sidebar">
        <div>
          <div className="sidebar__logo">
            <div className="logo_wrapper">
              <NavLink className="active" to={"/home"}>
                <img src={exampleLogo} alt="logo" />
              </NavLink>
            </div>
          </div>
          <ul className="sidebar_links">
            {navigationLinks.map((link) => (
              <li
                key={link.path}
                className={location.pathname === link.path ? "active" : ""}
                onClick={() => navigate(link.path)}
              >
                <Link to={link.path} className="sider-link">
                  <div>
                    <img src={link.icon} alt="" />
                    <span>{link.label}</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <ul className="sidebar_links">
          <li
            className={location.pathname === "/account" ? "active" : ""}
            onClick={() => navigate("/account")}
          >
            <img src={settings} alt="" />
            <Link to={"/account"}>Hisob</Link>
          </li>
          <li
            className="siderbar-layout"
            onClick={() =>
              Modal.confirm({
                onOk: () => logout(navigate),
                title: "Chiqasizmi ?",
              })
            }
          >
            <img src={logoutIcon} alt="" />
            <Button>Chiqish</Button>
          </li>
        </ul>
      </div>
      <ConfirmationModal
        deleteTitle="Confirmation Deletation"
        deleteMessage="Are you sure Log Out?"
        isOpen={isModalOpen}
        onCancel={cancelDelete}
        onConfirm={handleConfirmLogout}
      />
    </Fragment>
  );
};

export default Sidebar;
