import { useState } from "react";
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
  BookFilled
} from "@ant-design/icons";

import { Layout, Menu, Button, Modal, Badge, Flex } from "antd";

import Sider from "antd/es/layout/Sider";
import logo from "../../assets/logo.jpg";
import logoutImage from "../../assets/logout.png";

import { Content, Header } from "antd/es/layout/layout";

import "./style.scss";
import { useAuth } from "../../states/auth";
import { ROLE } from "../../constants";

// const UserRole = Cookies.get(ROLE) || ""

const AdminLayout = () => {
  const { role, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
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
            <img style={{ width: "40px" }} src={logo} alt="" />
          ) : (
            "Humo Edu"
          )}
        </h3>
        <Menu
          className="menu"
          theme="dark"
          mode="inline"
          // defaultSelectedKeys={pathname}
          items={[
            {
              key: "/dashboard",
              icon: <UserOutlined />,
              label: <Link to="/dashboard">Dashboard</Link>,
            },
            {
              key: "/users",
              icon: <TeamOutlined />,
              label: (
                <Link to="/adminUsers">
                  Xodimlar {role !== "superadmin" ? <LockOutlined color="red" /> : null}
                </Link>
              ),
            },

            {
              key: "/portfolios",
              icon: <BranchesOutlined />,
              label: (
                <Link to={role !== "superadmin" ? "/dashboard" : "/adminBranch"}>
                  Filial {role !== "superadmin" ? <LockOutlined /> : ""}
                </Link>
              ),
            },
            {
              key: "/adminGroup",
              icon: <UsergroupAddOutlined />,
              label: (
                <Link to={role !== "superadmin" ? "/dashboard" : "/adminGroup"}>
                  Guruhlar {role !== "superadmin" ? <LockOutlined /> : ""}
                </Link>
              ),
            },
            {
              key: "/adminPayments",
              icon: <WalletOutlined />,
              label: (
                <Link to={role!== "superadmin" ? "/dashboard" : "/adminPayments"}>
                  To'lovlar {role !== "superadmin" ? <LockOutlined /> : ""}
                </Link>
              ),
            },
            {
              key: "/adminStudents",
              icon: <DatabaseOutlined />,
              label: (
                <Link to={role !== "superadmin" ? "/dashboard" : "/adminStudents"}>
                  O'quvchilar {role !== "superadmin" ? <LockOutlined /> : ""}
                </Link>
              ),
            },
            {
              key: "/adminSciences",
              icon: <BookFilled />,
              label: (
                <Link to={role !== "superadmin" ? "/dashboard" : "/adminScience"}>
                  Fanlar {role !== "superadmin" ? <LockOutlined /> : ""}
                </Link>
              ),
            },

            // {
            //   key: "/education",
            //   icon: <ReadOutlined />,
            //   label: (
            //     <Link to={role === "user" ? "/dashboard" : "/adminEducation"}>
            //       Education {role === "user" ? <LockOutlined /> : ""}
            //     </Link>
            //   ),
            // },
            // {
            //   key: "/experience",
            //   icon: <ClockCircleOutlined />,
            //   label: (
            //     <Link to={role === "user" ? "/dashboard" : "/adminExperiences"}>
            //       Experience {role === "user" ? <LockOutlined /> : ""}
            //     </Link>
            //   ),
            // },
            // {
            //   key: "/skills",
            //   icon: <LockOutlined />,
            //   label: (
            //     <Link to={role === "user" ? "/dashboard" : "/adminSkills"}>
            //       Skills {role === "user" ? <LockOutlined /> : ""}
            //     </Link>
            //   ),
            // },
            
           
          ]}
        />
      </Sider>
      <Layout>
        <Header
          className="dashboard-header"
          style={{
            padding: 0,
          }}
        >
          <Button
            type="text"
            onClick={() => setCollapsed(!collapsed)}
            icon={<MenuFoldOutlined />}
            style={{
              fontSize: "18px",
              width: 64,
              height: 64,
            }}
          />
          <Flex align="center" gap={10}>
            {/* <Link to="/dashboard" className="notification">
              <Badge className="dashboard-badge" count={0} size="small">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 -960 960 960"
                >
                  <path d="M160-200v-80h80v-280q0-83 50-147.5T420-792v-28q0-25 17.5-42.5T480-880q25 0 42.5 17.5T540-820v28q80 20 130 84.5T720-560v280h80v80H160Zm320-300Zm0 420q-33 0-56.5-23.5T400-160h160q0 33-23.5 56.5T480-80ZM320-280h320v-280q0-66-47-113t-113-47q-66 0-113 47t-47 113v280Z" />
                </svg>
              </Badge>
            </Link>
            <Link to="/account" className="notification">
              <Badge className="dashboard-account-badge" count={0} size="small">
                <h3
                  style={{
                    color: "#ffc700",
                    padding: "10px",
                  }}
                >
                  Account
                </h3>
              </Badge>
            </Link> */}
            <Button
                  className="LogOut"
                  onClick={() =>
                    Modal.confirm({
                      title: "Do you want to log out ?",
                      onOk: () => logout(navigate),
                    })
                  }
                >
                  <img src={logoutImage} alt="" />
                  Chiqish
                </Button>
          </Flex>
        </Header>
        <Content
          className="dashboard-main"
          style={{
            padding: 24,
            minHeight: 280,
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
