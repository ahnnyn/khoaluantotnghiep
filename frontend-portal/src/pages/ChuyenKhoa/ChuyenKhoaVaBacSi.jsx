import {
  Avatar,
  Button,
  Col,
  Drawer,
  Row,
  Select,
  Form,
  DatePicker,
  Radio,
  Alert,
  Card,
} from "antd";
import Footer from "components/Footer/Footer";
import Header from "components/Header/Header";
import "../QuanLyLichHen/lichhen.scss";
import { IoHomeSharp } from "react-icons/io5";
import { DownOutlined, PhoneOutlined, UserOutlined } from "@ant-design/icons";
import { useEffect, useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { InfoCircleOutlined } from "@ant-design/icons";
import {
  FaRegCalendarAlt,
  FaRegHandPointUp,
} from "react-icons/fa";
import {
  fetchDepartmentByID,
  fetchBacSiByMaBS,
  fetchBacSiByChuyenKhoa,
  getTimeSlotsByDoctor,
} from "services/patient/patient.services";
import moment from "moment";
import styled, { keyframes } from "styled-components";
import { MailOutlined } from "@ant-design/icons";
import "./chuyenkhoa.css";

const shake = keyframes`
    0% { transform: translateX(0); }
    25% { transform: translateX(-5px); }
    50% { transform: translateX(5px); }
    75% { transform: translateX(-5px); }
    100% { transform: translateX(0); }
`;

const ShakeLink = styled.a`
  color: blue;
  font-weight: 500;
  font-size: 16px;
  cursor: pointer;
  font-style: italic;
  animation: ${shake} 0.5s ease-in-out infinite;
`;

const ChuyenKhoaVaBacSi = () => {
  const location = useLocation();
  const navigate = useNavigate();

  let params = new URLSearchParams(location.search);
  const maKhoa = params.get("maKhoa"); // Lấy giá trị của tham số "maKhoa"
  console.log("check id chuyen khoa: ", maKhoa);

  const [dataChuyenKhoaByID, setDataChuyenKhoaByID] = useState(null);
  const [dataBacSiByChuyenKhoa, setDataBacSiByChuyenKhoa] = useState([]);
  const [dataLichLamViec, setDataLichLamViec] = useState([]);
  const [dataBacSi, setDataBacSi] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTimeId, setSelectedTimeId] = useState(null);
  const [selectedBacSi, setSelectedBacSi] = useState(null);
  const [showDetails, setShowDetails] = useState({});
  const [open, setOpen] = useState(false);
  const [hienThiTime, setHienThiTime] = useState("Chọn ngày khám!");
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [khungGio, setkhungGio] = useState([]);
  const queryParams = new URLSearchParams(location.search);
  const hinhThucKhamFromUrl = queryParams.get("hinhThucKham");
  const [selectedHinhThucKham, setSelectedHinhThucKham] =
    useState("chuyenkhoa");

  const hienThiHinhThuc = {
    chuyenkhoa: "Chuyên khoa",
    tructuyen: "Trực tuyến",
  };

  const hinhThucKhamListFromUrl = hinhThucKhamFromUrl
    ? hinhThucKhamFromUrl.split(",").map((s) => s.trim())
    : [];
  const fetchChuyenKhoaByMaKhoa = async (maKhoa) => {
    const res = await fetchChuyenKhoaByID(maKhoa);
    console.log("res chuyên khoa: ", res);
    if (res && res.data) {
      setDataChuyenKhoaByID(res.data);
    }
  };

  console.log("dataChuyenKhoaByID: ", dataChuyenKhoaByID);

  const fetchBacSiByKhoa = async (maKhoa) => {
    const res = await fetchBacSiByChuyenKhoa(maKhoa);
    console.log("res bác sĩ: ", res);
    if (res && res.bacSiList) {
      setDataBacSiByChuyenKhoa([...res.bacSiList]); // Spread operator để cập nhật state đúng cách
    }
  };

  // Hàm loại bỏ dấu và chuẩn hóa chuỗi
  const normalize = (str) =>
    str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/\s+/g, ""); // bỏ khoảng trắng

  const bacSiFilter = useMemo(() => {
    if (hinhThucKhamFromUrl) {
      return dataBacSiByChuyenKhoa.filter((bs) => {
        const hinhThucList = bs.hinhThucKhamList
          ?.split(",")
          .map((s) => normalize(s.trim()));
        return hinhThucList?.includes(normalize(hinhThucKhamFromUrl));
      });
    }
    return dataBacSiByChuyenKhoa || [];
  }, [dataBacSiByChuyenKhoa, hinhThucKhamFromUrl]);

  const fetchBacSiByID = async (maBacSi) => {
    const res = await fetchBacSiByMaBS(maBacSi);
    console.log("res: ", res.data);
    if (res && res.data) {
      setDataBacSi(res.data);
    }
  };

  useEffect(() => {
    if (!selectedBacSi?.maBacSi) return;
    fetchBacSiByID(selectedBacSi.maBacSi);
  }, [selectedBacSi]);

  useEffect(() => {
    fetchChuyenKhoaByMaKhoa(maKhoa);
    fetchBacSiByKhoa(maKhoa);
  }, [maKhoa]);

  // const fetchKhungGioKhamBacSi = async (maBacSi, date) => {
  //     const res = await getTimeSlotsByDoctorAndDate(maBacSi, date);
  //     if (Array.isArray(res)) {
  //         setDataLichLamViec(res);
  //     } else {
  //         console.error("Lỗi khi lấy lịch khám:", await res?.json?.());
  //     }
  // };

  const fetchKhungGioKhamBacSi = async (maBacSi) => {
    const res = await getTimeSlotsByDoctor(maBacSi);
    if (Array.isArray(res)) {
      setDataLichLamViec(res);
    } else {
      console.error("Lỗi khi lấy lịch khám:", await res?.json?.());
    }
  };

  console.log("dataLichLamViec: ", dataLichLamViec);

  useEffect(() => {
    if (selectedBacSi) {
      setDataLichLamViec([]); // Reset lịch làm việc cũ
      fetchKhungGioKhamBacSi(selectedBacSi.maBacSi); // Lấy lịch khám mới
      setHienThiTime("Chọn ngày khám!"); // Reset ngày khám
    }
  }, [selectedBacSi]); // Lắng nghe thay đổi của bác sĩ

  console.log("dataBacSiByChuyenKhoa: ", dataBacSiByChuyenKhoa);

  useEffect(() => {
    console.log("Cập nhật danh sách bác sĩ: ", dataBacSiByChuyenKhoa);
  }, [dataBacSiByChuyenKhoa]);

  const onChange = (value) => {
    console.log(`selected ${value}`);
  };
  const onSearch = (value) => {
    console.log("search:", value);
  };

  const showDrawer = (doctor) => {
    setOpen(true);
    setSelectedBacSi(doctor);
    setSelectedTimeId(null);
    setHienThiTime("Chọn ngày khám!");
    setkhungGio([]); // Reset khung giờ khi bác sĩ thay đổi
  };

  useEffect(() => {
    // Khi hình thức khám thay đổi, reset lại ngày khám
    setHienThiTime("Chọn ngày khám!");
    setSelectedTimeId(null); // Reset lại thời gian đã chọn
    setkhungGio([]); // Reset lại khung giờ
  }, [selectedHinhThucKham]); // Lắng nghe sự thay đổi của hình thức khám

  const onClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (
      hinhThucKhamFromUrl &&
      (hinhThucKhamFromUrl === "tructuyen" ||
        hinhThucKhamFromUrl === "chuyenkhoa")
    ) {
      const newSelected = {};
      dataBacSiByChuyenKhoa?.forEach((item) => {
        if (!selectedHinhThucKham[item.maBacSi]) {
          newSelected[item.maBacSi] = hinhThucKhamFromUrl;
        }
      });
      setSelectedHinhThucKham((prev) => ({ ...prev, ...newSelected }));
    }
  }, [dataBacSiByChuyenKhoa]);
  const englishToVietnameseDays = {
    Sunday: "Chủ nhật",
    Monday: "Thứ 2",
    Tuesday: "Thứ 3",
    Wednesday: "Thứ 4",
    Thursday: "Thứ 5",
    Friday: "Thứ 6",
    Saturday: "Thứ 7",
  };

  const toggleDetails = (doctorId) => {
    setShowDetails((prevState) => ({
      ...prevState,
      [doctorId]: !prevState[doctorId], // Toggle the specific doctor's details
    }));
  };

  const styleTime = (index) => ({
    cursor: "pointer",
    fontSize: "18px",
    color: hoveredIndex === index ? "red" : "black", // Đổi màu chữ khi hover
  });

  // Lấy ngày hiện tại (không tính thời gian)
  const today = moment().startOf("day");

  console.log("dataLichLamViec: ", dataLichLamViec);

  const formatCurrency = (value) => {
    if (value === null || value === undefined) return "";

    const number = parseInt(value, 10); // loại bỏ phần thập phân nếu có
    return `${number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} VNĐ`;
  };

  console.log("selectedBacSi: ", selectedBacSi);

  const handleRedirectViewBacSi = (maBacSi) => {
    if (!maBacSi) {
      console.error("Lỗi: maBacSi không tồn tại!", maBacSi);
      return;
    }
    navigate(`/chi-tiet-bac-si?maBacSi=${maBacSi}`);
  };

  const handleRedirectBacSi = (
    item,
    idKhungGio,
    thoiGianKhamBenh,
    selectedDate,
    giaKham,
    hinhThucKham
  ) => {
    const formattedDate = moment(selectedDate, "YYYY-MM-DD").format(
      "YYYY-MM-DD"
    );
    navigate(
      `/page-dat-lich-kham?id=${item.maBacSi}&idGioKhamBenh=${idKhungGio}&khungGioKham=${thoiGianKhamBenh}&ngayKham=${formattedDate}&giaKham=${giaKham}&hinhThucKham=${hinhThucKham}`
    );
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

          <Col xs={24} md={12} className="z-0 flex justify-end">
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
          <Row
            style={{
              backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.8)), url(${
                import.meta.env.VITE_BACKEND_URL
              }/uploads/${dataChuyenKhoaByID?.image})`,
              backgroundSize: "contain", // Adjust to 'contain' or use specific values
              backgroundRepeat: "no-repeat", // Prevent the image from repeating
              backgroundPosition: "center",
            }}
          >
            <Col span={24}>
              <p className="txt-title">
                <IoHomeSharp /> / Khám chuyên khoa
                <span style={{ marginLeft: "5px" }}>
                  {" "}
                  / {dataChuyenKhoaByID?.tenKhoa}
                </span>
              </p>

              {/* <Divider/> */}
              {/* <hr style={{border: "1px solid rgb(243, 243, 243)"}} /> */}
            </Col>
            <Col span={24}>
              <span className="title-lichhen">
                {" "}
                {dataChuyenKhoaByID?.tenKhoa}
              </span>
            </Col>
            <Col span={24}>
              <Card
                title={
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      fontSize: "22px",
                      fontWeight: "bold",
                      color: "#33c7d8",
                      gap: "8px",
                    }}
                  >
                    <InfoCircleOutlined />
                    Mô tả chuyên khoa
                  </div>
                }
                bordered={false}
                style={{
                  margin: "20px",
                  borderRadius: "10px",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                }}
                bodyStyle={{
                  fontSize: "16px",
                  lineHeight: "1.8",
                  color: "#333",
                  padding: "20px",
                  backgroundColor: "#fdfdfd",
                }}
              >
                <div
                  dangerouslySetInnerHTML={{ __html: dataChuyenKhoaByID?.moTa }}
                />
              </Card>

              {hinhThucKhamListFromUrl.length > 0 && (
                <Card
                  style={{
                    margin: "20px 15px",
                    background: "#f0f9ff",
                    borderLeft: "5px solid #33c7d8",
                    borderRadius: "10px",
                  }}
                  bodyStyle={{ padding: "12px 20px" }}
                >
                  <div style={{ fontSize: "17px", fontWeight: 500 }}>
                    Danh sách các bác sĩ có lịch khám{" "}
                    <span style={{ color: "#33c7d8" }}>
                      {hinhThucKhamListFromUrl
                        .map((ht) => hienThiHinhThuc[ht] || ht)
                        .join(", ")}
                    </span>
                  </div>
                </Card>
              )}
            </Col>
          </Row>
        </Col>
      </Row>
      <br />
      <Row>
        <Col span={24} className="view-body-xem-lich-ck">
          <Row>
            <Col
              span={18}
              className="col-body"
              style={{
                backgroundColor: "rgb(247, 246, 246)",
                padding: "20px 10px",
              }}
            >
              {bacSiFilter?.length > 0 ? (
                bacSiFilter.map((item, index) => (
                  <Col
                    key={item.maBacSi}
                    span={24}
                    className="box-lich-kham"
                    style={{ backgroundColor: "white" }}
                  >
                    <Row>
                      <Col span={13}>
                        <Row>
                          <Col span={4}>
                            <Avatar
                              style={{ cursor: "pointer" }}
                              onClick={() =>
                                handleRedirectViewBacSi(item.maBacSi)
                              }
                              src={`${
                                import.meta.env.VITE_BACKEND_URL
                              }/public/bacsi/${item?.hinhAnh}`}
                              size={80}
                              icon={<UserOutlined />}
                            />
                          </Col>
                          <Col span={19}>
                            <p
                              className="txt-bacsi colors"
                              style={{ cursor: "pointer" }}
                              onClick={() => {
                                console.log("Bác sĩ được chọn:", item);
                                console.log(
                                  "Mã bác sĩ được chọn:",
                                  item.maBacSi
                                );
                                handleRedirectViewBacSi(item.maBacSi);
                              }}
                            >
                              {item?.hoTen}
                            </p>
                            <p
                              style={{
                                fontSize: "15px",
                                lineHeight: "22px",
                                paddingLeft: "10px",
                              }}
                              dangerouslySetInnerHTML={{ __html: item?.moTa }}
                            />

                            <p style={{ fontSize: "15px" }}>
                              <PhoneOutlined
                                style={{ fontSize: 16, color: "#DB4437" }}
                              />
                              <span style={{ marginLeft: "3px" }}>
                                {item?.soDT}
                              </span>
                              &nbsp; - &nbsp;
                              <MailOutlined
                                style={{ fontSize: 16, color: "#DB4437" }}
                              />
                              <span style={{ marginLeft: "3px" }}>
                                {" "}
                                {item?.email}
                              </span>
                            </p>
                          </Col>
                        </Row>
                      </Col>

                      <Col
                        span={11}
                        style={{ borderLeft: "2px solid #f4f4f4" }}
                      >
                        <Row style={{ marginLeft: "15px" }}>
                          <Col span={24}>
                            <Radio.Group
                              value={
                                selectedHinhThucKham[item.maBacSi] ??
                                (hinhThucKhamFromUrl === "tructuyen" ||
                                hinhThucKhamFromUrl === "chuyenkhoa"
                                  ? hinhThucKhamFromUrl
                                  : "chuyenkhoa")
                              }
                              onChange={(e) => {
                                const newValue = e.target.value;
                                console.log(
                                  "Hình thức khám cho bác sĩ này:",
                                  newValue
                                );

                                setSelectedHinhThucKham({
                                  ...selectedHinhThucKham,
                                  [item.maBacSi]: newValue,
                                });

                                setSelectedBacSi(item);
                                // Cập nhật lại lịch làm việc khi thay đổi hình thức khám
                                fetchKhungGioKhamBacSi(item.maBacSi);
                                setHienThiTime("Chọn ngày khám!");
                                setSelectedDate(null);
                              }}
                            >
                              <Radio value="chuyenkhoa">Chuyên khoa</Radio>
                              <Radio value="tructuyen">Trực tuyến</Radio>
                            </Radio.Group>
                          </Col>

                          <Col
                            span={24}
                            style={{
                              backgroundColor: "white",
                              position: "relative",
                            }}
                          >
                            <p
                              onClick={() => {
                                showDrawer(item);
                                setSelectedDate(null);
                                setSelectedBacSi(item);
                                setHienThiTime("Chọn ngày khám!");
                                console.log("Bác sĩ được chọn:", item);
                              }}
                              style={{
                                color: "rgb(69, 195, 210)",
                                fontWeight: "500",
                                fontSize: "16px",
                                padding: "10px 0",
                                cursor: "pointer",
                              }}
                            >
                              {selectedBacSi &&
                              selectedBacSi.maBacSi === item.maBacSi
                                ? hienThiTime
                                : "Chọn ngày khám!"}
                              <DownOutlined
                                style={{
                                  fontSize: "14px",
                                  marginLeft: "3px",
                                  fontWeight: "600",
                                }}
                              />
                              {hienThiTime !== "Chọn ngày khám" ? (
                                <hr style={{ width: "150px", margin: "3px" }} />
                              ) : (
                                <hr style={{ width: "150px", margin: "3px" }} />
                              )}
                            </p>

                            <Drawer
                              title="Lịch khám của bác sĩ"
                              placement="right"
                              width={500}
                              onClose={() => {
                                onClose();
                                setSelectedDate(null);
                                setHienThiTime("Chọn ngày khám!");
                              }}
                              open={open}
                            >
                              {selectedBacSi ? (
                                <>
                                  <h3>Bác sĩ: {selectedBacSi.hoTen}</h3>
                                  <div style={{ marginBottom: "8px" }}>
                                    Chọn ngày khám:
                                  </div>
                                  <Select
                                    style={{ width: "100%" }}
                                    placeholder="Chọn ngày khám"
                                    value={selectedDate}
                                    onChange={(value) => {
                                      setSelectedDate(value);
                                      fetchKhungGioKhamBacSi(
                                        selectedBacSi.maBacSi
                                      );
                                      fetchBacSiByID(selectedBacSi.maBacSi);

                                      const formatted =
                                        moment(value).format("DD/MM/YYYY");
                                      const dayName =
                                        englishToVietnameseDays[
                                          moment(value).format("dddd")
                                        ];
                                      setHienThiTime(
                                        `${dayName} - ${formatted}`
                                      );

                                      onClose();
                                    }}
                                  >
                                    {dataLichLamViec
                                      .filter((item) => {
                                        // Lọc theo hình thức khám
                                        if (
                                          selectedHinhThucKham[
                                            selectedBacSi?.maBacSi
                                          ] === "tructuyen" &&
                                          item.maBacSi ===
                                            selectedBacSi?.maBacSi
                                        ) {
                                          return (
                                            item.hinhThucKham === "Trực tuyến"
                                          );
                                        }
                                        if (
                                          selectedHinhThucKham[
                                            selectedBacSi?.maBacSi
                                          ] === "chuyenkhoa" &&
                                          item.maBacSi ===
                                            selectedBacSi?.maBacSi
                                        ) {
                                          return (
                                            item.hinhThucKham === "Chuyên khoa"
                                          );
                                        }
                                        return true; // Trường hợp "Tất cả"
                                      })
                                      .map((item) => item.ngayLamViec) // Lấy ngày làm việc

                                      .filter(
                                        (value, index, self) =>
                                          self.indexOf(value) === index
                                      ) // Lọc ra những ngày duy nhất
                                      .map((ngayLamViec, index) => {
                                        const formatted =
                                          moment(ngayLamViec).format(
                                            "DD/MM/YYYY"
                                          );
                                        const dayName =
                                          englishToVietnameseDays[
                                            moment(ngayLamViec).format("dddd")
                                          ];

                                        if (
                                          moment(
                                            ngayLamViec,
                                            "YYYY-MM-DD"
                                          ).isSameOrAfter(today)
                                        ) {
                                          return (
                                            <Select.Option
                                              key={ngayLamViec}
                                              value={ngayLamViec}
                                            >
                                              {`${dayName} - ${formatted}`}
                                            </Select.Option>
                                          );
                                        }
                                        return null; // Không hiển thị ngày quá khứ
                                      })}
                                  </Select>
                                </>
                              ) : (
                                <p>Chưa chọn bác sĩ để xem lịch.</p>
                              )}
                            </Drawer>
                          </Col>

                          <Col
                            span={24}
                            style={{
                              backgroundColor: "white",
                              position: "relative",
                              top: "-30px",
                            }}
                          >
                            <p
                              style={{
                                color: "gray",
                                fontSize: "16px",
                                fontWeight: "500",
                                padding: "10px 0",
                              }}
                            >
                              <FaRegCalendarAlt />
                              <span style={{ marginLeft: "10px" }}>
                                LỊCH KHÁM
                              </span>
                            </p>

                            <Row
                              gutter={[16, 16]}
                              justify="start"
                              style={{ marginTop: "-10px", flexWrap: "wrap" }}
                            >
                              {selectedBacSi?.maBacSi === item?.maBacSi &&
                              selectedDate &&
                              selectedHinhThucKham[selectedBacSi?.maBacSi] &&
                              hienThiTime !==
                                "Bấm vào đây để chọn lịch khám" ? (
                                <>
                                  {dataLichLamViec &&
                                  dataLichLamViec.filter(
                                    (lich) =>
                                      lich.maBacSi === selectedBacSi?.maBacSi &&
                                      lich.ngayLamViec === selectedDate &&
                                      lich.trangThaiDatLich !== "booked" &&
                                      lich.hinhThucKham ===
                                        (selectedHinhThucKham[
                                          selectedBacSi?.maBacSi
                                        ] === "tructuyen"
                                          ? "Trực tuyến"
                                          : selectedHinhThucKham[
                                              selectedBacSi?.maBacSi
                                            ] === "chuyenkhoa"
                                          ? "Chuyên khoa"
                                          : lich.hinhThucKham)
                                  ).length > 0 ? (
                                    dataLichLamViec
                                      .filter(
                                        (lich) =>
                                          lich.maBacSi ===
                                            selectedBacSi?.maBacSi &&
                                          lich.ngayLamViec === selectedDate &&
                                          lich.trangThaiDatLich !== "booked" &&
                                          lich.hinhThucKham ===
                                            (selectedHinhThucKham[
                                              selectedBacSi?.maBacSi
                                            ] === "tructuyen"
                                              ? "Trực tuyến"
                                              : selectedHinhThucKham[
                                                  selectedBacSi?.maBacSi
                                                ] === "chuyenkhoa"
                                              ? "Chuyên khoa"
                                              : lich.hinhThucKham)
                                      )
                                      .map((lich, index) => (
                                        <Col
                                          key={index}
                                          xs={24}
                                          sm={12}
                                          md={10}
                                          lg={5}
                                          className="cach-deu"
                                          onClick={() => {
                                            setkhungGio(lich?.khungGio);
                                            setSelectedTimeId(lich?.maKhungGio);
                                            setHoveredIndex(index);
                                            handleRedirectBacSi(
                                              selectedBacSi,
                                              lich?.maKhungGio,
                                              lich?.khungGio,
                                              selectedDate,
                                              selectedBacSi?.giaKham,
                                              selectedHinhThucKham[
                                                selectedBacSi?.maBacSi
                                              ]
                                            );
                                          }}
                                        >
                                          <div className="lich-kham">
                                            {lich.khungGio}
                                          </div>
                                        </Col>
                                      ))
                                  ) : (
                                    <span
                                      style={{
                                        color: "red",
                                        margin: "0 0 10px",
                                      }}
                                    >
                                      Không có thời gian khám nào.
                                      <br /> Chọn <FaRegHandPointUp
                                        size={14}
                                      />{" "}
                                      và đặt (Phí đặt lịch 0đ)
                                    </span>
                                  )}
                                </>
                              ) : null}
                            </Row>
                          </Col>

                          <Col
                            span={24}
                            style={{ backgroundColor: "white", top: "-30px" }}
                          >
                            {selectedHinhThucKham?.[item?.maBacSi] && (
                              <p
                                style={{ fontWeight: "500", fontSize: "16px" }}
                              >
                                {selectedHinhThucKham[item?.maBacSi] ===
                                "chuyenkhoa"
                                  ? "ĐỊA CHỈ KHÁM: MediCare Hospital"
                                  : "TƯ VẤN TRỰC TUYẾN"}
                              </p>
                            )}

                            {showDetails[item.maBacSi] ? (
                              <div>
                                <p style={{ fontWeight: "500" }}>GIÁ KHÁM:</p>
                                <div
                                  style={{
                                    backgroundColor: "#f7f7f7",
                                    border: "1px solid #d9d2d2",
                                    display: "flex",
                                    justifyContent: "space-between",
                                  }}
                                >
                                  <span className="span-gia-kham">
                                    <p style={{ fontWeight: "500" }}>
                                      Giá khám
                                    </p>
                                    <p>
                                      Giá khám chưa bao gồm chi phí chụp chiếu,
                                      xét nghiệm
                                    </p>
                                  </span>
                                  <span
                                    style={{
                                      lineHeight: "70px",
                                      marginRight: "5px",
                                      color: "red",
                                      fontWeight: "500",
                                    }}
                                    className="span-gia-kham"
                                  >
                                    {formatCurrency(item?.giaKham)}
                                  </span>
                                </div>
                                <a
                                  onClick={() => toggleDetails(item.maBacSi)}
                                  style={{ float: "right", marginTop: "5px" }}
                                >
                                  Ẩn bảng giá
                                </a>
                              </div>
                            ) : (
                              <p>
                                <span
                                  style={{ fontWeight: "500", color: "gray" }}
                                >
                                  GIÁ KHÁM:
                                </span>{" "}
                                &nbsp;
                                <span
                                  style={{ color: "red", fontWeight: "500" }}
                                >
                                  {formatCurrency(item?.giaKham)}
                                </span>
                                <a
                                  onClick={() => toggleDetails(item.maBacSi)}
                                  style={{ marginLeft: "10px" }}
                                >
                                  Xem chi tiết
                                </a>
                              </p>
                            )}
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </Col>
                ))
              ) : hinhThucKhamFromUrl ? (
                <Col
                  span={24}
                  className="box-lich-kham"
                  style={{ backgroundColor: "white" }}
                >
                  <p
                    style={{
                      color: "red",
                      fontSize: "22px",
                      textAlign: "center",
                    }}
                  >
                    Không có bác sĩ phù hợp với hình thức khám này.
                  </p>
                </Col>
              ) : (
                <Col
                  span={24}
                  className="box-lich-kham"
                  style={{ backgroundColor: "white" }}
                >
                  <p
                    style={{
                      color: "red",
                      fontSize: "22px",
                      textAlign: "center",
                    }}
                  >
                    Chưa có bác sĩ nào thuộc chuyên khoa này.
                  </p>
                </Col>
              )}
            </Col>
          </Row>
        </Col>
      </Row>

      <Row style={{ marginBottom: "100px" }}></Row>

      <Footer />
    </>
  );
};
export default ChuyenKhoaVaBacSi;
