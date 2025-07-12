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

const findBacSiByName = (query) => {
    const URL_BACKEND = `/api/bacsi.php?action=search&${query}`;
    return axios.get(URL_BACKEND);
  };

const fetchDoctorByDepartment= (id) => {
    const URL_BACKEND = `/api/public/get-doctors-by-deptID/${id}`;
    return axios.get(URL_BACKEND)
}
    
const fetchDoctorByID = (maBacSi) => {
    console.log("Đang gọi API với maBacSi: ", maBacSi); // 👈 debug ở đây
    const URL_BACKEND = `/api/bacsi.php?action=getBacSiByID&maBacSi=${maBacSi}`;
    return axios.get(URL_BACKEND);
};


const getWorkScheduleByDoctor = (id) => {
    const URL_BACKEND = `/api/public/get-work-schedule-by-doctorID/${id}`;
    return axios.get(URL_BACKEND);
}

const getTimeSlotsByDoctorAndDate = async (maBacSi, ngayLamViec) => {
    const URL_BACKEND = `/api/lichlamviec.php?action=getLichLamViecTheoNgay&maBacSi=${maBacSi}&ngayLamViec=${ngayLamViec}`;
  
    try {
      const response = await axios.get(URL_BACKEND);
  
      console.log("Dữ liệu lịch làm việc từ API:", response);
  
      return response; // Trả về response.data thay vì response
    } catch (error) {
      console.error(
        "Lỗi khi gọi lịch làm việc API:",
        error.response ? error.response : error.message
      );
      return [];
    }
  };


// fetch time
const fetchAllTime = () => {
    const URL_BACKEND = `/api/bacsi.php`;
    return axios.get(URL_BACKEND)
}
const fetchAllTime2 = (doctorId, date) => {
    const URL_BACKEND = `/api/bacsi.php`;
    return axios.get(URL_BACKEND);
}

// them thoi gian kham benh
const addTimeKhamBenh = (date, time, _id) => {
    return axios.post('/api/bacsi.php', {
        date, time, _id
    })
}
// xoa lich cu
const xoaLichCu = (_id) => {
    return axios.post('/api/bacsi.php', { _id: _id })
}

// thêm bệnh nhân
const createBenhNhan = (email, password, firstName, lastName, phone, image, address) => {
    return axios.post('/api/bacsi.php', {
        email, password, firstName, lastName, phone, image, address
    })
}
const updateBenhNhan = (_id, email, password, firstName, lastName, phone, image, address) => {
    return axios.put('/api/bacsi.php', {
        _id, email, password, firstName, lastName, phone, image, address
    })
}

// Đặt lịch khám thông thường
const datLichKhamBenh = (
    maBenhNhan, maBacSi, khungGioKham, tenBenhNhan,email, soDienThoai, giaKham, gioKham, ngayKhamBenh, lyDoKham, hinhThucThanhToan, hinhThucKham
) => {
    return axios.post('/api/lichkham.php?action=dat-lich-kham-moi', {
        maBenhNhan,
        maBacSi,
        khungGioKham,
        tenBenhNhan,
        email,
        soDienThoai,
        giaKham,
        gioKham,
        ngayKhamBenh,
        lyDoKham,
        hinhThucThanhToan,
        hinhThucKham
    })
}

const datLichKhamBenhVnPay = (maBenhNhan, maBacSi, khungGioKham, tenBenhNhan, email, soDienThoai, giaKham, gioKham, ngayKhamBenh, lyDoKham, hinhThucThanhToan, hinhThucKham
) => {
    return axios.post('/api/lichkham.php?action=dat-lich-kham-moi', {
        maBenhNhan,
        maBacSi,
        khungGioKham,
        tenBenhNhan,
        email,
        soDienThoai,
        giaKham,
        gioKham,
        ngayKhamBenh,
        lyDoKham,
        hinhThucThanhToan,
        hinhThucKham
    })
};

const taoVnPayUrl = (maLichKham, amount, tenBenhNhan) => {
    const URL_BACKEND = `/api/thanhtoan.php?action=thanh-toan&maLichKham=${maLichKham}&amount=${amount}&tenBenhNhan=${tenBenhNhan}`    
    return axios.get(URL_BACKEND)
}

const getThongBaoThanhToan = (data) => {
  const URL_BACKEND = `/api/thanhtoan.php?action=thong-tin-thanh-toan`;
  return axios.post(URL_BACKEND, data); // truyền data để lưu
};

const capNhatTrangThaiThanhToanLichKham = (data) => {
  const URL_BACKEND = `/api/lichkham.php?action=cap-nhat-thanh-toan`;
  return axios.post(URL_BACKEND, data); // truyền mã lịch khám
};


// get lich kham
const fetchLichKham = (maBenhNhan) => {
    const URL_BACKEND = `/api/lichhen.php?action=lich-hen&maBenhNhan=${maBenhNhan}`;
    return axios.get(URL_BACKEND);
};


const handleHuyOrder = (query) => {
    const URL_BACKEND = `/api/bacsi.php?idHuy=${query}`
    return axios.post(URL_BACKEND)
}

const findAllLichHen = (query) => {
    const URL_BACKEND = `/api/bacsi.php?${query}`
    return axios.get(URL_BACKEND)
}

