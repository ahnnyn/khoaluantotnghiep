import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Select, message, Button } from "antd";
import moment from "moment";
import {
  fetchAllDepartments,
  fetchBacSiByChuyenKhoa,
  fetchNgayLamViecByBacSi,
  getKhungGioByNgay,
  updateLichHen,
} from "services/patient/patient.services";

const ModalCapNhatLichHen = ({ open, onCancel, data, onReload }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [danhSachChuyenKhoa, setDanhSachChuyenKhoa] = useState([]);
  const [danhSachBacSi, setDanhSachBacSi] = useState([]);
  const [danhSachNgayKham, setDanhSachNgayKham] = useState([]);
  const [danhSachKhungGio, setDanhSachKhungGio] = useState([]);

  // Tải danh sách chuyên khoa khi mở modal
useEffect(() => {
  if (open) {
    fetchDanhSachChuyenKhoa();
  }
}, [open]);

useEffect(() => {
  console.log("DATA TRUYỀN VÀO MODAL:", data);
}, [data]);

useEffect(() => {
  if (data && danhSachChuyenKhoa.length > 0) {
    const { maBacSi, lyDoKham, ngayKham, maKhungGio, hinhThucKham, maKhoa } = data;

    form.setFieldsValue({
      maKhoa,
      maBacSi,
      lyDoKham,
      hinhThucKham,
      ngayKham: moment(ngayKham).format("YYYY-MM-DD"),
      maKhungGio,
    });

    console.log("maKhoa", maKhoa);

    fetchDanhSachBacSi(maKhoa);

    if (maBacSi && hinhThucKham) {
      fetchNgayKham(maBacSi, hinhThucKham, ngayKham);
    }

    if (maBacSi && ngayKham && hinhThucKham) {
      fetchKhungGio(maBacSi, hinhThucKham, ngayKham, true);
    }
  }
}, [data, danhSachChuyenKhoa]);


  const fetchDanhSachChuyenKhoa = async () => {
    try {
      const res = await fetchAllDepartments();
      if (Array.isArray(res.data)) {
        setDanhSachChuyenKhoa(res.data);
      }
    } catch {
      message.error("Không thể tải danh sách chuyên khoa");
    }
  };

const fetchDanhSachBacSi = async (maKhoa) => {
  try {
    const res = await fetchBacSiByChuyenKhoa(maKhoa);
    // Lấy đúng mảng bác sĩ từ res.bacSiList
    setDanhSachBacSi(Array.isArray(res.bacSiList) ? res.bacSiList : []);
  } catch {
    message.error("Không thể tải danh sách bác sĩ");
  }
};


  const fetchNgayKham = async (maBacSi, hinhThucKham, ngayKhamDaChon = null) => {
    try {
      const res = await fetchNgayLamViecByBacSi(maBacSi, hinhThucKham);
      if (!Array.isArray(res)) throw new Error();

      const ngayHienTai = moment().startOf("day");
      let ngayHopLe = res.filter((ngay) =>
        moment(ngay, "YYYY-MM-DD").isSameOrAfter(ngayHienTai)
      );

      if (ngayKhamDaChon && !ngayHopLe.includes(ngayKhamDaChon)) {
        ngayHopLe = [ngayKhamDaChon, ...ngayHopLe];
      }

      setDanhSachNgayKham(ngayHopLe);

      if (!ngayHopLe.includes(ngayKhamDaChon)) {
        form.setFieldsValue({ ngayKham: undefined, maKhungGio: undefined });
        setDanhSachKhungGio([]);
      }
    } catch {
      setDanhSachNgayKham([]);
      setDanhSachKhungGio([]);
      message.error("Không thể tải ngày khám");
    }
  };

  const fetchKhungGio = async (maBacSi, hinhThucKham, ngay, isInitialLoad = false) => {
    try {
      const res = await getKhungGioByNgay(maBacSi, hinhThucKham, ngay, data?.maLich);
      setDanhSachKhungGio(Array.isArray(res) ? res : []);
      if (!isInitialLoad) {
        form.setFieldsValue({ maKhungGio: undefined });
      }
    } catch {
      setDanhSachKhungGio([]);
      message.error("Không thể tải khung giờ");
    }
  };

  const handleChuyenKhoaChange = (maKhoa) => {
    form.setFieldsValue({ maBacSi: undefined, ngayKham: undefined, maKhungGio: undefined });
    setDanhSachBacSi([]);
    setDanhSachNgayKham([]);
    setDanhSachKhungGio([]);
    fetchDanhSachBacSi(maKhoa);
  };

  const handleBacSiChange = (maBacSi) => {
    const hinhThucKham = form.getFieldValue("hinhThucKham");
    if (maBacSi && hinhThucKham) {
      fetchNgayKham(maBacSi, hinhThucKham);
      form.setFieldsValue({ ngayKham: undefined, maKhungGio: undefined });
      setDanhSachKhungGio([]);
    }
  };

  const handleHinhThucKhamChange = (hinhThucKham) => {
    const maBacSi = form.getFieldValue("maBacSi");
    if (maBacSi && hinhThucKham) {
      fetchNgayKham(maBacSi, hinhThucKham);
      form.setFieldsValue({ ngayKham: undefined, maKhungGio: undefined });
      setDanhSachKhungGio([]);
    }
  };

  const handleNgayChange = (ngay) => {
    const maBacSi = form.getFieldValue("maBacSi");
    const hinhThucKham = form.getFieldValue("hinhThucKham");
    if (maBacSi && hinhThucKham && ngay) {
      fetchKhungGio(maBacSi, hinhThucKham, ngay);
    } else {
      form.setFieldsValue({ maKhungGio: undefined });
      setDanhSachKhungGio([]);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setDanhSachNgayKham([]);
    setDanhSachKhungGio([]);
    setDanhSachBacSi([]);
    onCancel();
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const payload = {
        maLich: data.maLich,
        maBacSi: values.maBacSi,
        maKhungGio: values.maKhungGio,
        ngayKham: values.ngayKham,
        lyDoKham: values.lyDoKham,
        hinhThucKham: values.hinhThucKham,
      };

      setLoading(true);
      await updateLichHen(
        payload.maLich,
        payload.maBacSi,
        payload.maKhungGio,
        payload.ngayKham,
        payload.lyDoKham,
        payload.hinhThucKham
      );
      message.success("Cập nhật thành công!");
      handleCancel();
      onReload();
    } catch {
      message.error("Cập nhật thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Cập nhật lịch hẹn"
      open={open}
      onCancel={handleCancel}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          Hủy
        </Button>,
        <Button key="submit" type="primary" loading={loading} onClick={handleOk}>
          Cập nhật
        </Button>,
      ]}
    >
      <Form layout="vertical" form={form}>
        <Form.Item
          label="Chuyên khoa"
          name="maKhoa"
          rules={[{ required: true, message: "Vui lòng chọn chuyên khoa" }]}
        >
          <Select placeholder="Chọn chuyên khoa" onChange={handleChuyenKhoaChange}>
            {danhSachChuyenKhoa.map((ck) => (
              <Select.Option key={ck.maKhoa} value={ck.maKhoa}>
                {ck.tenKhoa}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Bác sĩ"
          name="maBacSi"
          rules={[{ required: true, message: "Vui lòng chọn bác sĩ" }]}
        >
          <Select placeholder="Chọn bác sĩ" onChange={handleBacSiChange}>
            {danhSachBacSi.map((bs) => (
              <Select.Option key={bs.maBacSi} value={bs.maBacSi}>
                {bs.hoTen}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Hình thức khám"
          name="hinhThucKham"
          rules={[{ required: true, message: "Vui lòng chọn hình thức khám" }]}
        >
          <Select placeholder="Chọn hình thức khám" onChange={handleHinhThucKhamChange}>
            <Select.Option value="Trực tuyến">Trực tuyến</Select.Option>
            <Select.Option value="Chuyên khoa">Chuyên khoa</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Ngày khám"
          name="ngayKham"
          rules={[{ required: true, message: "Vui lòng chọn ngày khám" }]}
        >
          <Select placeholder="Chọn ngày khám" onChange={handleNgayChange}>
            {danhSachNgayKham.map((ngay) => (
              <Select.Option key={ngay} value={ngay}>
                {moment(ngay).format("DD/MM/YYYY")}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Khung giờ"
          name="maKhungGio"
          rules={[{ required: true, message: "Vui lòng chọn khung giờ" }]}
        >
          <Select placeholder="Chọn khung giờ">
            {danhSachKhungGio.map((kg) => (
              <Select.Option key={kg.maKhungGio} value={kg.maKhungGio}>
                {kg.khungGio}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Lý do khám"
          name="lyDoKham"
          rules={[{ required: true, message: "Vui lòng nhập lý do khám" }]}
        >
          <Input.TextArea rows={3} placeholder="Nhập lý do khám" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ModalCapNhatLichHen;
