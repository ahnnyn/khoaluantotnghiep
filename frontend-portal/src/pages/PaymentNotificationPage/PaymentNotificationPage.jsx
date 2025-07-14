import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import QRCode from "react-qr-code";

import Header from "components/Header/Header";
import Footer from "components/Footer/Footer";
import { handleCreateAppointment } from "services/patient/patient.services";
import { Card, Button, Spin, notification, Row, Col, Descriptions } from "antd";

import "./ThongBao.css";

const PaymentNotificationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [status, setStatus] = useState<null | boolean>(null); // true = success, false = fail
  const [message, setMessage] = useState("Đang xử lý kết quả thanh toán...");
  const [appointmentInfo, setAppointmentInfo] = useState<any>(null);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const vnp_ResponseCode = queryParams.get("vnp_ResponseCode");

    if (!vnp_ResponseCode) {
      setStatus(false);
      setMessage("Không có thông tin thanh toán để xử lý.");
      return;
    }

    const vnp_TxnRef = queryParams.get("vnp_TxnRef"); // maLichKham
    const vnp_Amount = queryParams.get("vnp_Amount");
    const vnp_PayDate = queryParams.get("vnp_PayDate");
    const vnp_BankCode = queryParams.get("vnp_BankCode");
    const vnp_BankTranNo = queryParams.get("vnp_BankTranNo");
    const vnp_CardType = queryParams.get("vnp_CardType");
    const vnp_OrderInfo = queryParams.get("vnp_OrderInfo");
    const vnp_TransactionNo = queryParams.get("vnp_TransactionNo");
    const vnp_TransactionStatus = queryParams.get("vnp_TransactionStatus");
    const vnp_TmnCode = queryParams.get("vnp_TmnCode");
    const vnp_SecureHash = queryParams.get("vnp_SecureHash");

    const gatewayResponse = {
      vnp_ResponseCode,
      vnp_TxnRef,
      vnp_Amount,
      vnp_PayDate,
      vnp_BankCode,
      vnp_BankTranNo,
      vnp_CardType,
      vnp_OrderInfo,
      vnp_TransactionNo,
      vnp_TransactionStatus,
      vnp_TmnCode,
      vnp_SecureHash,
    };

    const handleSuccess = async () => {
      try {
        setMessage("🔄 Đang lưu thông tin thanh toán...");

        const payload = {
          maLichKham: vnp_TxnRef,
          method: "VNPAY",
          amount: Number(vnp_Amount) / 100,
          status: "SUCCESS",
          payDate: vnp_PayDate,
          gatewayResponse,
        };

        const res = await handleCreateAppointment(payload);

        if (res?.data?.success) {
          setStatus(true);
          setMessage("Thanh toán thành công!");
          setAppointmentInfo(res.data.appointmentInfo || null);
        } else {
          throw new Error("Không lưu được thanh toán.");
        }
      } catch (err) {
        console.error("Lỗi khi lưu thanh toán:", err);
        notification.error({
          message: "Lỗi xử lý thanh toán",
          description:
            err?.response?.data?.message ||
            "Không thể lưu thông tin thanh toán. Vui lòng liên hệ hỗ trợ.",
        });
        setStatus(false);
        setMessage("Thanh toán thất bại! Vui lòng thử lại hoặc liên hệ hỗ trợ.");
      }
    };

    if (vnp_ResponseCode === "00") {
      handleSuccess();
    } else {
      setStatus(false);
      setMessage(`Thanh toán không thành công. Mã phản hồi: ${vnp_ResponseCode}`);
    }
  }, [location]);

  const renderResultCard = () => {
    if (status === null) return <Spin tip="Đang xử lý..." size="large" />;

    return (
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
    );
  };

  const renderAppointmentCard = () => {
    if (!appointmentInfo || !status) return null;

    return (
      <Card
        title="Thông tin đặt lịch"
        style={{
          maxWidth: 800,
          margin: "30px auto",
          borderRadius: 8,
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        <Row gutter={24}>
          <Col xs={24} md={16}>
            <Descriptions
              column={1}
              bordered
              size="middle"
              labelStyle={{ fontWeight: 600, width: 180 }}
            >
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
                {appointmentInfo.appointmentDate}
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
              value={JSON.stringify({
                maLichKham: appointmentInfo.maLichKham || "",
                doctor: appointmentInfo.doctorName,
                date: appointmentInfo.appointmentDate,
                time: appointmentInfo.appointmentTime,
              })}
              size={180}
            />
            <p style={{ marginTop: 10, fontSize: 12, color: "#888" }}>
              Quét mã tại quầy để xác nhận
            </p>
          </Col>
        </Row>
      </Card>
    );
  };

  return (
    <>
      <Header />
      <div style={{ marginTop: "60px", marginBottom: "40px" }}>
        {renderResultCard()}
        {renderAppointmentCard()}
      </div>
      <Footer />
    </>
  );
};

export default PaymentNotificationPage;
