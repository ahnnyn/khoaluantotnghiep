import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import QRCode from "react-qr-code";

import Header from "components/Header/Header";
import Footer from "components/Footer/Footer";
import { handleCreatePayment } from "services/patient/patient.services";
import { Card, Button, Spin, notification, Row, Col, Descriptions } from "antd";
import dayjs from "dayjs";

import "./ThongBao.css";

// Hàm parse vnp_PayDate về kiểu Date
const parseVNPayDate = (raw) => {
  const year = parseInt(raw.slice(0, 4));
  const month = parseInt(raw.slice(4, 6)) - 1;
  const day = parseInt(raw.slice(6, 8));
  const hour = parseInt(raw.slice(8, 10));
  const minute = parseInt(raw.slice(10, 12));
  const second = parseInt(raw.slice(12, 14));
  return new Date(year, month, day, hour, minute, second);
};

// Chuyển chuỗi Unicode thành base64
const utf8ToBase64 = (str) => {
  return window.btoa(unescape(encodeURIComponent(str)));
};

const PaymentNotificationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [status, setStatus] = useState(null);
  const [message, setMessage] = useState("Đang xử lý kết quả thanh toán...");
  const [appointmentInfo, setAppointmentInfo] = useState(null);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const vnp_ResponseCode = queryParams.get("vnp_ResponseCode");

    if (!vnp_ResponseCode) {
      setStatus(false);
      setMessage("Không có thông tin thanh toán để xử lý.");
      return;
    }

    const vnp_TxnRef = queryParams.get("vnp_TxnRef");
    const vnp_Amount = queryParams.get("vnp_Amount");
    const vnp_PayDate = queryParams.get("vnp_PayDate");

    const gatewayResponse = {};
    queryParams.forEach((value, key) => {
      gatewayResponse[key] = value;
    });

    const handleSuccess = async () => {
      setMessage("Đang lưu thông tin thanh toán...");

      const payload = {
        maLichKham: vnp_TxnRef,
        method: "vnpay",
        amount: Number(vnp_Amount) / 100,
        status: "SUCCESS",
        payDate: parseVNPayDate(vnp_PayDate),
        gatewayResponse,
      };

      try {
        const res = await handleCreatePayment(payload);
        console.log("RES FROM CREATE PAYMENT:", res);

        if (res?.success) {
          setStatus(true);
          setMessage("Thanh toán thành công!");
          setAppointmentInfo(res.appointmentInfo || null);
        } else {
          setStatus(false);
          setMessage(res?.message || "Không lưu được thanh toán.");
          notification.warning({
            message: "Thanh toán chưa hoàn tất",
            description: res?.message || "Hệ thống không thể lưu thanh toán.",
          });
        }
      } catch (err) {
        console.error("Lỗi khi lưu thanh toán:", err);
        setStatus(false);
        setMessage("Thanh toán thất bại! Vui lòng thử lại hoặc liên hệ hỗ trợ.");
        notification.error({
          message: "Lỗi xử lý thanh toán",
          description:
            err?.response?.message ||
            "Không thể lưu thông tin thanh toán. Vui lòng liên hệ hỗ trợ.",
        });
      }
    };

    if (vnp_ResponseCode === "00") {
      handleSuccess();
    } else {
      setStatus(false);
      setMessage(`Thanh toán không thành công. Mã phản hồi: ${vnp_ResponseCode}`);
    }
  }, [location]);


  //DECODE MÃ QR:
//   const base64 = "eyJtYUxpY2hLaGFtIjoiNjg3NzRhMzcyODM3NGJjYzQ1NDgyMTAzIiwicGF0aWVudCI6IiIsImRlcGFydG1lbnQiOiJLaG9hIE7hu5lpIiwiZG9jdG9yIjoiVHLhuqduIFRo4buLIEtow6FuaCBMaW5oIiwiZGF0ZSI6IjIyLzA3LzIwMjUiLCJ0aW1lIjoiMDg6MzAtMDk6MDAiLCJsb2NhdGlvbiI6Iktow6FtIHRy4buxYyB0dXnhur9uIiwicXVldWVOdW1iZXIiOjMwfQ==";

