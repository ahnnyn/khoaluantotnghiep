import axios from "utils/axios-customize"

const fetchAllVaiTro = async () => {
  const URL_BACKEND = `/api/vaitro.php?action=layDanhSachVaiTro`;
  return axios.get(URL_BACKEND);
};
const createVaiTro = async (tenVaiTro) => {
  return axios.post("/api/vaitro.php?action=themVaiTro", { tenVaiTro });
};

const updateVaiTro = async (maVaiTro, tenVaiTro) => {
  return axios.post("/api/vaitro.php?action=suaVaiTro", { maVaiTro, tenVaiTro });
};

const deleteVaiTro = async (maVaiTro) => {
  return axios.delete(`/api/vaitro.php?action=xoaVaiTro&maVaiTro=${ maVaiTro }`);
};

const fetchAllBenhNhan = async () => {
  const URL_BACKEND = `/api/benhnhan.php?action=getAllBenhNhan`;
  return axios.get(URL_BACKEND);
};
const fetchOneAccKH = (maBenhNhan) => {
  const URL_BACKEND = `/api/benhnhan.php?action=getThongTinBenhNhan&maBenhNhan=${maBenhNhan}`;
  return axios.get(URL_BACKEND);
};

const callUploadDoctorImg = (file) => {
  const bodyFormData = new FormData();
  bodyFormData.append("file", file);

  return axios.post(
    `${import.meta.env.VITE_BACKEND_URL}/api/upload.php`,
    bodyFormData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );
};


const createChuyenKhoa = (name, description, image) => {
  return axios.post("/api/doctor/create-chuyen-khoa", {
    name,
    description,
    image,
  });
};
const deleteChuyenKhoa = (_id) => {
  return axios.delete(`/api/doctor/delete-chuyen-khoa/${_id}`);
};
const updateChuyenKhoa = (_id, name, description, image) => {
  return axios.put("/api/doctor/update-chuyen-khoa", {
    _id,
    name,
    description,
    image,
  });
};


const fetchAllDepartment = async () => {
  const URL_BACKEND = `/api/admin/get-all-departments`;
  return axios.get(URL_BACKEND);
};
const fetchChuyenKhoaByID = (query) => {
  const URL_BACKEND = `/api/doctor/fetch-chuyen-khoa-by-id?id=${query}`;
  return axios.get(URL_BACKEND);
};

const fetchAllDoctor = async () => {
  const URL_BACKEND = `/api/bacsi.php?action=getAllDoctors`;
  return axios.get(URL_BACKEND);
};
const fetchAllDoctorByID = (maBacSi) => {
  const URL_BACKEND = `/api/bacsi.php?action=getBacSiByID&maBacSi=${maBacSi}`;
  return axios.get(URL_BACKEND);
};
const callCreateDoctor = (
  email,
  password,
  firstName,
  lastName,
  address,
  phoneNumber,
  chucVuId,
  gender,
  image,
  chuyenKhoaId,
  phongKhamId,
  mota,
  giaKhamVN,
  giaKhamNuocNgoai
) => {
  return axios.post("/api/doctor/create-doctor", {
    email,
    password,
    firstName,
    lastName,
    address,
    phoneNumber,
    chucVuId,
    gender,
    image,
    chuyenKhoaId,
    phongKhamId,
    mota,
    giaKhamVN,
    giaKhamNuocNgoai,
  });
};

const themBacSi = (
  hoTen,
  gioiTinh,
  ngaySinh,
  soDienThoai,
  email,
  diaChi,
  giaKham,
  hinhAnh,
  moTa,
  maKhoa,
  username,
  matKhau,
  maVaiTro
) => {
  const URL_BACKEND = "/api/bacsi.php?action=themBacSi";
  const data = {
    hoTen,
    gioiTinh,
    ngaySinh,
    soDienThoai,
    email,
    diaChi,
    giaKham,
    hinhAnh,
    moTa,
    maKhoa,
    username,
    matKhau,
    maVaiTro,
  };
  return axios.post(URL_BACKEND, data);
};
const updateDoctor = (
  maBacSi,
  hoTen,
  gioiTinh,
  soDienThoai,
  email,
  diaChi,
  giaKham,
  hinhAnh,
  moTa,
  maKhoa
) => {
axios.post("/api/bacsi.php?action=update-thongtin-bacsi", {
    maBacSi,
    hoTen,
    gioiTinh,
    soDienThoai,
    email,
    diaChi,
    giaKham,
    hinhAnh,
    moTa,
    maKhoa,
  });
};

const deleteBacSi = async (maBacSi) => {
  return axios.delete(`/api/bacsi.php?action=xoaBacSi&maBacSi=${maBacSi}`);
};


export {
  fetchAllVaiTro,
  createVaiTro,
  updateVaiTro,
  deleteVaiTro,
  fetchAllBenhNhan,
  fetchOneAccKH,
  callUploadDoctorImg,
  createChuyenKhoa,
  deleteChuyenKhoa,
  updateChuyenKhoa,
  fetchChuyenKhoaByID,
  fetchAllDoctor,
  fetchAllDoctorByID,
  callCreateDoctor,
  themBacSi,
  updateDoctor,
  deleteBacSi,
}