const handleCreateCauHoi = (email, firstName, lastName, chuyenKhoaId, cauHoi) => {
    const URL_BACKEND = `/api/bacsi.php`
    const data = {
        email, firstName, lastName, chuyenKhoaId, cauHoi
    }
    return axios.post(URL_BACKEND, data)
}

const getAllCauHoi = (query) => {
    const URL_BACKEND = `/api/bacsi.php?${query}`
    return axios.get(URL_BACKEND)
}

const handleQuenPassword = (email_doimk) => {
    const URL_BACKEND = '/api/benhnhan.php?action=quenMatKhau'
    return axios.post(URL_BACKEND, { email_doimk })
}

const handleThongKe = (trangThaiKham, _idDoctor) => {
    const URL_BACKEND = `/api/bacsi.php`
    let data = {
        trangThaiKham, _idDoctor
    }
    return axios.post(URL_BACKEND, data)
}
const fetchHoSoBenhNhan = (maBenhNhan) => {
    const URL_BACKEND = `/api/hosobenhnhan.php?action=getHoSoBenhNhan&maBenhNhan=${maBenhNhan}`;
    return axios.get(URL_BACKEND);
};

const taoHoSoBenhNhan = (maBenhNhan, hoTenBenhNhan, ngaySinh, gioiTinh, ngheNghiep, CCCD, diaChi) => {
    const URL_BACKEND = `/api/hosobenhnhan.php?action=taoHoSo`
    const data = {
        maBenhNhan, hoTenBenhNhan, ngaySinh, gioiTinh, ngheNghiep, CCCD, diaChi
    }
    return axios.post(URL_BACKEND, data);
};
const updateHoSoBenhNhan = (maBenhNhan, hoTenBenhNhan, ngaySinh, gioiTinh, ngheNghiep, CCCD, diaChi) => {
    const URL_BACKEND = `/api/hosobenhnhan.php?action=updateHoSo`
    const data = {
        maBenhNhan, hoTenBenhNhan, ngaySinh, gioiTinh, ngheNghiep, CCCD, diaChi
    }
    return axios.post(URL_BACKEND, data);
};
const deleteHoSoBenhNhan = (maBenhNhan) => {
    return axios.delete(`/api/hosobenhnhan.php?action=xoaHoSo&maBenhNhan=${maBenhNhan}`);
};


const fetchAllPhieuKhamBenh = (maHoSo) => {
    const URL_BACKEND = `/api/phieukhambenh.php?action=lay-phieu-kham-benh&maHoSo=${maHoSo}`;
    return axios.get(URL_BACKEND);
};

const updateLichHen = (maLich, maBacSi, maKhungGio, ngayKham, lyDoKham, hinhThucKham) => {
  const URL_BACKEND = `/api/lichhen.php?action=updateLichHen`;
  const data = {
    maLich,
    maBacSi,
    maKhungGio,
    ngayKham,
    lyDoKham,
    hinhThucKham,
  };

  return axios.post(URL_BACKEND, data, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

const deleteLichHen = (maLich) => {
    return axios.delete(`/api/lichhen.php?action=xoaLichHen&maLich=${maLich}`);
};

const fetchKhungGioBacSiByNgay = (maBacSi, ngayLamViec) => {
  const URL_BACKEND = `/api/lichlamviec.php?action=getLichLamViecTheoNgay`;
  return axios.get(URL_BACKEND, {
    params: { maBacSi, ngayLamViec }
  });
};
const getKhungGioByNgay = (maBacSi, hinhThucKham, ngayLamViec, maLichDangSua = null) => {
  const URL_BACKEND = `/api/khunggio.php?action=getKhungGioByNgay`;
  const params = { maBacSi, hinhThucKham, ngayLamViec };

  if (maLichDangSua) {
    params.maLichDangSua = maLichDangSua;
  }

  return axios.get(URL_BACKEND, { params });
};


const fetchNgayLamViecByBacSi = (maBacSi, hinhThucKham) => {
  const URL_BACKEND = `/api/lichlamviec.php?action=getNgayLamViecByBacSi`;
  return axios.get(URL_BACKEND, {
    params: {maBacSi, hinhThucKham }
  });
};

export {
    fetchAllDoctor,
    findBacSiByName,
    fetchDoctorByDepartment,
    fetchDoctorByID,
    getWorkScheduleByDoctor,
    fetchAllTime,
    fetchAllTime2,
    addTimeKhamBenh,
    xoaLichCu,
    createBenhNhan,
    updateBenhNhan,
    datLichKhamBenh,
    datLichKhamBenhVnPay,
    taoVnPayUrl,
    getThongBaoThanhToan,
    capNhatTrangThaiThanhToanLichKham,
    fetchLichKham,
    handleHuyOrder,
    findAllLichHen,
    handleCreateCauHoi,
    getAllCauHoi,
    handleQuenPassword,
    handleThongKe,
    fetchHoSoBenhNhan,
    taoHoSoBenhNhan,
    updateHoSoBenhNhan,
    deleteHoSoBenhNhan,
    fetchAllPhieuKhamBenh,
    updateLichHen,
    deleteLichHen,
    fetchKhungGioBacSiByNgay,
    getKhungGioByNgay,
    fetchNgayLamViecByBacSi,
    fetchAllDepartments,
    fetchDepartmentByID,
    getTimeSlotsByDoctorAndDate
};