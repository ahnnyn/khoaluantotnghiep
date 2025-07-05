import Footer from "components/Footer/Footer";
import Header from "components/Header/Header";
import HinhChuNhat from "components/Shapes/HinhChuNhat";
import { Col, Row } from "antd";
import { FiVideo } from "react-icons/fi";
import { FaClinicMedical, FaBrain, FaAppleAlt } from "react-icons/fa";
import { GiFruitBowl } from "react-icons/gi";
import { IoHomeSharp } from "react-icons/io5";

import { useState } from "react";
import { useNavigate } from "react-router-dom";


const DichVuKham = () => {
  const [loadingCard, setLoadingCard] = useState(true);
  const navigate = useNavigate();
  const items_dichvu = [
    {
      icon: <FaClinicMedical size={40} color="blue" />,
      txtP: "Đặt khám tại bệnh viện",
      redirect: "/chuyen-khoa-kham?hinhThucKham=chuyenkhoa",
    },
    {
      icon: <FiVideo size={40} color="blue" />,
      txtP: "Tư vấn sức khỏe trực tuyến",
      redirect: "/chuyen-khoa-kham?hinhThucKham=tructuyen",
    },
    {
      icon: <FaBrain size={40} color="blue" />,
      txtP: "Tư vấn tâm lý trực tuyến",
      redirect: "/user/tu-van-tam-ly",
    },
    {
      icon: <GiFruitBowl size={40} color="blue" />,
      txtP: "Tư vấn dinh dưỡng trực tuyến",
      redirect: "/user/tu-van-dinh-duong",
    },
  ];

  return (
    <>
      <Header />
      <div style={{ height: "120px" }}></div>
      <div
        className=""
        style={{
          backgroundImage: `url('../../public/Banner_2.jpg')`,
          height: "450px",
        }}
      >
        <Row justify="space-between" align="middle" gutter={16}>
          <Col xs={24} md={12} className="">
            <div
              className=""
              style={{
                marginLeft: "70px",
                padding: "10px 20px",
                borderRadius: "40px",
                backgroundColor: "white",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                marginTop: "50px",
              }}
            >
              <h2
                className=""
                style={{
                  fontSize: "clamp(20px, 5vw, 30px)",
                  fontWeight: "bold",
                  color: "#00B0F0",
                }}
              >
                ĐẶT KHÁM THEO BÁC SĨ
              </h2>
              <ul
                className=""
                style={{
                  listStyleType: "none",
                  paddingLeft: "0",
                  lineHeight: "1.8",
                  color: "#333",
                }}
              >
                <li>
                  ✅ Chủ động chọn bác sĩ tin tưởng, đặt càng sớm, càng có cơ
                  hội có số thứ tự thấp nhất, tránh hết số
                </li>
                <li>
                  ✅ Đặt khám theo giờ, không cần chờ lấy số thứ tự, chờ thanh
                  toán (đối với cơ sở mở thanh toán online)
                </li>
                <li>✅ Được hoàn phí khám nếu hủy phiếu</li>
                <li>
                  ✅ Được hưởng chính sách hoàn tiền khi đặt lịch trên Medpro
                  (đối với các cơ sở tư có áp dụng)
                </li>
              </ul>
            </div>
          </Col>

          <Col xs={4} md={12} className="z-0 flex justify-end">
            <img
              src="../../public/tu-van-voi-bac-si-removebg-preview.png"
              alt="Doctors illustration"
              className=""
              style={{
                maxHeight: "350px",
                float: "right",
                marginTop: "100px",
                marginRight: "50px",
              }}
            />
          </Col>
        </Row>
      </div>

      <Row style={{ marginTop: "20px" }}></Row>
      <Col span={18} className="col-body">
        <Row>
          <Col span={24}>
            <p className="txt-title">
              <IoHomeSharp /> / Đặt lịch khám
            </p>
          </Col>
        </Row>
      </Col>

      <div className="danh-cho-ban" style={{ marginTop: "0" }}>
        <Row className="ben-trong" justify="center">
          <span
            style={{
              fontWeight: 500,
              fontSize: "clamp(25px, 5vw, 32px)",
              width: "100%",
              padding: "4vh 0",
              zIndex: "50",
              textAlign: "center",
              color: "#1E90FF",
            }}
          >
            Chọn dịch vụ khám phù hợp với bạn
          </span>

          <Row
            gutter={[0, 24]} // Tạo khoảng cách giữa các item
            justify="space-around"
            style={{ width: "100%", margin: 0 }}
          >
            {items_dichvu.map((item, index) => (
              <Col
                key={index}
                xl={12} // 2 dịch vụ trên màn hình lớn (desktop)
                lg={12} // 2 dịch vụ trên tablet
                md={24} // 1 dịch vụ trên màn hình vừa (như tablet nhỏ)
                sm={24} // 1 dịch vụ trên mobile
                xs={24} // 1 dịch vụ trên màn hình nhỏ nhất
                style={{
                  display: "flex",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
                flex="0 0 400px"
              >
                <HinhChuNhat
                  icon={item.icon}
                  txtP={item.txtP}
                  onClick={() => navigate(item.redirect)}
                  loadingCard={loadingCard}
                />
              </Col>
            ))}
          </Row>
        </Row>
      </div>

      <div style={{ marginBottom: "clamp(50px, 10vw, 200px)" }}></div>
      <Footer />
    </>
  );
};

export default DichVuKham;
