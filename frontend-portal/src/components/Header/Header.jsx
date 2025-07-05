import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, Dropdown, Menu, message } from "antd";
import { MdOutlineAccountCircle } from "react-icons/md";

import { logoutUser, getUserById } from "services/auth.user/user.auth.services";
import { doLogoutAction } from "@redux/account/accountSlice";

import LoginPage from "pages/Login/Login";
import UpdateBenhNhan from "../ThongTinNguoiDung/ModalUpdateThongTin";
import ModalChangePassword from "../ModalChangePassword/ModalChangePassword";
import ScrollToTop from "../ScrollToTop/ScrollToTop";
import "./header.scss";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const [modals, setModals] = useState({
    login: false,
    updateProfile: false,
    changePassword: false,
  });

  const [dataAcc, setDataAcc] = useState(null);
  const { isAuthenticated, user: acc } = useSelector((state) => state.account);

  const [current, setCurrent] = useState("home");

  useEffect(() => {
    if (location && location.pathname) {
      const allRoutes = [
        { key: "home", path: "/" },
        { key: "chuyenkhoa", path: "/chuyen-khoa-kham" },
        { key: "bacsinoibat", path: "/bac-si-noi-bat" },
        { key: "dichvu", path: "/dich-vu-kham" },
        { key: "lienhe", path: "/lien-he" },
      ];
      const match = allRoutes.find((item) => item.path === location.pathname);
      if (match) {
        setCurrent(match.key);
      } else {
        setCurrent("home");
      }
    }
  }, [location]);

  useEffect(() => {
    if (acc?._id) {
      getUserById(acc._id).then((res) => {
        if (res?.data) setDataAcc(res.data);
      });
    }
  }, [acc?._id]);

  const handleLogout = async () => {
    try {
      await logoutUser();
      localStorage.removeItem("access_tokenBenhNhan");
      message.success("Đăng xuất thành công!");
      dispatch(doLogoutAction());
      navigate("/");
    } catch (error) {
      message.error("Đăng xuất không thành công!");
    }
  };

  const onClick = (e) => {
    const pathMap = {
      home: "/",
      chuyenkhoa: "/chuyen-khoa-kham",
      bacsinoibat: "/bac-si-noi-bat",
      dichvu: "/dich-vu-kham",
      lienhe: "/lien-he",
    };
    setCurrent(e.key);
    if (pathMap[e.key]) navigate(pathMap[e.key]);
  };

  const menuItems = [
    {
      label: "Trang chủ",
      key: "home",
    },
    {
      label: "Chuyên khoa",
      key: "chuyenkhoa",
    },
    {
      label: "Bác sĩ",
      key: "bacsinoibat",
    },
    {
      label: "Dịch vụ",
      key: "dichvu",
    },
    {
      label: "Liên hệ",
      key: "lienhe",
    },
  ];

  return (
    <>
      <div className="header-modern">
        <div className="header-bar">
          <div className="header-row-top full-width-menu">
            <div className="header-left" onClick={() => navigate("/")}> 
              <img
                src="/medicare-Photoroom-removebg-preview.png"
                alt="Logo"
                className="logo-img"
              />
            </div>

            <div className="header-center">
              <Menu
                mode="horizontal"
                onClick={onClick}
                selectedKeys={[current]}
                items={menuItems}
                className="main-menu"
              />
            </div>

            <div className="header-right">
              {isAuthenticated ? (
                <Dropdown
                  trigger={["click"]}
                  menu={{
                    items: [
                      {
                        key: "account",
                        label: (
                          <span onClick={() => setModals((m) => ({ ...m, updateProfile: true }))}>
                            Tài khoản của tôi
                          </span>
                        ),
                      },
                      {
                        key: "lichhen",
                        label: <span onClick={() => navigate("/user/lich-hen")}>Lịch hẹn</span>,
                      },
                      {
                        key: "hoso",
                        label: <span onClick={() => navigate("/user/ho-so-cua-toi")}>Hồ sơ của tôi</span>,
                      },
                      {
                        key: "changepw",
                        label: (
                          <span onClick={() => setModals((m) => ({ ...m, changePassword: true }))}>
                            Đổi mật khẩu
                          </span>
                        ),
                      },
                      {
                        key: "logout",
                        danger: true,
                        label: <span onClick={handleLogout}>Đăng xuất</span>,
                      },
                    ],
                  }}
                >
                  <span>
                    {dataAcc?.hinhAnh ? (
                      <Avatar
                        src={`${import.meta.env.VITE_BACKEND_URL}/public/benhnhan/${acc.user.hinhAnh}`}
                        size={40}
                      />
                    ) : (
                      <MdOutlineAccountCircle size={36} color="#278DCA" />
                    )}
                  </span>
                </Dropdown>
              ) : (
                <span onClick={() => setModals((m) => ({ ...m, login: true }))} style={{ cursor: "pointer" }}>
                  Đăng nhập
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <LoginPage
        openModalLogin={modals.login}
        setOpenModalLogin={(val) => setModals((m) => ({ ...m, login: val }))}
      />
      <UpdateBenhNhan
        openUpdateBenhNhan={modals.updateProfile}
        setOpenModalThongTinCaNhan={(val) =>
          setModals((m) => ({ ...m, updateProfile: val }))
        }
      />
      <ModalChangePassword
        openModalChangePassword={modals.changePassword}
        setOpenModalChangePassword={(val) =>
          setModals((m) => ({ ...m, changePassword: val }))
        }
      />

      <ScrollToTop />
    </>
  );
};

export default Header;
