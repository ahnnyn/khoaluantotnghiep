import React from "react";
import { Modal, Descriptions, Tag } from "antd";
import moment from "moment";

const ModalXemChiTietLichHen = ({ open, onCancel, data }) => {
  return (
    <Modal title="Chi tiết lịch hẹn" visible={open} onCancel={onCancel} footer={null}>
      <Descriptions column={1} bordered>
        <Descriptions.Item label="Họ tên bệnh nhân">{data?.hoTen}</Descriptions.Item>
        <Descriptions.Item label="Số điện thoại">{data?.soDienThoai}</Descriptions.Item>
        <Descriptions.Item label="Địa chỉ">{data?.diaChi}</Descriptions.Item>
        <Descriptions.Item label="Bác sĩ khám">{data?.tenBacSi || "Chưa rõ"}</Descriptions.Item>
        <Descriptions.Item label="Chuyên khoa">{data?.tenKhoa || "Chưa rõ"}</Descriptions.Item>
        <Descriptions.Item label="Lý do khám">{data?.lyDoKham || "Không ghi"}</Descriptions.Item>
        <Descriptions.Item label="Ngày khám">{moment(data?.ngayKham).format("DD/MM/YYYY")}</Descriptions.Item>
        <Descriptions.Item label="Giờ khám">{data?.khungGio}</Descriptions.Item>
        <Descriptions.Item label="Giá khám">{data?.giaKham}</Descriptions.Item>
      </Descriptions>
    </Modal>
  );
};

export default ModalXemChiTietLichHen;
