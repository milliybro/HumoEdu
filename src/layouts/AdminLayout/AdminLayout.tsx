import { useState } from "react";
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
  BookFilled,
  UserDeleteOutlined,
} from "@ant-design/icons";

import { Layout, Menu, Button, Modal, Flex } from "antd";

import Sider from "antd/es/layout/Sider";
import logo from "../../assets/logo.jpg";
import logoutImage from "../../assets/logout.png";

import { Content, Header } from "antd/es/layout/layout";

import "./style.scss";
import { useAuth } from "../../states/auth";

const AdminLayout = () => {
  const { role, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { pathname } = location;

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
          selectedKeys={[pathname]} // Set the selected key based on the current pathname
          items={[
            {
              key: "/dashboard",
              icon: <UserOutlined />,
              label: <Link to="/dashboard">Dashboard</Link>,
            },
            {
              key: "/adminUsers",
              icon: <TeamOutlined />,
              label: (
                <Link to="/adminUsers">
                  Xodimlar{" "}
                  {role !== "superadmin" ? <LockOutlined color="red" /> : null}
                </Link>
              ),
            },
            {
              key: "/adminBranch",
              icon: <BranchesOutlined />,
              label: (
                <Link
                  to={role !== "superadmin" ? "/dashboard" : "/adminBranch"}
                >
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
              label: "To'lovlar",
              children: [
                {
                  key: "/superPayments/student",
                  label: <Link to="/superPayments/student">O'quvchilar</Link>,
                },
                {
                  key: "/superPayments/teachers",
                  label: (
                    <Link to="/superPayments/teachers">O'qituvchilar</Link>
                  ),
                },
              ],
            },
            {
              key: "/adminStudents",
              icon: <DatabaseOutlined />,
              label: (
                <Link
                  to={role !== "superadmin" ? "/dashboard" : "/adminStudents"}
                >
                  O'quvchilar {role !== "superadmin" ? <LockOutlined /> : ""}
                </Link>
              ),
            },
            {
              key: "/adminScience",
              icon: <BookFilled />,
              label: (
                <Link
                  to={role !== "superadmin" ? "/dashboard" : "/adminScience"}
                >
                  Fanlar {role !== "superadmin" ? <LockOutlined /> : ""}
                </Link>
              ),
            },
            {
              key: "/adminDebtorStudents",
              icon: <UserDeleteOutlined />,
              label: (
                <Link
                  to={
                    role !== "superadmin"
                      ? "/dashboard"
                      : "/adminDebtorStudents"
                  }
                >
                  Qarzdorlar {role !== "superadmin" ? <LockOutlined /> : ""}
                </Link>
              ),
            },
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
