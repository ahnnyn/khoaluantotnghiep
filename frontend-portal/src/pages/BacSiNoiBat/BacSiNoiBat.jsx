import { Avatar, Col, Row, Select } from "antd";
import Footer from "components/Footer/Footer";
import Header from "components/Header/Header";
import { IoHomeSharp } from "react-icons/io5";
import { UserOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { fetchAllDoctor } from "services/patient/patient.services";
import { useNavigate } from "react-router-dom";
import SearchComponent from "components/SearchComponent/SearchComponent";

const BacSiNoiBat = () => {
  const [dataAllDoctor, setDataAllDoctor] = useState([]);
  const [dataSearch, setDataSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("tatca"); // Default value "tatca"

  const navigate = useNavigate();

  useEffect(() => {
    fetchListDoctor(dataSearch, selectedStatus);
  }, [dataSearch, selectedStatus]);

  const fetchListDoctor = async (search = "", status = "tatca") => {
    try {
      let res = await fetchAllDoctor(""); // Luôn lấy tất cả để lọc frontend

      console.log("res", res);

      if (res && res.data && Array.isArray(res.data)) {
        let filteredData = res.data;

        // 1. Kiểm tra điều kiện lọc theo hình thức khám chỉ khi không chọn "Tất cả"
        if (status !== "tatca") {
          filteredData = filteredData.filter((item) => {
            const hinhThucArr =
              item?.hinhThucKham?.toLowerCase().split(",") || [];

            if (status === "chuyenkhoa") {
              return hinhThucArr.includes("chuyên khoa");
            } else if (status === "tructuyen") {
              return hinhThucArr.includes("trực tuyến");
            }
            return true; // Điều này sẽ bảo đảm giữ lại những bác sĩ có hình thức khác nếu cần
          });
        }

        // 2. Lọc theo từ khóa tìm kiếm (nếu có)
        if (search) {
          const keyword = search.toLowerCase();
          filteredData = filteredData.filter((item) =>
            item?.hoTen?.toLowerCase().includes(keyword)
          );
        }

        // Nếu không có bác sĩ nào sau khi lọc, xử lý trường hợp này
        if (filteredData.length === 0) {
          setDataAllDoctor([]); // Hoặc thông báo không có bác sĩ
        } else {
          setDataAllDoctor(filteredData); // Cập nhật danh sách bác sĩ
        }
      } else {
        setDataAllDoctor([]); // Trường hợp không có dữ liệu
      }
    } catch (error) {
      console.error("Lỗi khi gọi API:", error);
      setDataAllDoctor([]); // Xử lý khi có lỗi
    }
  };

  const handleRedirectDoctor = (maBacSi, hinhThucKham) => {
    navigate(
      `/chi-tiet-bac-si?maBacSi=${maBacSi}&hinhThucKham=${hinhThucKham}`
    );
  };

  const onSearch = (value) => {
    setDataSearch(value || "");
  };

  const handleStatusFilter = (value) => {
    setSelectedStatus(value);
  };

  return (
    <>
      <Row style={{ marginTop: "120px" }}></Row>
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
              src="../../public/banner_3-removebg-preview.png"
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
          <Row gutter={[20, 25]}>
            <Col span={24}>
              <p className="txt-title">
                <IoHomeSharp /> / Bác sĩ nổi bật
              </p>
            </Col>
            <Col span={6}>
              <p className="title-lichhen">Bác sĩ nổi bật</p>
            </Col>
            <Col span={18}></Col>
            <Col xs={6}>
              <Select
                value={selectedStatus}
                onChange={handleStatusFilter}
                style={{ width: "100%" }}
                options={[
                  { value: "tatca", label: "Tất cả" },
                  { value: "chuyenkhoa", label: "Chuyên khoa" },
                  { value: "tructuyen", label: "Trực tuyến" },
                ]}
              />
            </Col>
            <Col span={18}>
              <SearchComponent
                placeholder="Tìm kiếm tên bác sĩ"
                onSearch={onSearch}
              />
            </Col>

            {dataAllDoctor?.length > 0 ? (
              dataAllDoctor?.map((item, index) => (
                <Col
                  key={index}
                  span={24}
                  style={{ padding: "10px 15px 0", cursor: "pointer" }}
                  onClick={() =>
                    handleRedirectDoctor(item.maBacSi, selectedStatus)
                  }
                >
                  <Row>
                    <Col span={3}>
                      <Avatar
                        style={{ border: "1px solid green" }}
                        src={`${
                          import.meta.env.VITE_BACKEND_URL
                        }/public/bacsi/${item?.hinhAnh}`}
                        shape="square"
                        size={120}
                        icon={<UserOutlined />}
                      />
                    </Col>
                    <Col span={21} className="box-title-doctor">
                      <span className="txt-Title-doctor-noi-bat">
                        <span style={{ color: "navy" }}>{item?.hoTen}</span>
                      </span>
                      <br />
                      <span className="title-nho">
                        {(Array.isArray(item?.tenKhoa)
                          ? item.tenKhoa
                          : [item?.tenKhoa]
                        ).join(", ")}
                      </span>
                    </Col>
                  </Row>
                  <hr style={{ border: "1px solid rgb(243, 243, 243)" }} />
                </Col>
              ))
            ) : (
              <Col span={24} style={{ textAlign: "center", padding: "20px" }}>
                <p style={{ color: "gray", fontSize: "18px" }}>
                  Không tìm thấy bác sĩ nào.
                </p>
              </Col>
            )}
          </Row>
        </Col>
      </Row>
      <Row style={{ marginBottom: "150px" }}></Row>
    </>
  );
};

export default BacSiNoiBat;
