import "./UserInfor.css";
import { getUserById, fetchDoctorByID } from "services/chatbox/api.chat";
import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";

const Userinfor = () => {
  const [searchParams] = useSearchParams();
  const currentUserID = searchParams.get("currentUserID");
  const currentUserRole = searchParams.get("currentRole");

  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        let res;
        if (currentUserRole === "benhnhan") {
          res = await getUserById(currentUserID);
        } else if (currentUserRole === "bacsi") {
          res = await fetchDoctorByID(currentUserID);
        }

        if (res && res.data) {
          setUserData(res.data);
        }
      } catch (error) {
        console.error("Lỗi khi lấy thông tin người dùng:", error);
      }
    };

    if (currentUserID && currentUserRole) {
      fetchUserData();
    }
  }, [currentUserID, currentUserRole]);

  // Tạo đường dẫn hình ảnh dựa trên vai trò
  const getAvatarUrl = () => {
    if (userData?.hinhAnh) {
      const folder = currentUserRole === "benhnhan" ? "benhnhan" : "bacsi";
      return `${import.meta.env.VITE_BACKEND_URL}/public/${folder}/${
        userData.hinhAnh
      }`;
    }
    return "/assets/images/chat-icon/avatar.png"; // fallback nếu không có hình ảnh
  };

  return (
    <div className="userInfo">
      <div className="user">
        <img src={getAvatarUrl()} alt="avatar" className="avatar" />
        <h5>{userData?.hoTen || "Người dùng"}</h5>
      </div>
      <div className="icons">
        <img src="/assets/images/chat-icon/more.png" alt="more" />
        <img src="/assets/images/chat-icon/video.png" alt="video" />
        <img src="/assets/images/chat-icon/edit.png" alt="edit" />
      </div>
    </div>
  );
};

export default Userinfor;
