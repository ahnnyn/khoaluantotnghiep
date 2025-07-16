import React, { useEffect, useState } from "react";
import {
  Row,
  Col,
  Select,
  Tag,
  Tooltip,
  Spin,
  notification,
  Empty,
  Modal,
} from "antd";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { ExclamationCircleOutlined } from "@ant-design/icons";

import { BsCameraVideoFill } from "react-icons/bs";
import { IoChatbubbleEllipsesSharp } from "react-icons/io5";

import { FaEye } from "react-icons/fa";
import { IoHomeSharp } from "react-icons/io5";
import Header from "components/Header/Header";
import Footer from "components/Footer/Footer";
import { RiEdit2Fill, RiDeleteBin5Line } from "react-icons/ri";
import {
  createVnpayPaymentUrl,
} from "services/patient/patient.services";

import ModalXemChiTietLichHen from "./ModalXemChiTietLichHen";
// import ModalCapNhatLichHen from "./ModalCapNhatLichHen";

const LichHenCard = () => {
  const navigate = useNavigate();

  const [dataOrder, setDataOrder] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openViewDH, setOpenViewDH] = useState(false);
  const [dataViewDH, setDataViewDH] = useState(null);
  const [editingRecord, setEditingRecord] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const acc = useSelector((state) => state.account.user);

  const fetchOrders = async () => {
    if (!acc?.user?.maBenhNhan) return;
    setLoading(true);
    try {
      const res = await fetchLichKham(acc.user.maBenhNhan);
      console.log(res); // Log dữ liệu trả về từ API

      if (res && Array.isArray(res)) {
        // Sắp xếp: Hủy xuống cuối, mới nhất lên đầu
        const sorted = res.sort((a, b) => {
          if (a.trangThai === "Đã hủy" && b.trangThai !== "Đã hủy") return 1;
          if (a.trangThai !== "Đã hủy" && b.trangThai === "Đã hủy") return -1;
          // Nếu cùng trạng thái thì so sánh ngày (mới -> cũ)
          return new Date(b.ngayKham) - new Date(a.ngayKham);
        });

        setDataOrder(sorted);
      }
    } catch (error) {
      notification.error({
        message: "Lỗi tải dữ liệu",
        description: "Không thể tải lịch khám từ hệ thống.",
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, [acc?.user?.maBenhNhan]);

  const handleEditClick = (record) => {
    setEditingRecord(record);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (record) => {
    Modal.confirm({
      title: "Hủy lịch hẹn",
      icon: <ExclamationCircleOutlined />,
      content: "Bạn có chắc chắn muốn hủy lịch hẹn này không?",
      okText: "Có",
      okType: "danger",
      cancelText: "Không",
      onOk: async () => {
        try {
          const res = await deleteLichHen(record.maLich);
          console.log(res); // Log dữ liệu trả về từ API
          if (res?.success) {
            notification.success({
              message: res.message || "Hủy lịch hẹn thành công",
            });
            fetchOrders(); // Reload danh sách
          } else {
            notification.error({
              message: "Hủy lịch hẹn thất bại",
              description: res.message || "Không thể hủy lịch hẹn này.",
            });
          }
        } catch (error) {
          notification.error({
            message: "Lỗi hủy lịch hẹn",
            description: "Không thể hủy lịch hẹn này.",
          });
        }
      },
    });
  };

  const handlePayment = async (record) => {
    try {
      const res = await createVnpayPaymentUrl(
        record.maLich,
        record.giaKham,
        record.hoTen
      );

      if (res?.status && res.payment_url) {
        window.location.href = res.payment_url; // Chuyển sang trang VNPAY
      } else {
        notification.error({
          message: "Lỗi tạo thanh toán",
          description: res?.message || "Không thể tạo link thanh toán VNPAY.",
        });
      }
    } catch (error) {
      console.error("Lỗi gọi API VNPAY:", error);
      notification.error({
        message: "Lỗi kết nối VNPAY",
        description: "Không thể kết nối đến máy chủ. Vui lòng thử lại.",
      });
    }
  };

  const getTrangThaiColor = (status) => {
    switch (status) {
      case "Chờ khám":
        return "processing";
      case "Đã khám":
        return "green";
      case "Đã hủy":
        return "red";
      default:
        return "default";
    }
  };

  const getTrangThaiThanhToanColor = (status) => {
    switch (status) {
      case "Chưa thanh toán":
        return "orange";
      case "Đã thanh toán":
        return "green";
      default:
        return "default";
    }
  };

  return (
    <>
      <Header />
      <Row style={{ marginBottom: "150px" }}></Row>

      <div className="container">
        <p className="txt-title">
          <IoHomeSharp /> / Lịch hẹn
        </p>

        <h2 style={{ marginBottom: 24 }}>Lịch hẹn đã đặt</h2>

        <Spin spinning={loading}>
          <Row gutter={[16, 16]}>
            {dataOrder.map((item, index) => (
              <Col span={24} key={item.maLich || index}>
                <div
                  style={{
                    border: "1px solid #e8e8e8",
                    borderRadius: 8,
                    padding: 16,
                    backgroundColor: "#fff",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "stretch",
                    gap: 16,
                  }}
                >
                  {/* Left: Date & Time */}
                  <div
                    style={{
                      minWidth: 160,
                      textAlign: "center",
                      padding: 16,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                    }}
                  >
                    <b style={{ fontSize: 16, fontWeight: "bold" }}>
                      Thời gian khám
                    </b>
                    <h3 style={{ fontSize: 15, color: "#1890ff" }}>
                      {item.ngayKham}
                    </h3>
                    <p
                      style={{
                        fontSize: 15,
                        fontWeight: "bold",
                        color: "#1890ff",
                      }}
                    >
                      {item.khungGio}
                    </p>
                  </div>

                  {/* Right: Details */}
                  <div
                    style={{ flex: 1, paddingRight: 150, position: "relative" }}
                  >
                    <Row gutter={[16, 8]}>
                      <Col span={12}>
                        <b>Bệnh nhân:</b> {item.hoTen}
                      </Col>
                      <Col span={12}>
                        <b>Bác sĩ:</b> {item.tenBacSi || "Chưa rõ"}
                      </Col>
                      <Col span={12}>
                        <b>Chuyên khoa:</b> {item.tenKhoa || "Chưa rõ"}
                      </Col>
                      <Col span={12}>
                        <b>Lý do khám:</b> {item.lyDoKham || "Không ghi"}
                      </Col>
                      <Col span={12}>
                        <b>Trạng thái khám:</b>{" "}
                        <Tag color={getTrangThaiColor(item.trangThai)}>
                          {item.trangThai}
                        </Tag>
                      </Col>
                      <Col span={12}>
                        <b>Phương thức thanh toán:</b>{" "}
                        {item.phuongthucthanhtoan || "Chưa rõ"}
                      </Col>
                      <Col
                        span={12}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                        }}
                      >
                        <div>
                          <b>Trạng thái thanh toán:</b>{" "}
                          <Tag
                            color={getTrangThaiThanhToanColor(
                              item.trangThaiThanhToan
                            )}
                          >
                            {item.trangThaiThanhToan}
                          </Tag>
                        </div>

                        {(item.trangThai === "Chờ khám" ||
                          item.trangThai === "Đã khám") &&
                          item.trangThaiThanhToan === "Chưa thanh toán" &&
                          item.phuongthucthanhtoan === "VnPay" && (
                            <Tooltip title="Thanh toán ngay">
                              <a
                                style={{
                                  backgroundColor: "#1890ff",
                                  color: "#fff",
                                  padding: "4px 8px",
                                  borderRadius: 4,
                                  fontSize: 12,
                                  textDecoration: "none",
                                }}
                                onClick={() => handlePayment(item)}
                              >
                                Thanh toán
                              </a>
                            </Tooltip>
                          )}
                      </Col>
                    </Row>

                    <div
                      style={{
                        position: "absolute",
                        top: 0,
                        right: 0,
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 12,
                        padding: 8,
                      }}
                    >
                      <Tooltip title="Xem chi tiết">
                        <FaEye
                          style={{
                            color: "green",
                            cursor: "pointer",
                            fontSize: 18,
                          }}
                          onClick={() => {
                            setDataViewDH(item);
                            setOpenViewDH(true);
                          }}
                        />
                      </Tooltip>

                      <Tooltip title="Chỉnh sửa lịch hẹn">
                        <RiEdit2Fill
                          style={{
                            color: "orange",
                            cursor:
                              item.trangThai === "Đã hủy" ||
                              item.trangThai === "Đã khám"
                                ? "not-allowed"
                                : "pointer",
                            fontSize: 18,
                            opacity:
                              item.trangThai === "Đã hủy" ||
                              item.trangThai === "Đã khám"
                                ? 0.4
                                : 1,
                          }}
                          onClick={() => {
                            if (
                              item.trangThai !== "Đã hủy" &&
                              item.trangThai !== "Đã khám"
                            ) {
                              handleEditClick(item);
                            }
                          }}
                        />
                      </Tooltip>
                      <Tooltip title="Hủy lịch hẹn">
                        <RiDeleteBin5Line
                          style={{
                            color: "red",
                            cursor:
                              item.trangThai === "Đã hủy" ||
                              item.trangThai === "Đã khám"
                                ? "not-allowed"
                                : "pointer",
                            fontSize: 18,
                            opacity:
                              item.trangThai === "Đã hủy" ||
                              item.trangThai === "Đã khám"
                                ? 0.4
                                : 1,
                          }}
                          onClick={() => {
                            if (
                              item.trangThai !== "Đã hủy" &&
                              item.trangThai !== "Đã khám"
                            ) {
                              handleDeleteClick(item);
                            }
                          }}
                        />
                      </Tooltip>

                      {/* Nút gọi video */}
                      <Tooltip
                        title={
                          item.trangThai === "Đã hủy"
                            ? "Đã hủy - không thể gọi"
                            : "Gọi video"
                        }
                      >
                        <BsCameraVideoFill
                          style={{
                            color:
                              item.trangThai === "Đã hủy" ? "#ccc" : "#1890ff",
                            cursor:
                              item.trangThai === "Đã hủy"
                                ? "not-allowed"
                                : "pointer",
                            fontSize: 18,
                            pointerEvents:
                              item.trangThai === "Đã hủy" ? "none" : "auto",
                          }}
                          onClick={() => {
                            if (item.trangThai === "Đã hủy") return;
                            const videoCallUrl = `http://localhost:3003/video-call?appointmentId=${item.maLich}&patientId=${item.maBenhNhan}&doctorId=${item.maBacSi}&currentUserID=${acc?.user?.maBenhNhan}&currentRole=${acc?.user?.tenVaiTro}`;
                            window.open(videoCallUrl, "_blank");
                          }}
                        />
                      </Tooltip>

                      {/* Nút nhắn tin */}
                      <Tooltip
                        title={
                          item.trangThai === "Đã hủy"
                            ? "Đã hủy - không thể nhắn tin"
                            : "Nhắn tin"
                        }
                      >
                        <IoChatbubbleEllipsesSharp
                          style={{
                            color:
                              item.trangThai === "Đã hủy" ? "#ccc" : "#52c41a",
                            cursor:
                              item.trangThai === "Đã hủy"
                                ? "not-allowed"
                                : "pointer",
                            fontSize: 18,
                            pointerEvents:
                              item.trangThai === "Đã hủy" ? "none" : "auto",
                          }}
                          onClick={() => {
                            if (item.trangThai === "Đã hủy") return;
                            const chatUrl = `http://localhost:3003/chat?appointmentId=${item.maLich}&patientId=${item.maBenhNhan}&doctorId=${item.maBacSi}&currentUserID=${acc?.user?.maBenhNhan}&currentRole=${acc?.user?.tenVaiTro}`;
                            window.open(chatUrl, "_blank");
                          }}
                        />
                      </Tooltip>
                    </div>
                  </div>
                </div>
              </Col>
            ))}
          </Row>

          {!loading && dataOrder.length === 0 && (
            <div style={{ textAlign: "center", marginTop: 40 }}>
              <Empty description="Không có lịch hẹn" />
            </div>
          )}
        </Spin>
      </div>

      <Row style={{ marginBottom: "50px" }}></Row>
      <Footer />

      {/* Modal xem chi tiết */}
      <ModalXemChiTietLichHen
        open={openViewDH}
        onCancel={() => setOpenViewDH(false)}
        data={dataViewDH}
      />

      {/* Modal cập nhật lịch hẹn */}
      {/*<ModalCapNhatLichHen
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        data={editingRecord}
        onReload={fetchOrders}
      />*/}
    </>
  );
};

export default LichHenCard;
