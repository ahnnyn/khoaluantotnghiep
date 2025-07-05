import { Col, Row } from "antd";
import "./bodyHomePage.scss";
import HinhChuNhat from "components/Shapes/HinhChuNhat";
import HinhVuongSlider from "components/Shapes/HinhVuongSlicer";
import { useEffect, useState } from "react";
import { FiVideo } from "react-icons/fi";
import { FaClinicMedical, FaBrain } from "react-icons/fa";
import { GiFruitBowl } from "react-icons/gi";
import {
  fetchAllDepartments,
  fetchAllBacSi,
} from "services/patient/patient.services";
import { useNavigate } from "react-router-dom";

const BodyHomePage = () => {
  const [dataChuyenKhoa, setDataChuyenKhoa] = useState([]);
  const [dataBacSi, setDataBacSi] = useState([]);
  const [loadingCard, setLoadingCard] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      await listChuyenKhoa();
      await listBacSi();
    };

    fetchData();
  }, []);

  const items_toandien = [
    {
      icon: <FaClinicMedical size={40} color="blue" />,
      txtP: "Đặt khám tại bệnh viện",
      redirect: "/chuyen-khoa-kham",
    },
    {
      icon: <FiVideo size={40} color="blue" />,
      txtP: "Tư vấn sức khỏe trực tuyến",
      redirect: "/chuyen-khoa-kham",
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

  const listChuyenKhoa = async () => {
    setLoadingCard(true);
    try {
      const response = await fetchAllDepartments();
      console.log("Dữ liệu chuyên khoa:", response);
      if (response?.data) {
        setDataChuyenKhoa(response.data);
        console.log("Dữ liệu chuyên khoa:", response.data);
      }
    } catch (error) {
      console.error("Lỗi khi lấy danh sách chuyên khoa:", error);
    } finally {
      setLoadingCard(false);
    }
  };

  const listBacSi = async () => {
    try {
      const response = await fetchAllBacSi();
      console.log("Dữ liệu bác sĩ:", response);
      if (response?.data) {
        setDataBacSi(response.data); // CHỈ .data là đủ
      }
    } catch (error) {
      console.error("Lỗi khi lấy danh sách bác sĩ:", error);
    }
  };

  const items_ChuyenKhoa = dataChuyenKhoa.map((chuyenKhoa) => ({
    id: chuyenKhoa.maKhoa,
    hinhAnh: chuyenKhoa.hinhAnh, // Nếu có `hinhAnh`, hoặc fallback về ảnh mặc đ��nh
    src: `${import.meta.env.VITE_BACKEND_URL}/public/chuyenkhoa/${
      chuyenKhoa.hinhAnh
    }`,
    txtP: chuyenKhoa.tenKhoa,
    // Có thể thêm `src` nếu bạn muốn hiển thị ảnh chuyên khoa
  }));

  const items_BacSi = dataBacSi.map((bacSi) => ({
    id: bacSi.maBacSi,
    hinhAnh: bacSi.hinhAnh,
    src: `${import.meta.env.VITE_BACKEND_URL}/public/bacsi/${bacSi.hinhAnh}`,
    txtP: bacSi.hoTen,
    txtB: bacSi.tenKhoa || "Chuyên khoa chưa rõ", // nếu có `tenKhoa`, hoặc fallback
  }));

  const handleRedirectChuyenKhoa = (idChuyenKhoa) => {
    navigate(`/chi-tiet-chuyen-khoa?maKhoa=${idChuyenKhoa}`);
  };

  const handleRedirectBacSi = (idBacSi) => {
    navigate(`/chi-tiet-bac-si?maBacSi=${idBacSi}`);
  };

  return (
    <>
      <div style={{ height: "clamp(2rem, 10vh, 5rem)" }}></div>{" "}
      {/* chèn khoảng cách đẩy nội dung xuống dưới header */}
      <div
        className="slicer-banner"
        style={{
          position: "relative",
          width: "100%",
          overflow: "hidden",
          paddingTop: "50px",
        }}
      >
        <img
          src="../../public/Blue_White_Minimalist_Hospital_Service_Health_Banner.png"
          alt="Slicer Banner"
          style={{
            width: "100%",
            height: "auto", // để giữ đúng tỷ lệ ảnh
            objectFit: "cover",
            borderRadius: "0 0 20px 20px",
            display: "block",
          }}
        />
      </div>
      <div className="danh-cho-ban">
        <Row className="ben-trong">
          <span
            style={{
              fontWeight: 500,
              fontSize: "clamp(25px, 5vw, 32px)",
              width: "100%",
              padding: "4vh 0",
              zIndex: "50",
            }}
          >
            Dịch vụ
          </span>
          <Row gutter={[0, 24]} justify="space-around">
            {items_toandien.map((item, index) => (
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
                // style={{ marginBottom: "2vh" }}
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

      <div className="danh-cho-ban">
        <Row className="ben-trong">
          <div
            style={{
              display: "flex",
              width: "100%",
              justifyContent: "space-between",
            }}
          >
            <span
              style={{
                fontWeight: 500,
                fontSize: "clamp(25px, 5vw, 32px)",
                padding: "4vh 0",
              }}
            >
              Chuyên khoa
            </span>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 500,
                fontSize: "clamp(18px, 2.5vw, 20px)",
                height: "50px",
                lineHeight: "clamp(36px, 5vh, 48px)",
                borderRadius: "15px",
                textAlign: "center",
                backgroundColor: "#d0edf7",
                color: "rgb(45 145 179)",
                marginTop: "10px",
                cursor: "pointer",
                padding: "clamp(4px, 0.8vw, 8px) clamp(12px, 2vw, 20px)",
              }}
              onClick={() => navigate("/chuyen-khoa-kham")}
            >
              Xem thêm
            </span>
          </div>
          <HinhVuongSlider
            items={items_ChuyenKhoa}
            style={{
              width: "100%",
              height: "300px",
              background: "linear-gradient(135deg, #E3F2FD, #F5F8FF)",
              padding: "20px",
            }}
            loadingCard={loadingCard}
            urlDoctor={handleRedirectChuyenKhoa}
            type="specialty"
          />
        </Row>
      </div>

      <div className="danh-cho-ban">
        <Row className="ben-trong">
          <div
            style={{
              display: "flex",
              width: "100%",
              justifyContent: "space-between",
            }}
          >
            <span
              style={{
                fontWeight: 500,
                fontSize: "clamp(25px, 5vw, 32px)",
                padding: "4vh 0",
              }}
            >
              Bác sĩ nổi bật
            </span>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 500,
                fontSize: "clamp(18px, 2.5vw, 20px)",
                height: "50px",
                lineHeight: "clamp(36px, 5vh, 48px)",
                borderRadius: "15px",
                textAlign: "center",
                backgroundColor: "#d0edf7",
                color: "rgb(45 145 179)",
                marginTop: "10px",
                cursor: "pointer",
                padding: "clamp(4px, 0.8vw, 8px) clamp(12px, 2vw, 20px)",
              }}
              onClick={() => navigate("/bac-si-noi-bat")}
            >
              Xem thêm
            </span>
          </div>
          <HinhVuongSlider
            items={items_BacSi}
            style={{
              width: "100%",
              height: "300px",
              background: "linear-gradient(135deg, #E3F2FD, #F5F8FF)",
              padding: "20px",
            }}
            loadingCard={loadingCard}
            urlDoctor={handleRedirectBacSi}
            type="doctor"
          />
        </Row>
      </div>
      <div style={{ marginBottom: "clamp(20px, 5vw, 100px)" }}></div>
      {/* </div> */}
    </>
  );
};

export default BodyHomePage;
