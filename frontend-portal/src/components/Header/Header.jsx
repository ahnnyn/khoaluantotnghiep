import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  HomeOutlined,
  CalendarOutlined,
  DollarOutlined,
  SolutionOutlined,
  LogoutOutlined,
  UserOutlined,
  LockOutlined,
  MenuOutlined,
  DownOutlined,
  FileTextOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import { FiUser } from "react-icons/fi";
import { Menu, message, Avatar, Dropdown } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { fetchAllDepartments } from "services/patient/patient.services";
import { logoutUser } from "services/auth.user/user.auth.services";
import { doLogoutAction } from "@redux/account/accountSlice";
import LoginPage from "pages/Login/Login";
import ModalChangePassword from "components/ModalChangePassword/ModalChangePassword";

import logo from "../../../public/assets/images/healio_logo-removebg-preview.png";
import "./Header.scss";

const Header = () => {
  const [current, setCurrent] = useState("home");
  const [departments, setDepartments] = useState([]);
  const [openModalLogin, setOpenModalLogin] = useState(false);
  const [openModalDoiMK, setOpenModalDoiMK] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const user = useSelector((state) => state.account?.user);
  console.log("User from Redux:", user);

  // Load selected menu key từ localStorage hoặc pathname
  useEffect(() => {
    const savedKey = localStorage.getItem("selectedMenuKey");
    if (savedKey) {
      setCurrent(savedKey);
    } else {
      const path = location.pathname;
      if (path === "/") setCurrent("home");
      else if (path.startsWith("/tu-van")) setCurrent("consult");
      else if (path.startsWith("/bang-gia")) setCurrent("pricing");
      else if (path.startsWith("/chuyen-khoa")) setCurrent("booking");
    }
  }, [location.pathname]);

  // Fetch danh sách chuyên khoa
  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await fetchAllDepartments();
        setDepartments(res.data || []);
      } catch (err) {
        console.error("Lỗi load khoa:", err);
      }
    };
    fetch();
  }, []);

  const handleLogout = async () => {
    try {
      await logoutUser();
      localStorage.removeItem("access_token");
      localStorage.removeItem("selectedMenuKey");
      dispatch(doLogoutAction());
      message.success("Đăng xuất thành công!");
      navigate("/");
    } catch (error) {
      message.error("Đăng xuất không thành công!");
    }
  };

  const menuItems = [
    {
      key: "home",
      label: <Link to="/">Trang chủ</Link>,
      // icon: <HomeOutlined />,
    },
    {
      key: "consult",
      label: <Link to="/tu-van">Tư vấn</Link>,
      // icon: <SolutionOutlined />,
    },
    {
      key: "booking",
      label: "Đặt lịch",
      // icon: <CalendarOutlined />,
      children: departments.map((dept) => ({
        key: `dept-${dept._id}`,
        label: <Link to={`/chuyen-khoa/${dept._id}`}>{dept.name}</Link>,
      })),
    },
    {
      key: "pricing",
      label: <Link to="/bang-gia">Bảng giá</Link>,
      // icon: <DollarOutlined />,
    },
    {
      key: "articles",
      label: <Link to="/bai-viet">Bài viết</Link>,
      // icon: <FileTextOutlined />,
    },
  ];

  const getDropdownMenu = () => (
    <Menu
      items={[
        {
          key: "dashboard",
          label: <Link to="/user/dashboard">Dashboard</Link>,
          icon: <HomeOutlined />,
        },
        {
          key: "change-password",
          label: (
            <span onClick={() => setOpenModalDoiMK(true)}>Đổi mật khẩu</span>
          ),
          icon: <LockOutlined />,
        },
        {
          key: "logout",
          label: <span onClick={handleLogout}>Đăng xuất</span>,
          icon: <LogoutOutlined />,
        },
      ]}
    />
  );

  const onClick = (e) => {
    setCurrent(e.key);
    localStorage.setItem("selectedMenuKey", e.key);

    if (e.key === "login") setOpenModalLogin(true);
    if (e.key === "change-password") setOpenModalDoiMK(true);
    setShowMobileMenu(false);
  };

  return (
    <>
      <div className="header-modern">
        <div className="header-left">
          <Link to="/">
            <img src={logo} alt="Logo" className="logo-img" />
          </Link>
        </div>

        <div className="header-center desktop-only">
          <Menu
            onClick={onClick}
            selectedKeys={[current]}
            mode="horizontal"
            items={menuItems}
            className="nav-menu"
          />
        </div>

        <div className="header-right">
          <MenuOutlined
            className="mobile-menu-icon"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
          />

          {user?._id ? (
            <Dropdown overlay={getDropdownMenu()} placement="bottomRight" arrow>
              <div className="user-info-dropdown">
                <Avatar
                  src={user.avatar || undefined}
                  icon={<UserOutlined />}
                  size="large"
                />
                <span className="user-name">
                  {user.fullName || "Người dùng"}
                </span>
                <DownOutlined style={{ marginLeft: 6 }} />
              </div>
            </Dropdown>
          ) : (
            <div className="login-btn" onClick={() => setOpenModalLogin(true)}>
              <FiUser style={{ fontSize: "20px", marginRight: 6 }} />
              <span>Đăng nhập</span>
            </div>
          )}
        </div>
      </div>

      {showMobileMenu && (
        <div className="mobile-menu-dropdown">
          <Menu
            onClick={onClick}
            selectedKeys={[current]}
             mode="inline"
            items={[
              ...menuItems,
              !user?._id
                ? {
                    key: "login",
                    label: "Đăng nhập",
                    icon: <UserOutlined />,
                  }
                : {
                    key: "logout",
                    label: <span onClick={handleLogout}>Đăng xuất</span>,
                    icon: <LogoutOutlined />,
                  },
            ]}
          />
        </div>
      )}

      <LoginPage
        openModalLogin={openModalLogin}
        setOpenModalLogin={setOpenModalLogin}
      />
      <ModalChangePassword
        openModalDoiMK={openModalDoiMK}
        setOpenModalDoiMK={setOpenModalDoiMK}
      />
    </>
  );
};

export default Header;
