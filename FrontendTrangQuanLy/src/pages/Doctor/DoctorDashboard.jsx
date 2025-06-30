import { Layout, Menu, Switch } from "antd";
import {
  DashboardOutlined,
  CalendarOutlined,
  FileTextOutlined,
  UserOutlined,
  BarChartOutlined,
  SettingOutlined,
  LogoutOutlined,
  MessageOutlined,
  ScheduleOutlined,
  SolutionOutlined,
  KeyOutlined,
  ProfileOutlined,
  IdcardOutlined,
} from "@ant-design/icons";
import { FaSun, FaMoon } from "react-icons/fa";

import {
  useNavigate,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";

import { getUserById, logoutUser } from "services/user/user.auth.services";
import { doLogoutAction } from "@redux/account/accountSlice";

import DashboardOverview from "components/Doctor/DashboardOverview/DashboardOverview";
import Appointment from "components/Doctor/Appointment/Appointments";
import PatientProfile from "components/Doctor/PatientProfile/PatientProfile";
import DoctorUpdate from "components/Doctor/DoctorInformation/DoctorUpdate";
import DoctorWorkSchedule from "components/Doctor/DoctorWorkSchedule/DoctorWorkSchedule";
import ChangePasswordModal from "components/Doctor/ChangePasswordModal/ChangePasswordModal";
import HeaderDashboard from "../../components/Doctor/Header/Header.Dashboard";
import "./DoctorDashboard.css";

const {Sider, Content } = Layout;

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [darkMode, setDarkMode] = useState(false);

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

useEffect(() => {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    setDarkMode(true);
    document.body.setAttribute("data-theme", "dark");
  }
}, []);

useEffect(() => {
  const theme = localStorage.getItem("theme");
  const root = document.getElementById("root");
  if (theme === "dark") {
    document.body.setAttribute("data-theme", "dark");
    root.classList.add("dark-theme");
  } else {
    document.body.removeAttribute("data-theme");
    root.classList.remove("dark-theme");
  }
}, [darkMode]);

const toggleTheme = (checked) => {
  setDarkMode(checked);
  const theme = checked ? "dark" : "light";
  localStorage.setItem("theme", theme);
  document.body.setAttribute("data-theme", theme);
};


  const menuItems = [
    {
      type: "group",
      label: "Overview",
      children: [
        { label: "Dashboard", 
          key: "dashboard", 
          icon: <DashboardOutlined /> 
        },
        {
          label: "Calendar",
          key: "calendar",
          icon: <CalendarOutlined />,
          children: [
            {
              label: "Work Schedule",
              key: "schedule",
              icon: <ScheduleOutlined />,
            },
            {
              label: "Appointment",
              key: "appointment",
              icon: <SolutionOutlined />,
            },
            {
              label: "Messages",
              key: "messages",
              icon: <MessageOutlined />,
            },
          ],
        },
        {
          label: "Medical Report",
          key: "medical-report",
          icon: <FileTextOutlined />,
        },
        { 
          label: "Patients", 
          key: "patient", 
          icon: <IdcardOutlined /> 
        },
        { 
          label: "Statistics", 
          key: "statistics", 
          icon: <BarChartOutlined /> 
        },
      ],
    },
    {
      type: "group",
      label: "Preference",
      children: [
        { label: "Account",
          key: "account",
          icon: <UserOutlined />,
          children:[
            {
              label: "Information",
              key: "doctorinfo", 
              icon: <ProfileOutlined /> 
            },
            {
              label: "Change Password",
              key: "changepassword",
              icon: <KeyOutlined />,
            }
          ]
        },
        { 
          label: "Settings", 
          key: "settings", 
          icon: <SettingOutlined /> 
        },
        {
          label: "Log out",
          key: "logout",
          icon: <LogoutOutlined />,
          danger: true,
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
      <HeaderDashboard collapsed={collapsed} setCollapsed={setCollapsed} />
      <Layout>
        <Sider
          width={240}
           theme={darkMode ? "dark" : "light"}
          collapsible
          collapsed={collapsed}
          onCollapse={(value) => setCollapsed(value)}
          className="sidebar-menu"
        >
          <div className="sidebar-scroll-wrapper">
            <Menu
              mode="inline"
              selectedKeys={[location.pathname.split("/").pop()]}
              onClick={handleMenuClick}
              items={menuItems}
              style={{ paddingLeft: collapsed ? 0 : 12 }}
            />
            <div className="theme-toggle">
              <span style={{ marginRight: 8, fontSize: 18 }}>
                {darkMode ? <FaMoon /> : <FaSun />}
              </span>
              <Switch
                checked={darkMode}
                onChange={toggleTheme}
                checkedChildren={<FaMoon />}
                unCheckedChildren={<FaSun />}
              />
            </div>
          </div>
        </Sider>

        <Content style={{ padding: 24, background: "#fff" }}>
          <Routes>
            <Route path="dashboard" element={<DashboardOverview />} />
            <Route path="appointment" element={<Appointment />} />
            <Route path="patient" element={<PatientProfile />} />
            <Route path="schedule" element={<DoctorWorkSchedule />} />
            <Route path="doctorinfo" element={<DoctorUpdate />} />
            <Route path="changepassword" element={<ChangePasswordModal />} />
            <Route path="*" element={<Navigate to="dashboard" replace />} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
};

export default DoctorDashboard;
