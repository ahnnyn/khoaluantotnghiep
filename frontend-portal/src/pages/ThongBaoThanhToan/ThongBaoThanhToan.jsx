import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

import Header from "components/Header/Header";
import Footer from "components/Footer/Footer";
import {
  getThongBaoThanhToan,
  capNhatTrangThaiThanhToanLichKham,
} from "services/patient/patient.services";

import { Button } from "antd";

import "./ThongBao.css";

const ThongBaoThanhToan = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [status, setStatus] = useState(null); // true: success, false: fail
  const [message, setMessage] = useState("Đang xử lý kết quả thanh toán...");

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const vnp_ResponseCode = queryParams.get("vnp_ResponseCode");

    if (!vnp_ResponseCode) {
      setMessage("Không có thông tin thanh toán để xử lý.");
      setStatus(false);
      return;
    }

    const vnp_TxnRef = queryParams.get("vnp_TxnRef");
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

    const handleSuccess = async () => {
      try {
        setMessage("🔄 Đang lưu thông tin thanh toán...");

        await getThongBaoThanhToan({
          vnp_Amount,
          vnp_BankCode,
          vnp_BankTranNo,
          vnp_CardType,
          vnp_OrderInfo,
          vnp_PayDate,
          vnp_ResponseCode,
          vnp_TmnCode,
          vnp_TransactionNo,
          vnp_TransactionStatus,
          vnp_TxnRef,
          vnp_SecureHash,
        });

        await capNhatTrangThaiThanhToanLichKham({
          maLichKham: vnp_TxnRef,
          trangThaiThanhToan: "Đã thanh toán",
        });

        setStatus(true);
        setMessage("Thanh toán thành công!");
      } catch (error) {
        console.error(
          "Lỗi khi xử lý thanh toán:",
          error?.response?.data || error?.message || error
        );
        setStatus(false);
        setMessage(
          "Thanh toán thất bại! Vui lòng thử lại hoặc liên hệ hỗ trợ."
        );
      }
    };

    if (vnp_ResponseCode === "00") {
      handleSuccess();
    } else {
      setStatus(false);
      setMessage(
        "Thanh toán không thành công. Mã phản hồi: " + vnp_ResponseCode
      );
    }
  }, [location]);

  return (
    <>
      <Header />
      <div style={{ marginTop: "50px" }}></div>
      <div className="center-container">
        <div className="notification-box">
          {status === null ? (
            <p className="message">{message}</p>
          ) : status ? (
            <>
              <FaCheckCircle size={60} className="icon success" />
              <h2 className="heading success">Thanh toán thành công!</h2>
              <p className="message">{message}</p>
              <div className="button-container">
                <Button
                  type="primary"
                  className="button"
                  onClick={() => navigate("/")}
                >
                  Về trang chủ
                </Button>
                <Button
                  className="button"
                  onClick={() => navigate("/user/lich-hen")}
                >
                  Tới trang quản lý lịch khám
                </Button>
              </div>
            </>
          ) : (
            <>
              <FaTimesCircle size={60} className="icon failure" />
              <h2 className="heading failure">Thanh toán thất bại!</h2>
              <p className="message">{message}</p>
              <div className="button-container">
                <Button
                  type="primary"
                  className="button"
                  onClick={() => navigate("/")}
                >
                  Về trang chủ
                </Button>
                <Button
                  className="button"
                  onClick={() => navigate("/user/lich-hen")}
                >
                  Tới trang quản lý lịch khám
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ThongBaoThanhToan;
