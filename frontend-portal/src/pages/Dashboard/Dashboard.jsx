import { Layout, Menu } from "antd";
import {
  FileTextOutlined,
  UserOutlined,
  KeyOutlined,
  LogoutOutlined,
} from "@ant-design/icons";

import {
  useNavigate,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";

import { getUserById, logoutUser } from "services/auth.user/user.auth.services";
import { doLogoutAction } from "@redux/account/accountSlice";

// import HoSoCuaToi from "pages/HoSoCuaToi/HoSoCuaToi";
// import PhieuKhamTable from "components/PhieuKhamBenh/PhieuKhamBenh";
import ModalUpdateThongTin from "components/ThongTinNguoiDung/ModalUpdateThongTin";
import ModalChangePassword from "components/ModalChangePassword/ModalChangePassword";

import "./Dashboard.scss";

const { Sider, Content } = Layout;

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.account?.user);
  const isUserAuthenticated = useSelector(
    (state) => state.account?.isUserAuthenticated
  );
  const [collapsed, setCollapsed] = useState(false);
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

  const menuItems = [
    {
      type: "group",
      label: "Hồ sơ bệnh nhân",
      children: [
        {
          label: "Danh sách phiếu khám",
          key: "examination",
          icon: <FileTextOutlined />,
        },
      ],
    },
    {
      type: "group",
      label: "Tài khoản của tôi",
      children: [
        {
          label: "Thông tin người dùng",
          key: "userinfo",
          icon: <UserOutlined />,
        },
        {
          label: "Đổi mật khẩu",
          key: "changepassword",
          icon: <KeyOutlined />,
        },
      ],
    },
  ];

  const handleMenuClick = ({ key }) => {
    if (key === "logout") handleLogoutClick();
    else navigate(key);
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Layout>
        <Sider
          theme="light"
          width={300}
          collapsible
          collapsed={collapsed}
          onCollapse={(value) => setCollapsed(value)}
          className="sidebar-menu"
        >
          <div className="sidebar-scroll-wrapper">
            <div className="logout-wrapper">
              <Menu
                mode="inline"
                selectedKeys={[location.pathname.split("/").pop()]}
                onClick={handleMenuClick}
                items={menuItems}
                style={{ paddingLeft: collapsed ? 0 : 12 }}
              />
              <Menu
                mode="inline"
                onClick={() => handleLogoutClick()}
                items={[
                  {
                    label: "Đăng xuất",
                    key: "logout",
                    icon: <LogoutOutlined />,
                    danger: true,
                  },
                ]}
                style={{ marginTop: 12, borderTop: "1px solid #f0f0f0" }}
              />
            </div>
          </div>
        </Sider>

        <Content style={{ padding: 24, background: "#fff" }}>
          <Routes>
            {/* <Route path="profile" element={<HoSoCuaToi />} /> */}
            {/* <Route path="examination" element={<PhieuKhamTable />} /> */}
            <Route path="userinfo" element={<ModalUpdateThongTin />} />
            <Route path="changepassword" element={<ModalChangePassword />} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Dashboard;
