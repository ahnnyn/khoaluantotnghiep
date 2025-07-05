import React, { useRef } from "react";
import "./LienHe.scss";
import emailjs from "@emailjs/browser";
import Swal from "sweetalert2";
import Header from "components/Header/Header";
import Footer from "components/Footer/Footer";
import { IoHomeSharp } from "react-icons/io5";
import { Col, Row } from "antd";

function LienHe() {
  const form = useRef();

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm(
        "service_a6i9rdn",
        "template_r4fcuct",
        form.current,
        "9gp63uOgs5b5UhWcD"
      )
      .then(
        () => {
          Swal.fire({
            icon: "success",
            title: "Gửi thành công!",
            text: "Chúng tôi sẽ liên hệ lại với bạn sớm nhất.",
            showConfirmButton: false,
            timer: 3000,
          });
          form.current.reset();
        },
        (error) => {
          console.error("Lỗi gửi email:", error);
          Swal.fire({
            icon: "error",
            title: "Gửi thất bại!",
            text: "Vui lòng thử lại sau.",
          });
        }
      );
  };

  return (
    <>
      <Header />
      <div style={{ marginBottom: "120px" }}></div>
      <div className="contact-container">
        <Col span={18} className="col-body">
          <Row>
            <Col span={24}>
              <p className="txt-title">
                <IoHomeSharp /> / Liên hệ
              </p>
            </Col>
          </Row>
        </Col>
        <div className="contact-header">
          <h2>LIÊN HỆ VỚI CHÚNG TÔI</h2>
          <p>
            Mọi thắc mắc hoặc cần hỗ trợ, bạn có thể liên hệ qua biểu mẫu dưới
            đây.
          </p>
        </div>

        <div className="contact-content">
          <div className="contact-left">
            <form
              ref={form}
              onSubmit={sendEmail}
              style={{ display: "flex", flexDirection: "column", gap: "10px" }}
            >
              <h3>Gửi liên hệ</h3>
              <input
                type="text"
                name="user_name"
                placeholder="Họ và tên"
                required
              />
              <input
                type="email"
                name="user_email"
                placeholder="Email"
                required
              />
              <textarea
                name="message"
                placeholder="Nội dung"
                required
              ></textarea>
              <button
                type="submit"
                style={{
                  width: "200px",
                  height: "50px",
                  textAlign: "center",
                  alignSelf: "center", // căn giữa theo trục ngang trong flexbox
                }}
              >
                Gửi liên hệ
              </button>
            </form>
          </div>

          <div className="contact-right">
            <div className="info-box">
              <p>
                <strong>Địa chỉ:</strong> 266 Đội Cấn, Ba Đình, Hà Nội
              </p>
              <p>
                <strong>Điện thoại:</strong> 19006750
              </p>
              <p>
                <strong>Email:</strong> support@abc.vn
              </p>
            </div>
            <div className="map-box">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3723.8560214887423!2d105.81612381424596!3d21.036618792865874!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135abcf5b7f80e3%3A0x3f50b7c3d3b62efb!2zMjY2IMSQLiDEkOG7iWMgQ-G6p24sIEzGsMahIFdpLCBCw6AgxJDDoG5oLCBIw6AgTuG7mWk!5e0!3m2!1sen!2s!4v1623035000000"
                loading="lazy"
                title="Google Map"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      </div>
      <div style={{ marginBottom: "150px" }}></div>

      <Footer />
    </>
  );
}

export default LienHe;
