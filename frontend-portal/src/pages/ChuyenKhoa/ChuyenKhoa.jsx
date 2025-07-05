import { Avatar, Col, Row } from "antd";
import Footer from "components/Footer/Footer";
import Header from "components/Header/Header";
import { IoHomeSharp } from "react-icons/io5";
import { UserOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { fetchAllDepartments } from "services/patient/patient.services"; 
import { useNavigate } from "react-router-dom";
import SearchComponent from "components/SearchComponent/SearchComponent";
import { useLocation } from "react-router-dom";

const ChuyenKhoa = () => {
  const [dataAllDoctor, setDataAllDoctor] = useState([]);
  const navigate = useNavigate();
  const [dataSearch, setDataSearch] = useState("");
  const location = useLocation(); // Lấy location
  const queryParams = new URLSearchParams(location.search);
  const hinhThucKham = queryParams.get("hinhThucKham");
  console.log("Hình thức khám:", hinhThucKham); // Kiểm tra giá trị của hinhThucKham

  // useEffect(() => {
  //   fetchListDoctor(dataSearch);
  // }, [dataSearch]);

  const handleRedirectChuyenKhoa = (maKhoa) => {
    if (hinhThucKham) {
      navigate(
        `/chi-tiet-chuyen-khoa?maKhoa=${maKhoa}&hinhThucKham=${encodeURIComponent(
          hinhThucKham
        )}`
      );
    } else {
      navigate(`/chi-tiet-chuyen-khoa?maKhoa=${maKhoa}`);
    }
  };

  const onSearch = (value) => {
    console.log("Giá trị tìm kiếm:", value); // Thêm log này

    setDataSearch(value || "");
  };

  return (
    <>
      <Header />
      <Row style={{ marginBottom: "120px" }}></Row>
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
              src="../../public/banner_1-removebg-preview.png"
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

      <Row>
        <Col span={18} className="col-body">
          <Row>
            <Col span={24}>
              <p className="txt-title">
                <IoHomeSharp /> / Chuyên khoa khám
              </p>
              {/* <Divider/> */}
              {/* <hr style={{border: "1px solid rgb(243, 243, 243)"}} /> */}
            </Col>
            <Col span={24}>
              <p className="title-lichhen"> Chuyên khoa khám</p>
            </Col>
            <Col span={24} style={{ marginBottom: "20px" }}>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <div style={{ width: "800px" }}>
                  <SearchComponent
                    placeholder="Tìm kiếm Chuyên khoa"
                    onSearch={onSearch}
                  />
                </div>
              </div>
            </Col>

            {dataAllDoctor?.length > 0 ? (
              dataAllDoctor.map((item, index) => (
                <Col
                  key={index}
                  span={24}
                  style={{ padding: "10px 15px 0", cursor: "pointer" }}
                  onClick={() => handleRedirectChuyenKhoa(item.maKhoa)}
                >
                  <Row>
                    <Col xs={6} sm={5} md={3}>
                      <Avatar
                        style={{
                          width: "clamp(60px, 10vw, 110px)",
                          height: "clamp(60px, 10vw, 110px)",
                          border: "1px solid green",
                        }}
                        src={`${
                          import.meta.env.VITE_BACKEND_URL
                        }/public/chuyenkhoa/${item?.hinhAnh}`}
                        shape="square"
                        icon={<UserOutlined />}
                      />
                    </Col>
                    <Col xs={18} sm={19} md={21} className="box-title-doctor">
                      <span
                        className="txt-Title-doctor-noi-bat"
                        style={{ fontSize: "clamp(16px, 5vw, 22px)" }}
                      >
                        {item.tenKhoa}
                      </span>{" "}
                      <br />
                    </Col>
                  </Row>
                  <hr style={{ border: "1px solid rgb(243, 243, 243)" }} />
                </Col>
              ))
            ) : (
              <Col span={24} style={{ textAlign: "center", padding: "20px" }}>
                <p style={{ color: "gray", fontSize: "18px" }}>
                  Chưa có chuyên khoa khám nào.
                </p>
              </Col>
            )}
          </Row>
        </Col>
      </Row>
      <Row style={{ marginBottom: "150px" }}></Row>

      <Footer />
    </>
  );
};
export default ChuyenKhoa;
