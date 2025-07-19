import axios from "utils/axios-customize"

const getAuthHeader = () => {
  const token = localStorage.getItem("access_token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};
// Đăng nhập
const loginUser = (username, password) => {
  const URL = "/api/user/auth/login";
  return axios.post(URL, { username, password });
};

// Đăng xuất
const logoutUser = () => {
  const token = localStorage.getItem("access_token");
  return axios.post(
    "/api/user/auth/logout",
    {},
    {
       headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    }
  );
};

// Đổi mật khẩu (Cập nhật tài khoản)
const changeUserPassword = (id, oldPassword, newPassword, newUsername) => {
  return axios.put("/api/user/update-account", {
    id,
    oldPassword,
    newPassword,
    newUsername,
  });
};

// Quên mật khẩu (nếu có)
const forgotPassword = (email) => {
  return axios.post("/api/user/auth/forgot-password", { email });
};

// Lấy thông tin user theo ID
const getUserById = (id) => {
  return axios.get(`/api/user/view-user/${id}`);
};

// Cập nhật thông tin user
const updateUserInfo = ({
  id,
  fullName,
  gender,
  dateOfBirth,
  phone,
  email,
  address,
  avatar,
  price,
  positionId,
  departmentId,
}) => {
  return axios.put("/api/user/update-user", {
    id,
    fullName,
    gender, // nên đảm bảo trước khi truyền là boolean thật
    dateOfBirth,
    phone,
    email,
    address,
    avatar,
    price,
    positionId,
    departmentId,
  });
};

const getAllCoordinators = () => {
  return axios.get("/api/user/info-coordinators", getAuthHeader());
};

// Upload ảnh bác sĩ
const uploadFile = (file) => {
  const formData = new FormData();
  formData.append("image", file); 

  return axios.post("/api/upload-file/single", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${localStorage.getItem("access_token")}`, 
    },
  });
};

const fectchListUser = () => {
  return axios.get("/api/user/user-list");
}

export {
  loginUser,
  logoutUser,
  changeUserPassword,
  forgotPassword,
  getUserById,
  updateUserInfo,
  uploadFile,
  getAllCoordinators,
  fectchListUser
};

