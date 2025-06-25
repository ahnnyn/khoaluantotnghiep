import { useState, useEffect } from "react";
import { message } from "antd";
import { logoutUser, getUserById } from "services/user/user.auth.services";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import { doLogoutAction } from "@redux/account/accountSlice";

import QuanLyLichHen from "components/BacSi/LichHen/QuanLyLichHen";
import ChangePasswordModal from "components/BacSi/ChangePasswordModal/ChangePasswordModal";
import HoSoBenhNhan from "components/BacSi/HoSoBenhNhan/HoSoBenhNhan";
import DoctorUpdate from "components/BacSi/DoctorInformation/DoctorUpdate";
import DoctorWorkSchedule from "components/BacSi/QuanLyLichLamViec/QuanLyLichLamViec";

import "./home.css";

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Lấy user & trạng thái đăng nhập từ store
  const user = useSelector((state) => state.account?.user);
  const isUserAuthenticated = useSelector(
    (state) => state.account?.isUserAuthenticated
  );

  const [dataUpdateDoctor, setDataUpdateDoctor] = useState(null);

  // Fetch thông tin bác sĩ bổ sung
  useEffect(() => {
    const fetchUserById = async () => {
      try {
        if (user?._id) {
          const res = await getUserById(user._id);
          if (res && res.data) {
            setDataUpdateDoctor(res.data);
          }
        }
      } catch (error) {
        message.error(error.message || "Lỗi lấy thông tin bác sĩ!");
      }
    };
    fetchUserById();
  }, [user?._id]);

  const handleLogoutClick = async () => {
    try {
      const res = await logoutUser();
      if (res) {
        dispatch(doLogoutAction());
        message.success(res.message || "Đăng xuất thành công!");
        navigate("/login");
      }
    } catch (error) {
      message.error(error.message || "Lỗi khi đăng xuất!");
    }
  };

  if (!isUserAuthenticated) return <Navigate to="/login" replace />;

  return (
    <div className="container-fluid">
      <div className="container-2">
        <div
          className="row full-height-layout"
          style={{ borderRadius: "10px", margin: 0 }}
        >
          {/* Sidebar */}
          <div className="col-lg-2 sidebar-left">
            <div className="user-info">
              <img
                src={
                  dataUpdateDoctor?.avatar
                    ? `${import.meta.env.VITE_BACKEND_URL}/public/images/upload/${
                        dataUpdateDoctor.avatar
                      }`
                    : "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                }
                alt="avatar bác sĩ"
                className="avatar"
              />
              <div className="user-name">{user?.fullName}</div>
              <div className="user-role">Chào mừng bạn trở lại!</div>
            </div>

            <div
              className="sidebar-menu nav flex-column nav-pills"
              id="v-pills-tab"
              role="tablist"
              aria-orientation="vertical"
            >
              <button
                className="nav-link active"
                data-bs-toggle="pill"
                data-bs-target="#lichHen"
                type="button"
              >
                <i className="fa-regular fa-calendar-check"></i> Lịch khám của
                tôi
              </button>
              <button
                className="nav-link"
                data-bs-toggle="pill"
                data-bs-target="#benhNhan"
                type="button"
              >
                <i className="fa-solid fa-user-doctor"></i> Hồ sơ bệnh nhân
              </button>

              <button
                className="nav-link"
                data-bs-toggle="pill"
                data-bs-target="#lichLamViec"
                type="button"
              >
                <i className="fa-regular fa-calendar"></i> Lịch làm việc
              </button>

              <button
                className="nav-link"
                data-bs-toggle="pill"
                data-bs-target="#doctorinfo"
                type="button"
              >
                <i className="fa-regular fa-address-card"></i> Thông tin của tôi
              </button>

              <button
                className="nav-link"
                data-bs-toggle="pill"
                data-bs-target="#doiMK"
                type="button"
              >
                <i className="fa-light fa-key"></i> Đổi mật khẩu
              </button>



              <button
                className="nav-link"
                onClick={handleLogoutClick}
                type="button"
              >
                <i className="fa-light fa-right-from-bracket"></i> Đăng xuất
              </button>
            </div>
          </div>

          {/* Nội dung */}
          <div className="col-lg-10 content-area">
            <div className="tab-content" id="v-pills-tabContent">
              <div
                className="tab-pane fade show active"
                id="lichHen"
                style={{ padding: "0 0 20px", textAlign: "center" }}
              >
                <span
                  className="title text-center mb-4"
                  style={{
                    marginBottom: "30px",
                    fontWeight: "550",
                    color: "navy",
                  }}
                >
                  LỊCH HẸN CỦA BÁC SĨ{" "}
                  <span style={{ color: "blue" }}>
                    {user?.fullName?.toUpperCase()}
                  </span>
                </span>
                <div style={{ marginTop: "30px" }}>
                  <QuanLyLichHen />
                </div>
              </div>

              <div
                className="tab-pane fade"
                id="benhNhan"
                style={{ padding: "0 0 20px", textAlign: "center" }}
              >
                <span
                  className="title text-center mb-4"
                  style={{
                    marginBottom: "30px",
                    fontWeight: "550",
                    color: "navy",
                  }}
                >
                  HỒ SƠ BỆNH NHÂN
                </span>
                <div style={{ marginTop: "30px" }}>
                  <HoSoBenhNhan />
                </div>
              </div>

              <div className="tab-pane fade" id="doiMK">
                <ChangePasswordModal />
              </div>
            <div className="tab-pane fade" id="doctorinfo">
                <DoctorUpdate />
            </div>
              <div className="tab-pane fade" id="lichLamViec">
                <DoctorWorkSchedule />
              </div>

              {/* Các tab khác (phieuKham, lichLamViec, ...) có thể thêm vào sau */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