// const decoded = JSON.parse(decodeURIComponent(escape(window.atob(base64))));
// console.log(decoded);


  return (
    <>
      <Header />
      <div style={{ marginTop: "60px", marginBottom: "40px" }}>
        {status === null ? (
          <Spin tip="Đang xử lý..." size="large" />
        ) : (
          <Card
            className="notification-box"
            style={{
              maxWidth: 600,
              margin: "0 auto",
              textAlign: "center",
              borderColor: status ? "#52c41a" : "#ff4d4f",
            }}
          >
            {status ? (
              <>
                <FaCheckCircle size={60} className="icon success" />
                <h2 className="heading success">Thanh toán thành công!</h2>
                <p className="message">{message}</p>
              </>
            ) : (
              <>
                <FaTimesCircle size={60} className="icon failure" />
                <h2 className="heading failure">Thanh toán thất bại!</h2>
                <p className="message">{message}</p>
              </>
            )}
            <div className="button-container" style={{ marginTop: 16 }}>
              <Button type="primary" onClick={() => navigate("/")}>
                Về trang chủ
              </Button>
              <Button onClick={() => navigate("/user/lich-hen")}>
                Tới trang quản lý lịch khám
              </Button>
            </div>
          </Card>
        )}

        {appointmentInfo && status && (
          <Card
            title="THÔNG TIN ĐẶT LỊCH KHÁM"
            style={{
              maxWidth: 800,
              margin: "30px auto",
              borderRadius: 8,
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          >
            <Row gutter={24}>
              <Col xs={24} md={16}>
                <Descriptions column={1} bordered size="middle">
                  <Descriptions.Item label="Bác sĩ">
                    {appointmentInfo.doctorName}
                  </Descriptions.Item>
                  <Descriptions.Item label="Khoa">
                    {appointmentInfo.department}
                  </Descriptions.Item>
                  <Descriptions.Item label="Chức vụ">
                    {appointmentInfo.position}
                  </Descriptions.Item>
                  <Descriptions.Item label="Ngày khám">
                    {dayjs(appointmentInfo.appointmentDate).format("DD/MM/YYYY")}
                  </Descriptions.Item>
                  <Descriptions.Item label="Khung giờ">
                    {appointmentInfo.appointmentTime}
                  </Descriptions.Item>
                  <Descriptions.Item label="Hình thức khám">
                    {appointmentInfo.consultationType}
                  </Descriptions.Item>
                  <Descriptions.Item label="Vị trí khám">
                    {appointmentInfo.location}
                  </Descriptions.Item>
                  {appointmentInfo.queueNumber && (
                    <Descriptions.Item label="Số thứ tự">
                      {appointmentInfo.queueNumber}
                    </Descriptions.Item>
                  )}
                </Descriptions>
              </Col>

              <Col xs={24} md={8} style={{ textAlign: "center" }}>
                <h4>Mã QR Check-in</h4>
                <QRCode
                  value={utf8ToBase64(
                    JSON.stringify({
                      maLichKham: appointmentInfo.maLichKham || "",
                      patient: appointmentInfo.patientName || "",
                      department: appointmentInfo.department || "",
                      doctor: appointmentInfo.doctorName,
                      date: dayjs(appointmentInfo.appointmentDate).format("DD/MM/YYYY"),
                      time: appointmentInfo.appointmentTime,
                      location: appointmentInfo.location || "",
                      queueNumber: appointmentInfo.queueNumber || "",
                    })
                  )}
                  size={180}
                />
                <p style={{ marginTop: 10, fontSize: 12, color: "#888" }}>
                  Quét mã tại quầy để xác nhận
                </p>
              </Col>
            </Row>
          </Card>
        )}
      </div>
      <Footer />
    </>
  );
};

export default PaymentNotificationPage;
