import { useState, useEffect } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";

import {
  DatabaseOutlined,
  LockOutlined,
  MenuFoldOutlined,
  TeamOutlined,
  UserOutlined,
  BranchesOutlined,
  UsergroupAddOutlined,
  WalletOutlined,
  UserDeleteOutlined,
} from "@ant-design/icons";

import { Layout, Menu, Button, Modal } from "antd";
import logo from "../../assets/logo.jpg";
import { useAuth } from "../../states/auth";
// import { ROLE } from "../../constants";

import "./style.scss";

const { Sider, Header, Content } = Layout;

const BranchAdminLayout = () => {
  const { role, logout, username } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [selectedKey, setSelectedKey] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".user-dropdown")) {
        setDropdownVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    setSelectedKey(location.pathname);
  }, [location.pathname]);

  const handleDropdownToggle = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const handleLogout = () => {
    Modal.confirm({
      title: "Do you want to log out?",
      onOk: () => logout(navigate),
    });
  };

  const menuItems = [
    {
      key: "/branchDashboard",
      icon: <UserOutlined />,
      label: <Link to="/branchDashboard">Dashboard</Link>,
    },
    {
      key: "/branchUsers",
      icon: <TeamOutlined />,
      label: (
        <Link to="/branchUsers">
          Xodimlar {role !== "admin" ? <LockOutlined color="red" /> : null}
        </Link>
      ),
    },
    {
      key: "/branchRooms",
      icon: <BranchesOutlined />,
      label: (
        <Link to={role !== "admin" ? "/branchDashboard" : "/branchRooms"}>
          Xonalar {role !== "admin" ? <LockOutlined /> : ""}
        </Link>
      ),
    },
    {
      key: "/branchGroup",
      icon: <UsergroupAddOutlined />,
      label: (
        <Link to={role !== "admin" ? "/branchDashboard" : "/branchGroup"}>
          Guruhlar {role !== "admin" ? <LockOutlined /> : ""}
        </Link>
      ),
    },
    {
      key: "/adminPayments",
      icon: <WalletOutlined />,
      label: "To'lovlar",
      children: [
        {
          key: "/adminPayments/student",
          label: <Link to="/adminPayments/student">O'quvchilar</Link>,
        },
        {
          key: "/adminPayments/teachers",
          label: <Link to="/adminPayments/teachers">O'qituvchilar</Link>,
        },
      ],
    },
    {
      key: "/branchStudents",
      icon: <DatabaseOutlined />,
      label: (
        <Link to={role !== "admin" ? "/branchDashboard" : "/branchStudents"}>
          O'quvchilar {role !== "admin" ? <LockOutlined /> : ""}
        </Link>
      ),
    },
    {
      key: "/branchDebtorStudents",
      icon: <UserDeleteOutlined />,
      label: (
        <Link
          to={
            role !== "admin" ? "/branchDebtorStudents" : "/branchDebtorStudents"
          }
        >
          Qarzdorlar {role !== "admin" ? <LockOutlined /> : ""}
        </Link>
      ),
    },
  ];

  return (
    <Layout>
      <Sider
        className="dashboard-sider"
        trigger={null}
        collapsible
        collapsed={collapsed}
      >
        <h3 className="dashboard-logo">
          {collapsed ? (
            <img style={{ width: "40px" }} src={logo} alt="logo" />
          ) : (
            "Humo Edu Admin"
          )}
        </h3>
        <Menu
          className="menu"
          theme="dark"
          mode="inline"
          selectedKeys={[selectedKey]}
          onClick={({ key }) => setSelectedKey(key)}
          items={menuItems}
        />
      </Sider>
      <Layout>
        <Header className="dashboard-header">
          <Button
            type="text"
            onClick={() => setCollapsed(!collapsed)}
            icon={<MenuFoldOutlined />}
            style={{ fontSize: "18px", width: 64, height: 64 }}
          />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              paddingRight: "50px",
            }}
          >
            <li
              className={`dropdown user-dropdown ${
                dropdownVisible ? "open" : ""
              }`}
            >
              <a
                href="#"
                className="dropdown-toggle me-n1"
                onClick={handleDropdownToggle}
              >
                <div className="user-toggle">
                  <div className="user-avatar sm">
                    {/* <img src="#" alt="JD" /> */}
                  </div>
                  <div className="user-info d-none d-xl-block">
                    <div className="user-status user-status-active text-white">
                      Administrator
                    </div>
                    <div className="user-name dropdown-indicator text-white">
                      {username}
                    </div>
                  </div>
                </div>
              </a>
              {dropdownVisible && (
                <div className="dropdown-menu dropdown-menu-md dropdown-menu-end ">
                  <div className="dropdown-inner user-card-wrap bg-lighter d-none d-md-block">
                    <div className="user-card">
                      <div className="user-avatar">
                        {/* <span>{username.substring(0, 2)}</span> */}
                      </div>
                      <div className="user-info">
                        <span className="lead-text">{username}</span>
                      </div>
                    </div>
                  </div>
                  <div className="dropdown-inner">
                    <ul className="link-list">
                      <li
                        className="link-list__item"
                        onClick={handleDropdownToggle}
                      >
                        <Link to={role === "admin" ? "/adminprofile" : " "}>
                          <span>View Profile</span>
                        </Link>
                      </li>
                    </ul>
                  </div>
                  <div className="dropdown-inner">
                    <ul className="link-list">
                      <li onClick={handleLogout} className="link-list__item">
                        <a href="#">
                          <span>Logout</span>
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </li>
          </div>
        </Header>
        <Content className="dashboard-main">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default BranchAdminLayout;
