import axios from "utils/axios-customize";

// Hàm lấy token
const getAuthHeader = () => {
  const token = localStorage.getItem("access_token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// CHUYÊN KHOA //
const fetchAllDepartments = () => {
  return axios.get(`/api/public/get-all-departments`);
};

const fetchDepartmentByID = (id) => {
  return axios.get(`/api/public/get-department/${id}`);
};

// BÁC SĨ //
const fetchAllDoctor = async () => {
  return axios.get(`/api/public/get-all-doctors`);
};


const fetchDoctorByDepartment = (id) => {
  const URL_BACKEND = `/api/public/get-doctors-by-deptID/${id}`;
  return axios.get(URL_BACKEND);
};

const getWorkScheduleByDoctor = (id) => {
  const URL_BACKEND = `/api/public/get-work-schedule-by-doctorID/${id}`;
  return axios.get(URL_BACKEND);
};


const handleCreateAppointment = (payload) => {
  return axios.post("/api/patient/create-medical-examination", payload);
};

const createVnpayPaymentUrl = (maLichKham, amount, tenNguoiDung) => {
  return axios.post("/api/payment/create-url", {
    maLichKham,
    amount,
    tenNguoiDung,
  });
};


const handleCreatePayment = (data) => {
  return axios.post("/api/payment/create-payment", data, getAuthHeader());
};
// const getPaymentNotification = (data) => {
//   return axios.post(`/api/payment.php?action=notify`, data);
// };

const updatePaymentStatus = (id, status) => {
  return axios.put(`/api/patient/update-status-payment`, {id, status}, getAuthHeader());
};

const sendAppointmentConfirmationEmail = async (payload) => {
  return axios.post("/api/email/confirm-appointment", payload);
};


const handleCheckPaymentExist = (maLichKham) => {
  return axios.get(`/api/payment/check-payment-exist/${maLichKham}`, getAuthHeader());
};
const fetchPriceList = () => {
  return axios.get(`/api/public/get-price-list`);
};

const fetchAllArticles = () => {
  return axios.get(`/api/public/get-list-articles`);
};

export {
  fetchAllDoctor,
  fetchDoctorByDepartment,
  getWorkScheduleByDoctor,
  handleCreateAppointment,
  createVnpayPaymentUrl,
  fetchAllDepartments,
  fetchDepartmentByID,
  fetchPriceList,
  fetchAllArticles,
  handleCreatePayment,
  updatePaymentStatus,
  sendAppointmentConfirmationEmail,
  handleCheckPaymentExist,
};
