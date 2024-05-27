import { useState, useEffect } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";

import {
  DatabaseOutlined,
  LockOutlined,
  MenuFoldOutlined,
  TeamOutlined,
  UserOutlined,
  BranchesOutlined,
  UsergroupAddOutlined,
  WalletOutlined,
  BookFilled,
} from "@ant-design/icons";

import { Layout, Menu, Button, Modal, Badge } from "antd";
import logo from "../../assets/logo.jpg";
import logoutImage from "../../assets/logout.png";
import { useAuth } from "../../states/auth";
import { ROLE } from "../../constants";

import "./style.scss";

const { Sider, Header, Content } = Layout;

const BranchAdminLayout = () => {
  const { role, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.user-dropdown')) {
        setDropdownVisible(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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
      key: "/dashboard",
      icon: <UserOutlined />,
      label: <Link to="/branchDashboard">Dashboard</Link>,
    },
    {
      key: "/users",
      icon: <TeamOutlined />,
      label: (
        <Link to="/branchUsers">
          Xodimlar {role !== "admin" ? <LockOutlined color="red" /> : null}
        </Link>
      ),
    },

    {
      key: "/portfolios",
      icon: <BranchesOutlined />,
      label: (
        <Link to={role !== "admin" ? "/branchDashboard" : "/branchRooms"}>
          Xonalar {role !== "admin" ? <LockOutlined /> : ""}
        </Link>
      ),
    },
    {
      key: "/adminGroup",
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
      label: (
        <Link to={role!== "admin" ? "/branchDashboard" : "/branchPayments"}>
          To'lovlar {role !== "admin" ? <LockOutlined /> : ""}
        </Link>
      ),
    },
    {
      key: "/adminStudents",
      icon: <DatabaseOutlined />,
      label: (
        <Link to={role !== "admin" ? "/branchDashboard" : "/branchStudents"}>
          O'quvchilar {role !== "admin" ? <LockOutlined /> : ""}
        </Link>
      ),
    }
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
          <div style={{ display: "flex", alignItems: "center" }}>
            <li className={`dropdown user-dropdown ${dropdownVisible ? "open" : ""}`}>
              <a href="#" className="dropdown-toggle me-n1" onClick={handleDropdownToggle}>
                <div className="user-toggle">
                  <div className="user-avatar sm">
                    <img src="" alt="avatar" />
                  </div>
                  <div className="user-info d-none d-xl-block">
                    <div className="user-status user-status-active">Administrator</div>
                    <div className="user-name dropdown-indicator">Abu Bin Ishityak</div>
                  </div>
                </div>
              </a>
              {dropdownVisible && (
                <div className="dropdown-menu dropdown-menu-md dropdown-menu-end">
                  <div className="dropdown-inner user-card-wrap bg-lighter d-none d-md-block">
                    <div className="user-card">
                      <div className="user-avatar">
                        <span>AB</span>
                      </div>
                      <div className="user-info">
                        <span className="lead-text">Abu Bin Ishtiyak</span>
                        <span className="sub-text">info@softnio.com</span>
                      </div>
                    </div>
                  </div>
                  <div className="dropdown-inner">
                    <ul className="link-list">
                      <li>
                        <a href="">
                          <span>View Profile</span>
                        </a>
                      </li>
                      <li>
                        <a href="">
                          <span>Account Setting</span>
                        </a>
                      </li>
                      <li>
                        <a href="">
                          <span>Login Activity</span>
                        </a>
                      </li>
                    </ul>
                  </div>
                  <div className="dropdown-inner">
                    <ul className="link-list">
                      <li>
                        <a href="" onClick={handleLogout}>
                          <span>Logout</span>
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </li>
            <Button
              className="LogOutB"
              onClick={handleLogout}
            >
              <img src={logoutImage} alt="logout" />
              Chiqish
            </Button>
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