import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Row, Col, Drawer, Button, message } from "antd";
import {
  MenuOutlined,
  SearchOutlined,
  UserOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { doLogoutAction } from "@redux/account/accountSlice";
import { Navigate, useNavigate } from "react-router-dom";
import "./css.css";
import { logoutUser } from "services/user/user.auth.services";

const Header = () => {
  const user = useSelector((state) => state.account.user);

  const isuserenticated = useSelector(
    (state) => state.account.isuserenticated
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [openDrawer, setOpenDrawer] = useState(false);

  const showDrawer = () => setOpenDrawer(true);
  const onCloseDrawer = () => setOpenDrawer(false);

  const handleLogout = async () => {
    try {
      const res = await logoutUser();
      if (res.data?.success) {
        dispatch(doLogoutAction()); // Xóa user khỏi Redux
        localStorage.removeItem("access_token"); // Xóa token local
        message.success(res.data.message || "Đăng xuất thành công");
        navigate("/");
      }
    } catch (error) {
      message.error(
        error?.response?.data?.message || "Logout thất bại"
      );
    }
  };

  return (
    <div className="header-container">
      <Row justify="space-between" align="middle" className="w-100">
        {/* Logo */}
        <Col xs={6} md={4}>
          <a href="/doctor" className="logo-area">
            <img
              src="../../../assets/images/banner/medicare-Photoroom-removebg-preview.png"
              alt="Logo"
              className="logo-img"
              style={{ width: "100px", height: "100px" }}
            />
          </a>
        </Col>

        {/* Spacer */}
        <Col xs={0} md={16} />

        {/* Welcome + Logout (Only show if userenticated) */}
        {isuserenticated && (
          <Col xs={0} md={4} style={{ textAlign: "right" }}>
            <div
              className="welcome-text"
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "12px",
              }}
            >
              <button
                className="nav-link"
                onClick={handleLogout}
                type="button"
                style={{
                  background: "none",
                  border: "none",
                  color: "#ffff",
                  fontSize: "16px",
                  cursor: "pointer",
                }}
              >
                <i
                  className="fa-solid fa-right-from-bracket"
                  style={{ marginRight: "5px" }}
                ></i>{" "}
                Đăng xuất
              </button>
            </div>
          </Col>
        )}
      </Row>
    </div>
  );
};

export default Header;
