import { Layout, Menu, Input, Avatar, Badge, Dropdown } from "antd";
import {
  LogoutOutlined,
  BellOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  DownOutlined
} from "@ant-design/icons";

import {
  useNavigate,
  Navigate,
  useLocation,
} from "react-router-dom";

import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { getUserById, logoutUser } from "services/user/user.auth.services";
import { doLogoutAction } from "@redux/account/accountSlice";
import "./Header.Dashboard.css";

const { Header } = Layout;

const HeaderDashboard = ({ collapsed, setCollapsed }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.account?.user);
  const isUserAuthenticated = useSelector(
    (state) => state.account?.isUserAuthenticated
  );
  const [dataUpdateDoctor, setDataUpdateDoctor] = useState(null);

  useEffect(() => {
    const fetchUserById = async () => {
      if (user?._id) {
        const res = await getUserById(user._id);
        if (res?.data) setDataUpdateDoctor(res.data);
      }
    };
    fetchUserById();
  }, [user?._id]);

  const handleLogoutClick = async () => {
    const res = await logoutUser();
    if (res) {
      dispatch(doLogoutAction());
      navigate("/login");
    }
  };

  if (!isUserAuthenticated) return <Navigate to="/login" replace />;


  return (
      <Header className="dashboard-header">
        <div className="header-left">
          {collapsed ? (
            <MenuUnfoldOutlined
              className="toggle-icon"
              onClick={() => setCollapsed(false)}
            />
          ) : (
            <MenuFoldOutlined
              className="toggle-icon"
              onClick={() => setCollapsed(true)}
            />
          )}
          <div className="header-logo">Healio</div>
          <Input.Search placeholder="Search..." className="custom-search-input" />
        </div>

        <div className="header-right">
          <Badge count={3} offset={[-2, 2]}>
            <BellOutlined className="notification-icon" />
          </Badge>

          <Dropdown
            overlay={
              <Menu>
                <Menu.Item key="logout" onClick={handleLogoutClick} danger>
                  <LogoutOutlined style={{ marginRight: 8 }} />Logout
                </Menu.Item>
              </Menu>
            }
            placement="bottomRight"
            trigger={["click"]}
          >
            <div
              className="user-dropdown"
              style={{
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <div className="user-info" style={{ textAlign: "right" }}>
                <div className="doctor-name">{user?.fullName}</div>
                <div className="doctor-role">{user?.role}</div>
              </div>
              <Avatar
                src={
                  dataUpdateDoctor?.avatar
                    ? `${import.meta.env.VITE_BACKEND_URL}/public/images/upload/${user?.avatar || dataUpdateDoctor?.avatar}`
                    : undefined
                }
                alt="avatar"
                className="doctor-avatar"
              />
              <DownOutlined style={{ fontSize: 12, color: "#999" }} />
            </div>
          </Dropdown>

        </div>
      </Header>
  );
};

export default HeaderDashboard;
