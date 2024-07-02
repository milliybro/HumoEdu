import { useState, Fragment } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { Menu } from "antd";
import exampleLogo from "../../assets/humo oquv markazi.png";
import ConfirmationModal from "../confirmation/ConfirmationModal";
import { useAuth } from "../../states/auth";
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // State for sidebar open/close
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { logout } = useAuth();
  const pathName = location.pathname;

  const navigationLinks = [
    { path: "/home", label: "Home", icon: dashboard },
    { path: "/skills", label: "Dars jadvali", icon: schedule },
    { path: "/my-groups", label: "Guruhlarim", icon: groups },
    { path: "/payments", label: "To'lovlar", icon: payment },
  ];

  const handleConfirmLogout = () => {
    try {
      setIsModalOpen(false);
      logout(navigate);
      navigate("/login");
    } catch (err) {
      console.error("Could not log out", err);
      // Handle error if necessary
    } finally {
      setIsModalOpen(false);
    }
  };

  const cancelDelete = () => {
    setIsModalOpen(false);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <Fragment>
      <div
        className={`fixed inset-y-0 left-0 bg-gray-800 w-64 lg:w-64 lg:translate-x-0 transform ${
          isSidebarOpen ? "" : "-translate-x-full"
        } lg:fixed`}
      >
        <div className="h-screen bg-gray-800 text-white flex flex-col justify-between">
          <div>
            <div className="p-2 flex justify-center bg-white">
              <div className="logo_wrapper">
                <NavLink to="/home">
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
      </div>
      <button
        className="fixed lg:hidden inset-y-0 right-0 bg-gray-800 text-white p-2"
        onClick={toggleSidebar}
      >
        {isSidebarOpen ? "Close" : "Open"}
      </button>
    </Fragment>
  );
};

export default Sidebar;
