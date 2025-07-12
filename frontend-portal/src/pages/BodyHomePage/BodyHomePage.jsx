import { Col, Row } from "antd";
import "./bodyHomePage.scss";
import { useEffect, useState, useCallback } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FiVideo } from "react-icons/fi";
import { FaClinicMedical, FaBrain } from "react-icons/fa";
import { GiFruitBowl } from "react-icons/gi";
import { fetchAllDepartments, fetchAllDoctor } from "services/patient/patient.services";
import { useNavigate } from "react-router-dom";
import SpecialtyCard from "components/Shapes/SpecialtyCard";
import ServiceCard from "components/Shapes/ServiceCard";
import DoctorCard from "components/Shapes/DoctorCard";

const BodyHomePage = () => {
  const [dataChuyenKhoa, setDataChuyenKhoa] = useState([]);
  const [dataBacSi, setDataBacSi] = useState([]);
  const [loadingCard, setLoadingCard] = useState(true);
  const navigate = useNavigate();

  const listChuyenKhoa = useCallback(async () => {
    try {
      setLoadingCard(true);
      const { data } = await fetchAllDepartments();
      if (data) setDataChuyenKhoa(data);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách chuyên khoa:", error);
    } finally {
      setLoadingCard(false);
    }
  }, []);

  const listBacSi = useCallback(async () => {
    try {
      const { data } = await fetchAllDoctor();
      if (data) setDataBacSi(data);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách bác sĩ:", error);
    }
  }, []);

  useEffect(() => {
    listChuyenKhoa();
    listBacSi();
  }, [listChuyenKhoa, listBacSi]);

  const services = [
    { icon: <FaClinicMedical size={40} color="blue" />, txtP: "Đặt khám tại bệnh viện", redirect: "/chuyen-khoa-kham" },
    { icon: <FiVideo size={40} color="blue" />, txtP: "Đặt khám trực tuyến", redirect: "/chuyen-khoa-kham" },
    { icon: <FaBrain size={40} color="blue" />, txtP: "Tư vấn tâm lý trực tuyến", redirect: "/user/tu-van-tam-ly" },
    { icon: <GiFruitBowl size={40} color="blue" />, txtP: "Tư vấn dinh dưỡng trực tuyến", redirect: "/user/tu-van-dinh-duong" },
  ];

  const formatItems = (data, type) => {
    if (!Array.isArray(data)) return [];

    return data.map((item) => {
      const isDoctor = type === "doctor";
      const id = item._id;
      const image = isDoctor ? item.avatar : item.image;
      const name = isDoctor ? item.fullName : item.name;
      const description = isDoctor ? item.departmentId?.[0]?.name || "Chuyên khoa chưa rõ" : item.description;

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

  const handleRedirect = (path, id, paramName) => {
    navigate(`${path}?${paramName}=${id}`);
  };

  return (
    <>
      <div className="slicer-banner">
        <img
          src="/public/assets/images/healio_banner.png"
          alt="Slicer Banner"
          className="banner-img"
        />
      </div>

      <div className="content-wrapper">
        <section className="danh-cho-ban">
          <div className="ben-trong">
            <div className="section-header">
              <h2 className="section-title">Dịch vụ</h2>
            </div>
            <Slider
              slidesToShow={Math.min(4, services.length)}
              slidesToScroll={1}
              arrows
              infinite={false}
              responsive={[
                { breakpoint: 1200, settings: { slidesToShow: 3 } },
                { breakpoint: 992, settings: { slidesToShow: 2 } },
                { breakpoint: 576, settings: { slidesToShow: 1 } }
              ]}
              className="custom-slider"
            >
              {services.map((item, index) => (
                <div key={index} className="slider-item">
                  <ServiceCard
                    icon={item.icon}
                    title={item.txtP}
                    onClick={() => navigate(item.redirect)}
                  />
                </div>
              ))}
            </Slider>
          </div>
        </section>

        <section className="danh-cho-ban">
          <div className="ben-trong">
            <div className="section-header">
              <h2 className="section-title">Chuyên khoa</h2>
              <button className="see-more-btn" onClick={() => navigate("/chuyen-khoa-kham")}>Xem thêm</button>
            </div>
            <Slider
              slidesToShow={Math.min(4, dataChuyenKhoa.length)}
              slidesToScroll={1}
              arrows
              infinite={false}
              responsive={[
                { breakpoint: 1200, settings: { slidesToShow: 3 } },
                { breakpoint: 992, settings: { slidesToShow: 2 } },
                { breakpoint: 576, settings: { slidesToShow: 1 } }
              ]}
              className="custom-slider"
            >
              {formatItems(dataChuyenKhoa, "specialty").map((item) => (
                <div key={item.id} className="slider-item">
                  <SpecialtyCard
                    imageSrc={item.src}
                    title={item.txtP}
                    description={item.txtB}
                    onClick={() => handleRedirect("/chi-tiet-chuyen-khoa", item.id, "maKhoa")}
                  />
                </div>
              ))}
            </Slider>
          </div>
        </section>

        <section className="danh-cho-ban">
          <div className="ben-trong">
            <div className="section-header">
              <h2 className="section-title">Bác sĩ nổi bật</h2>
              <button className="see-more-btn" onClick={() => navigate("/chi-tiet-bacsi")}>Xem thêm</button>
            </div>
            <Slider
              slidesToShow={Math.min(4, dataBacSi.length)}
              slidesToScroll={1}
              arrows
              infinite={false}
              responsive={[
                { breakpoint: 1200, settings: { slidesToShow: 3 } },
                { breakpoint: 992, settings: { slidesToShow: 2 } },
                { breakpoint: 576, settings: { slidesToShow: 1 } }
              ]}
              className="custom-slider"
            >
              {formatItems(dataBacSi, "doctor").map((item) => (
                <div key={item.id} className="slider-item">
                  <DoctorCard
                    imageSrc={item.src}
                    title={item.txtP}
                    description={item.txtB}
                    onClick={() => handleRedirect("/chi-tiet-bacsi", item.id, "maBacSi")}
                    type="doctor"
                  />
                </div>
              ))}
            </Slider>
          </div>
        </section>
      </div>
    </>
  );
};

export default BodyHomePage;
