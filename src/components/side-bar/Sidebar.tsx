import { useState, Fragment } from "react";
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
import { Button, Modal, Menu } from "antd";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { logout } = useAuth();
  const pathName = location.pathname;

  const navigationLinks = [
    { path: "/home", label: "Home", icon: dashboard },
    { path: "/skilss", label: "Dars jadvali", icon: schedule },
    { path: "/my-group", label: "Guruhlarim", icon: groups },
    { path: "/payments", label: "To'lovlar", icon: payment },
  ];

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
      <div className="h-screen w-64 bg-gray-800 text-white flex flex-col justify-between">
        <div>
          <div className="p-2 flex justify-center bg-white">
            <div className="logo_wrapper">
              <NavLink to={"/home"}>
                <img src={exampleLogo} alt="logo" className="h-26 w-26" />
              </NavLink>
            </div>
          </div>
          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={[location.pathname]}
            className="bg-gray-800 mt-4"
          >
            {navigationLinks.map((link) => (
              <Menu.Item
                key={link.path}
                icon={<img src={link.icon} alt="" className="h-6 w-6" />}
                className={`${
                  pathName === link.path ? "bg-gray-700" : "bg-gray-800"
                }`}
              >
                <Link to={link.path}>{link.label}</Link>
              </Menu.Item>
            ))}
          </Menu>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          className="bg-gray-800"
        >
          <Menu.Item
            key="/account"
            icon={<img src={settings} alt="" className="h-6 w-6" />}
            onClick={() => navigate("/account")}
            className={`${
              pathName === "/account" ? "bg-gray-700" : "bg-gray-800"
            }`}
          >
            Hisob
          </Menu.Item>
          <Menu.Item
            key="/logout"
            icon={<img src={logoutIcon} alt="" className="h-6 w-6" />}
            onClick={() =>
              Modal.confirm({
                onOk: () => logout(navigate),
                title: "Chiqasizmi ?",
              })
            }
            className={`${
              pathName === "/logout" ? "bg-gray-700" : "bg-gray-800"
            }`}
          >
            <Button type="link" className="text-white">
              Chiqish
            </Button>
          </Menu.Item>
        </Menu>
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
