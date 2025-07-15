import { Carousel, Button } from "antd";
import { useNavigate } from "react-router-dom";
import "./HeroBanner.scss";

const HeroBanner = () => {
  const navigate = useNavigate();

  const banners = [
    "/assets/images/healio_main.png",
    "/assets/images/slide-healthcare-slide1.jpg",
  ];

  return (
    <section className="hero-banner">
      <Carousel autoplay autoplaySpeed={3000} effect="fade" dots>
        {banners.map((img, index) => (
          <div key={index} className="banner-slide">
            <img src={img} alt={`Banner ${index + 1}`} className="banner-img" />
            <div className="hero-overlay">
              <div className="floating-container">
                <h1>Chăm sóc sức khỏe dễ dàng cùng Healio</h1>
                <p>Đặt khám với bác sĩ uy tín chỉ trong vài bước</p>
                <Button
                  type="primary"
                  className="hero-cta"
                  onClick={() => navigate("/chuyen-khoa-kham")}
                >
                  Đặt lịch ngay
                </Button>
              </div>
            </div>
          </div>
        ))}
      </Carousel>
    </section>
  );
};

export default HeroBanner;
