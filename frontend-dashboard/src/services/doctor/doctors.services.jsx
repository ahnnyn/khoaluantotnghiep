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

// ==================== PHIẾU KHÁM ====================

// Lấy danh sách phiếu khám theo bác sĩ
const fetchMedicalExaminationsByDoctor = (doctorId) => {
  return axios.get(
    `/api/doctor/view-examination-by-doctor/${doctorId}`,
    getAuthHeader()
  );
};

// Lấy danh sách phiếu khám theo bệnh nhân
const fetchMedicalExaminationsByPatient = (patientId) => {
  return axios.get(
    `/api/doctor/view-examination-by-patient/${patientId}`,
    getAuthHeader()
  );
};

// Lấy chi tiết phiếu khám theo ID
const fetchMedicalExaminationById = (id) => {
  return axios.get(`/api/doctor/view-examination/${id}`, getAuthHeader());
};

// Cập nhật trạng thái phiếu khám
const updateMedicalExaminationStatus = (id, status) => {
  return axios.put(
    "/api/doctor/update-examination-status",
    { id, status },
    getAuthHeader()
  );
};

const sendCancellationEmailToPatient = async ({
  email,
  hoTen,
  ngayKham,
  gioKham,
  hinhThucKham,
  tenBacSi,
  khoa,
  diaChi,
  soThuTu,
  lyDoHuy,
}) => {
  return axios.post(
    "/api/email/cancel-appointment",
    {
      email,
      hoTen,
      ngayKham,
      gioKham,
      hinhThucKham,
      tenBacSi,
      khoa,
      diaChi,
      soThuTu,
      lyDoHuy,
    },
    getAuthHeader()
  );
};

// Cập nhật kết quả khám bệnh
const updateMedicalExaminationResult = (id, result) => {
  return axios.put(
    `/api/doctor/update-examination-result`,
    { id, result },
    getAuthHeader()
  );
};

// ==================== LỊCH LÀM VIỆC ====================

// Lấy lịch làm việc của bác sĩ
const fetchWorkScheduleByDoctor = (doctorId) => {
  return axios.get(
    `/api/doctor/view-work-schedule/${doctorId}`,
    getAuthHeader()
  );
};

// Lấy lịch làm việc của bác sĩ theo ngày
const fetchWorkScheduleByDoctorAndDate = (doctorId, date) => {
  return axios.get(
    `/api/doctor/view-work-schedule/${doctorId}/${date}`,
    getAuthHeader()
  );
};

const fetchAllDepartments = () => {
  return axios.get(`/api/doctor/get-all-departments`, getAuthHeader());
};

const fetchAllPositons = () => {
  return axios.get(`/api/doctor/get-all-positions`, getAuthHeader());
};

const fetchAllTimeSlots = () => {
  return axios.get(`/api/doctor/get/time-slots`, getAuthHeader());
};

const createWorkSchedule = (data) => {
  return axios.post(`/api/doctor/create-work-schedule`, data, getAuthHeader());
};

const sendEmailSchedule = (data) => {
  return axios.post("/api/email/send-schedule", data, getAuthHeader());
};
// ==================== EXPORT ====================
export {
  fetchMedicalExaminationsByDoctor,
  fetchMedicalExaminationsByPatient,
  fetchMedicalExaminationById,
  sendCancellationEmailToPatient,
  updateMedicalExaminationStatus,
  updateMedicalExaminationResult,
  fetchWorkScheduleByDoctor,
  fetchWorkScheduleByDoctorAndDate,
  fetchAllDepartments,
  fetchAllPositons,
  fetchAllTimeSlots,
  createWorkSchedule,
  sendEmailSchedule,
  getAuthHeader,
};
