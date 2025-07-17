import { Avatar, Col, Row } from "antd";
import "./bodyHomePage.scss";
import { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import AOS from "aos";
import "aos/dist/aos.css";

import {
  FaClinicMedical,
  FaBrain,
  FaClock,
  FaUserMd,
  FaLaptopMedical,
  FaWallet,
} from "react-icons/fa";
import { FaSearch, FaCalendarAlt, FaRegComments } from "react-icons/fa";
import { GiFruitBowl } from "react-icons/gi";
import { MdEventAvailable } from "react-icons/md";

import {
  fetchAllDepartments,
  fetchAllDoctor,
  fetchAllArticles,
} from "services/patient/patient.services";
import { useNavigate } from "react-router-dom";
import SpecialtyCard from "components/Shapes/SpecialtyCard";
import ServiceCard from "components/Shapes/ServiceCard";
import DoctorCard from "components/Shapes/DoctorCard";
import ArticleCard from "components/Shapes/ArticleCard";
import CardSkeleton from "components/Skeletons/CardSkeleton";
import SearchComponent from "components/SearchComponent/SearchComponent";
import HeroBanner from "components/HeroBanner/HeroBanner";

const BodyHomePage = () => {
  
  const [dataChuyenKhoa, setDataChuyenKhoa] = useState([]);
  const [dataBacSi, setDataBacSi] = useState([]);
  const [articles, setArticles] = useState([]);
  const [loadingCard, setLoadingCard] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({
      duration: 1500,
      easing: "ease-in-out",
      once: false, // Cho phép tái chạy khi cuộn lên
      mirror: true, // Cho phép effect chạy khi cuộn ngược lên
    });
  }, []);

  useEffect(() => {
    const fetchAllData = async () => {
      setLoadingCard(true);
      try {
        const [resDepartments, resDoctors, resArticles] = await Promise.all([
          fetchAllDepartments(),
          fetchAllDoctor(),
          fetchAllArticles(),
        ]);

        if (resDepartments.data) setDataChuyenKhoa(resDepartments.data);
        if (resDoctors.data) setDataBacSi(resDoctors.data);
        if (resArticles.data) setArticles(resArticles.data);
      } catch (error) {
        console.error("Lỗi khi load dữ liệu:", error);
      } finally {
        setLoadingCard(false);
      }
    };

    fetchAllData();
  }, []);

  const services = [
    {
      icon: <FaClinicMedical size={40} color="blue" />,
      txtP: "Đặt lịch khám (tại bệnh viện hoặc trực tuyến)",
      redirect: "/chuyen-khoa-kham",
    },
    // {
    //   icon: <FiVideo size={40} color="blue" />,
    //   txtP: "Đặt khám trực tuyến",
    //   redirect: "/chuyen-khoa-kham",
    // },
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

  const formatItems = (data, type) => {
    if (!Array.isArray(data)) return [];

    return data.map((item) => {
      const isDoctor = type === "doctor";
      const id = item._id;
      const image = isDoctor ? item.avatar : item.image;
      const name = isDoctor ? item.fullName : item.name;
      const description = isDoctor
        ? item.departmentId?.[0]?.name || "Chuyên khoa chưa rõ"
        : item.description;

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

  const formatArticles = (data) => {
    if (!Array.isArray(data)) return [];

    return data.map((item) => ({
      ...item,
      thumbnail: item.thumbnail?.startsWith("http")
        ? item.thumbnail
        : `${import.meta.env.VITE_BACKEND_URL}/public/images/articles/${
            item.thumbnail
          }`,
    }));
  };

  const handleRedirect = (path, id, paramName) => {
    navigate(`${path}?${paramName}=${id}`);
  };

  return (
    <>
      <HeroBanner />

      {/* QUICK SEARCH Ở ĐÂY */}
      <div className="quick-search-container">
        <div className="quick-search-box">
          <SearchComponent
            placeholder={"Tìm kiếm chuyên khoa, bác sĩ, bài viết..."}
          />
        </div>
      </div>

      <div className="content-wrapper">
        {/* --- SERVICES --- */}
        <section
          className="danh-cho-ban"
          data-aos="fade-right"
          data-aos-duration="1000"
          data-aos-easing="ease-in-out"
        >
          <div className="ben-trong">
            <Slider
              slidesToShow={Math.min(4, services.length)}
              slidesToScroll={1}
              arrows
              infinite={false}
              responsive={[
                { breakpoint: 1200, settings: { slidesToShow: 3 } },
                { breakpoint: 992, settings: { slidesToShow: 2 } },
                { breakpoint: 576, settings: { slidesToShow: 1 } },
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

        {/* --- LỢI ÍCH--- */}
        <section className="danh-cho-ban loi-ich-healio" data-aos="fade-up">
          <div className="ben-trong">
            <h2 className="section-title">Lợi ích khi sử dụng Healio</h2>
            <Row gutter={16}>
              {[
                {
                  icon: <FaClock size={30} />,
                  text: "Tiết kiệm thời gian đặt khám",
                },
                {
                  icon: <FaClinicMedical size={30} />,
                  text: "Đội ngũ bác sĩ uy tín",
                },
                { icon: <FaUserMd size={30} />, text: "Đa dạng chuyên khoa" },
                {
                  icon: <FaLaptopMedical size={30} />,
                  text: "Tư vấn trực tuyến tiện lợi",
                },
              ].map((item, idx) => (
                <Col span={6} key={idx} className="benefit-item">
                  <div className="icon">{item.icon}</div>
                  <p>{item.text}</p>
                </Col>
              ))}
            </Row>
          </div>
        </section>
        {/* --- HƯỚNG DẪN BOOKING --- */}
        <section
          className="danh-cho-ban how-it-works"
          style={{
            backgroundImage: `url('/public/assets/images/Banner_2.jpg')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          <div className="ben-trong">
            <h2 className="section-title">Hướng dẫn đặt lịch khám</h2>
            <Row gutter={16}>
              {[
                {
                  icon: <FaSearch size={40} color="#0A69A3" />,
                  text: "Bước 1: Tìm kiếm chuyên khoa hoặc bác sĩ",
                },
                {
                  icon: <FaCalendarAlt size={40} color="#0A69A3" />,
                  text: "Bước 2: Chọn ngày khám và khung giờ phù hợp",
                },
                {
                  icon: <FaWallet size={40} color="#0A69A3" />,
                  text: "Bước 3: Thanh toán (online hoặc tiền mặt)",
                },
                {
                  icon: <MdEventAvailable size={40} color="#0A69A3" />,
                  text: "Bước 4: Khám đúng hẹn và nhận kết quả",
                },
              ].map((step, idx) => (
                <Col
                  key={idx}
                  xs={24}
                  sm={12}
                  md={12}
                  lg={6}
                  data-aos="zoom-in-up"
                  data-aos-duration="1000"
                  data-aos-easing="ease-in-out"
                  data-aos-delay={idx * 100}
                >
                  <div className="how-step" data-step={idx + 1}>
                    <div className="icon">{step.icon}</div>
                    <p>{step.text}</p>
                  </div>
                </Col>
              ))}
            </Row>
          </div>
        </section>

        {/* --- CHUYÊN KHOA --- */}
        <section
          className="danh-cho-ban"
          data-aos="fade-up"
          data-aos-duration="1000"
          data-aos-easing="ease-in-out"
        >
          <div className="ben-trong">
            <div className="section-header">
              <h2 className="section-title">Chuyên khoa</h2>
              <button
                className="see-more-btn"
                onClick={() => navigate("/chuyen-khoa-kham")}
              >
                Xem thêm
              </button>
            </div>
            <Slider
              slidesToShow={Math.min(4, dataChuyenKhoa.length)}
              slidesToScroll={1}
              arrows
              infinite={false}
              responsive={[
                { breakpoint: 1200, settings: { slidesToShow: 3 } },
                { breakpoint: 992, settings: { slidesToShow: 2 } },
                { breakpoint: 576, settings: { slidesToShow: 1 } },
              ]}
              className="custom-slider"
            >
              {loadingCard ? (
                <CardSkeleton count={4} />
              ) : (
                formatItems(dataChuyenKhoa, "specialty").map((item) => (
                  <div key={item.id} className="slider-item">
                    <SpecialtyCard
                      imageSrc={item.src}
                      title={item.txtP}
                      description={item.txtB}
                      onClick={() =>
                        navigate(`/chuyen-khoa/${item.id}`, {
                          state: { specialtyId: item.id },
                        })
                      }
                    />
                  </div>
                ))
              )}
            </Slider>
          </div>
        </section>

        {/* --- BÁC SĨ --- */}
        <section
          className="danh-cho-ban"
          style={{
            backgroundImage: `url('/public/assets/images/Banner_2.jpg')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          <div
            className="ben-trong"
            data-aos="fade-left"
            data-aos-duration="1000"
            data-aos-easing="ease-in-out"
          >
            <div className="section-header">
              <h2 className="section-title">Bác sĩ nổi bật</h2>
              <button
                className="see-more-btn"
                onClick={() => navigate("/doctor/")}
              >
                Xem thêm
              </button>
            </div>
            <Slider
              slidesToShow={Math.min(4, dataBacSi.length)}
              slidesToScroll={1}
              arrows
              infinite={false}
              responsive={[
                { breakpoint: 1200, settings: { slidesToShow: 3 } },
                { breakpoint: 992, settings: { slidesToShow: 2 } },
                { breakpoint: 576, settings: { slidesToShow: 1 } },
              ]}
              className="custom-slider"
            >
              {loadingCard ? (
                <CardSkeleton count={4} />
              ) : (
                formatItems(dataBacSi, "doctor").map((item) => (
                  <div key={item.id} className="slider-item">
                    <DoctorCard
                      key={item.id}
                      imageSrc={item.src}
                      title={item.txtP}
                      description={item.txtB}
                      onClick={() => navigate(`/doctor/${item.id}`)}
                      type="doctor"
                    />
                  </div>
                ))
              )}
            </Slider>
          </div>
        </section>

        {/* --- BÀI VIẾT --- */}
        <section
          className="danh-cho-ban"
          data-aos="flip-up"
          data-aos-duration="1000"
          data-aos-easing="ease-in-out"
        >
          <div className="ben-trong">
            <div className="section-header">
              <h2 className="section-title">Bài viết nổi bật</h2>
              <button
                className="see-more-btn"
                onClick={() => navigate("/bai-viet")}
              >
                Xem thêm
              </button>
            </div>
            <Slider
              slidesToShow={Math.min(3, articles.length)}
              slidesToScroll={1}
              arrows
              infinite={false}
              responsive={[
                { breakpoint: 1200, settings: { slidesToShow: 3 } },
                { breakpoint: 992, settings: { slidesToShow: 2 } },
                { breakpoint: 576, settings: { slidesToShow: 1 } },
              ]}
              className="custom-slider"
            >
              {loadingCard ? (
                <CardSkeleton count={3} />
              ) : (
                formatArticles(articles).map((article) => (
                  <div key={article._id} className="slider-item">
                    <ArticleCard
                      article={article}
                      onClick={() => navigate(`/bai-viet/${article.slug}`)}
                    />
                  </div>
                ))
              )}
            </Slider>
          </div>
        </section>
        {/* --- TESTIMONIALS --- */}
        <section
          className="danh-cho-ban testimonials"
          data-aos="fade-up"
          data-aos-duration="1000"
          data-aos-easing="ease-in-out"
        >
          <div className="ben-trong">
            <h2 className="section-title">Cảm nhận từ bệnh nhân</h2>
            <div className="testimonial-slider">
              <Slider slidesToShow={1} arrows dots infinite>
                {[
                  {
                    name: "Nguyễn Văn A",
                    feedback: "Dịch vụ rất tốt, bác sĩ tư vấn nhiệt tình.",
                  },
                  {
                    name: "Trần Thị B",
                    feedback: "Đặt lịch nhanh chóng, khám chữa chu đáo.",
                  },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="testimonial-card"
                    data-aos="fade-in"
                  >
                    <p>"{item.feedback}"</p>
                    <Avatar
                      src={`/public/assets/images/user${idx + 1}.jpg`}
                      size={80}
                      shape="circle"
                      alt="Avatar"
                    />
                    <h4>- {item.name}</h4>
                  </div>
                ))}
              </Slider>
            </div>
          </div>
        </section>

        {/* --- CTA SECTION --- */}
        <section
          className="danh-cho-ban cta-section"
          data-aos="zoom-in"
          style={{
            backgroundImage: `url('/public/assets/images/slide-5.jpg')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          <div className="cta-box">
            <h2>Bắt đầu hành trình chăm sóc sức khỏe ngay hôm nay</h2>
            <button onClick={() => navigate("/chuyen-khoa-kham")}>
              Đặt khám ngay
            </button>
          </div>
        </section>
      </div>
    </>
  );
};

export default BodyHomePage;
