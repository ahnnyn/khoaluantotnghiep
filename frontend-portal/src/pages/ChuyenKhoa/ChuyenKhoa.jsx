// ChuyenKhoa.jsx
import React, { useEffect, useState } from "react";
import { Card, Row, Col, Divider } from "antd";
import { useNavigate } from "react-router-dom";
import { AppstoreOutlined, MedicineBoxOutlined } from "@ant-design/icons";
import { fetchAllDepartments } from "services/patient/patient.services";
import BreadcrumbCustom from "components/Breadcum/BreadcrumbCustom";
import SpecialtyCard from "components/Shapes/SpecialtyCard";
import CardSkeleton from "components/Skeletons/CardSkeleton";
import "./ChuyenKhoa.scss";
import "../BodyHomePage/bodyHomePage.scss"; 

const ChuyenKhoa = () => {
  const [listDepartments, setListDepartments] = useState([]);
  const [loadingCard, setLoadingCard] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setLoadingCard(true);
    fetchAllDepartments()
      .then((res) => {
        console.log("Departments data:", res?.data);
        setListDepartments(res?.data);
        setLoadingCard(false);
      })
      .catch((err) => {
        console.error("Lỗi khi lấy tên khoa:", err);
        setLoadingCard(false);
      });
  }, []);

  const formatDepartments = (data) => {
    if (!Array.isArray(data)) return [];
    return data.map((item) => {
      const id = item._id;
      const image = item.image;
      const name = item.fullName || item.name || "Chuyên khoa";
      const description = item.description || "Không có mô tả";

      const src = image
        ? `${import.meta.env.VITE_BACKEND_URL}/public/images/upload/${image}`
        : "https://via.placeholder.com/200x200?text=No+Image";

      return {
        id,
        src,
        txtP: name,
        txtB: description,
      };
    });
  };

  const handleRedirect = (id) => {
    navigate(`/chuyen-khoa/${id}`);
  };

  return (
    <>
      <div
        className=""
        style={{
          backgroundImage: `url('/assets/images/Banner_2.jpg')`,
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
                  Chủ động chọn bác sĩ tin tưởng, đặt càng sớm, càng có cơ hội
                  có số thứ tự thấp nhất, tránh hết số
                </li>
                <li>
                  Đặt khám theo giờ, không cần chờ lấy số thứ tự, chờ thanh toán
                  (đối với cơ sở mở thanh toán online)
                </li>
                <li> Được hoàn phí khám nếu hủy phiếu</li>
                <li>
                  Được hưởng chính sách hoàn tiền khi đặt lịch trên Medpro (đối
                  với các cơ sở tư có áp dụng)
                </li>
              </ul>
            </div>
          </Col>

          <Col xs={4} md={12} className="z-0 flex justify-end">
            <img
              src="/assets/images/banner_1-removebg-preview.png"
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

      <Row justify="center" style={{ marginTop: "30px" }}>
        <Col xs={22} sm={20} md={16}>
          <BreadcrumbCustom
            items={[
              {
                title: "Đặt khám",
                icon: <MedicineBoxOutlined />,
              },
              {
                title: "Chuyên khoa",
                icon: <AppstoreOutlined />,
              },
            ]}
          />
        </Col>
      </Row>

      <Divider style={{ margin: "16px 100px" }} />

      <section className="chuyen-khoa-section">
        <div className="container">
          {loadingCard ? (
            <CardSkeleton count={5} />
          ) : (
            <Row gutter={[16, 24]}>
              {formatDepartments(listDepartments).map((item) => (
                <Col key={item.id} xs={24} sm={12} md={8} lg={6}> {/* sl={4} */}
                  <SpecialtyCard
                    imageSrc={item.src}
                    alt={item.txtP || "Ảnh chuyên khoa"}
                    title={item.txtP}
                    description={item.txtB}
                    onClick={() => handleRedirect(item.id)}
                    type="doctor"
                  />
                </Col>
              ))}
            </Row>
          )}
        </div>
      </section>
    </>
  );
};

export default ChuyenKhoa;
