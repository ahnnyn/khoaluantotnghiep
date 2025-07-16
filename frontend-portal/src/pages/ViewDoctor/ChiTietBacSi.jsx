// import { Avatar, Button, Col, Divider, Drawer, Row } from "antd";
// import Footer from "components/Footer/Footer";
// import Header from "components/Header/Header";
// import "./ChiTietBacSi.scss";
// import { DownOutlined, PhoneOutlined, UserOutlined } from "@ant-design/icons";

// import { FaRegHandPointUp } from "react-icons/fa6";
// import { useEffect, useState } from "react";
// import { FaRegCalendarAlt } from "react-icons/fa";
// import { IoHomeSharp } from "react-icons/io5";
// import { MailOutlined } from "@ant-design/icons";
// import { Select } from "antd";
// const { Option } = Select;

// import { useLocation, useNavigate } from "react-router-dom";

// import moment from "moment";

// const ChiTietBacSi = () => {
//   const [open, setOpen] = useState(false);
//   const [placement, setPlacement] = useState("right");
//   const [hienThiTime, setHienThiTime] = useState(
//     "Bấm vào đây để xem lịch khám!"
//   );
//   const [selectedTimeId, setSelectedTimeId] = useState(null);
//   const [dataLichLamViec, setDataLichLamViec] = useState([]);
//   const [dataBacSi, setDataBacSi] = useState(null);
//   const [error, setError] = useState(null); // Lưu thông báo lỗi
//   const [hoveredIndex, setHoveredIndex] = useState(null);
//   const [showDetails, setShowDetails] = useState(false);
//   const [selectedDate, setSelectedDate] = useState(null);
//   const [timeGioList, setTimeGioList] = useState([]);
//   const [giaKham, setGiaKham] = useState(null);
//   const navigate = useNavigate();
//   const location = useLocation();
//   const params = new URLSearchParams(location.search);
//   const maBacSi = params.get("maBacSi");
//   const hinhThucKham = params.get("hinhThucKham");
//   const [selectedHinhThucKham, setSelectedHinhThucKham] = useState(
//     hinhThucKham || "tatca"
//   );

//   console.log("hinhThucKham:", hinhThucKham);
//   console.log("selectedHinhThucKham: ", selectedHinhThucKham);
//   console.log("check id bác sĩ: ", maBacSi);

//   useEffect(() => {
//     if (!maBacSi) {
//       setError("Không tìm thấy ID bác sĩ.");
//       return;
//     }
//     fetchBacSiByID(maBacSi);
//   }, [maBacSi]);

//   useEffect(() => {
//     if (dataBacSi) {
//       setGiaKham(dataBacSi.giaKham);
//     }
//   }, [dataBacSi]);

//   console.log("giaKham: ", giaKham);

//   const fetchBacSiByID = async (maBacSi) => {
//     const res = await fetchDoctorByID(maBacSi);
//     console.log("res: ", res.data);
//     if (res && res.data) {
//       setDataBacSi(res.data);
//     }
//   };
//   console.log("dataBacSi: ", dataBacSi);

//   useEffect(() => {
//     const fetchBacSiTimes = async () => {
//       if (!maBacSi) {
//         console.warn("maBacSi is null or undefined");
//         return;
//       }

//       // Fetch data by doctor ID
//       const res = await getWorkScheduleByDoctor(maBacSi);
//       console.log("res fetch: ", res);

//       if (res && Array.isArray(res)) {
//         setDataLichLamViec(res);
//       } else {
//         console.error("Error fetching time slots:", await res.json());
//       }
//     };

//     fetchBacSiTimes();
//   }, [maBacSi]);

//   console.log("dataLichKham: ", dataLichLamViec);

//   const formatCurrency = (value) => {
//     if (value === null || value === undefined) return "";

//     const number = parseInt(value, 10); // loại bỏ phần thập phân nếu có
//     return `${number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} VNĐ`;
//   };

//   const showDrawer = () => {
//     setOpen(true);
//   };
//   const onClose = () => {
//     setOpen(false);
//   };
//   const toggleDetails = () => {
//     setShowDetails(!showDetails);
//   };

//   const englishToVietnameseDays = {
//     Sunday: "Chủ nhật",
//     Monday: "Thứ 2",
//     Tuesday: "Thứ 3",
//     Wednesday: "Thứ 4",
//     Thursday: "Thứ 5",
//     Friday: "Thứ 6",
//     Saturday: "Thứ 7",
//   };

//   // hiển thị trong drawer
//   // Lấy ngày hiện tại (không tính thời gian)
//   const today = moment().startOf("day");

//   // hiển thị trong drawer (chỉ hiển thị từ hôm nay trở đi)
//   // const listTime = (dataBacSi?.danhSachNgayLamViec || '')
//   //     .split(',')
//   //     .map(date => date.trim())
//   //     .filter(date => moment(date, 'YYYY-MM-DD', true).isValid())
//   //     .filter(date => moment(date).isSameOrAfter(today));

//   const danhSachNgayLamViec = Array.from(
//     new Set(
//       dataLichLamViec
//         .filter((item) => {
//           if (selectedHinhThucKham === "tructuyen") {
//             return item.hinhThucKham === "Trực tuyến";
//           }
//           if (selectedHinhThucKham === "chuyenkhoa") {
//             return item.hinhThucKham === "Chuyên khoa";
//           }
//           return true; // 'tatca'
//         })
//         .map((item) => item.ngayLamViec)
//         .filter((ngay) => moment(ngay, "YYYY-MM-DD").isSameOrAfter(today))
//     )
//   );

//   console.log("danhSachNgayLamViec: ", danhSachNgayLamViec);
//   console.log("dataLichLamViec: ", dataLichLamViec);

//   console.log("selectedHinhThucKham: ", selectedHinhThucKham);

//   useEffect(() => {
//     if (hinhThucKham) {
//       setSelectedHinhThucKham(hinhThucKham);
//     }
//   }, [hinhThucKham]);

//   const styleTime = (index) => ({
//     cursor: "pointer",
//     fontSize: "18px",
//     color: hoveredIndex === index ? "red" : "black", // Đổi màu chữ khi hover
//   });

//   const handleRedirectBacSi = (
//     item,
//     idKhungGio,
//     thoiGianKhamBenh,
//     selectedDate,
//     giaKham,
//     hinhThucKham
//   ) => {
//     const formattedDate = moment(selectedDate, "YYYY-MM-DD").format(
//       "YYYY-MM-DD"
//     );
//     navigate(
//       `/page-dat-lich-kham?id=${item.maBacSi}&idGioKhamBenh=${idKhungGio}&khungGioKham=${thoiGianKhamBenh}&ngayKham=${formattedDate}&giaKham=${giaKham}&hinhThucKham=${hinhThucKham}`
//     );
//   };
//   return (
//     <>
//       <div className="layout-app">
//         <Header />
//         <Row style={{ marginBottom: "120px" }}></Row>
//         <div
//           className=""
//           style={{
//             backgroundImage: `url('../../public/Banner_2.jpg')`,
//             height: "300px",
//           }}
//         >
//           <Row justify="space-between" align="middle" gutter={16}>
//             <Col xs={24} md={12} className="">
//               <div
//                 style={{
//                   marginLeft: "90px",
//                   padding: "20px 30px",
//                   borderRadius: "40px",
//                   backgroundColor: "white",
//                   boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
//                   display: "flex",
//                   flexDirection: "column",
//                   alignItems: "center", // căn giữa theo trục ngang
//                   justifyContent: "center", // căn giữa theo trục dọc (nếu có thêm chiều cao cố định)
//                   textAlign: "center",
//                 }}
//               >
//                 <h3
//                   style={{
//                     fontSize: "clamp(20px, 5vw, 30px)",
//                     fontWeight: "bold",
//                     color: "#00B0F0",
//                     margin: 0,
//                   }}
//                 >
//                   ĐẶT KHÁM THEO BÁC SĨ
//                 </h3>
//               </div>
//             </Col>

//             <Col xs={24} md={12} className="z-0 flex justify-end">
//               <img
//                 src="../../public/540_phan_loai_dieu_kien_sx_trang_thiet_bi_y_te-removebg-preview.png"
//                 alt="Doctors illustration"
//                 className=""
//                 style={{
//                   maxHeight: "350px",
//                   float: "right",
//                   marginRight: "100px",
//                 }}
//               />
//             </Col>
//           </Row>
//         </div>
//         <Row style={{ marginTop: "20px" }}></Row>

//         <Row>
//           <Col span={18} className="body-view-doctocc">
//             <Row style={{ marginBottom: "30px" }}>
//               <Col
//                 span={24}
//                 style={{ backgroundColor: "white", height: "7vh" }}
//               >
//                 <p
//                   style={{
//                     color: "rgb(69, 195, 210)",
//                     fontSize: "18px",
//                     marginLeft: "5px",
//                     fontWeight: "bold",
//                     position: "relative",
//                   }}
//                 >
//                   <IoHomeSharp /> / Các chuyên khoa /
//                   <span style={{ marginLeft: "5px" }}>
//                     {" "}
//                     {dataBacSi?.tenKhoa || "Chưa có thông tin"}{" "}
//                   </span>
//                   <span style={{ marginLeft: "5px" }}>
//                     {" "}
//                     / Bác sĩ {dataBacSi?.hoTen || "Chưa có thông tin"}
//                   </span>
//                 </p>
//               </Col>
//             </Row>

//             <Row>
//               <Col
//                 md={21}
//                 sm={21}
//                 xs={21}
//                 span={21}
//                 push={3}
//                 style={{ backgroundColor: "white" }}
//               >
//                 <p
//                   style={{
//                     fontSize: "25px",
//                     marginTop: "10px",
//                     fontWeight: "500",
//                   }}
//                 >
//                   {dataBacSi?.hoTen}
//                 </p>
//                 <p
//                   style={{
//                     fontSize: "15px",
//                     marginTop: "-20px",
//                     lineHeight: "22px",
//                   }}
//                   dangerouslySetInnerHTML={{ __html: dataBacSi?.moTa }}
//                 ></p>
//                 <p style={{ fontSize: "15px" }}>
//                   <PhoneOutlined style={{ fontSize: 16, color: "#DB4437" }} />
//                   <span style={{ marginLeft: "3px" }}>
//                     {dataBacSi?.soDienThoai}
//                   </span>
//                   &nbsp; - &nbsp;
//                   <MailOutlined style={{ fontSize: 16, color: "#DB4437" }} />
//                   <span style={{ marginLeft: "3px" }}> {dataBacSi?.email}</span>
//                 </p>
//               </Col>

//               <Col
//                 md={3}
//                 sm={24}
//                 xs={24}
//                 span={3}
//                 pull={21}
//                 style={{ backgroundColor: "white", textAlign: "center" }}
//               >
//                 <Avatar
//                   src={`${import.meta.env.VITE_BACKEND_URL}/public/bacsi/${
//                     dataBacSi?.hinhAnh
//                   }`}
//                   size={120}
//                   icon={<UserOutlined />}
//                 />
//               </Col>
//             </Row>

//             <Row gutter={[16, 25]} style={{ marginTop: "20px" }}>
//               <Col span={24}>
//                 <span style={{ marginRight: 10, fontWeight: "500" }}>
//                   Chọn hình thức khám:
//                 </span>
//                 <Select
//                   value={selectedHinhThucKham}
//                   style={{ width: 200 }}
//                   onChange={(value) => setSelectedHinhThucKham(value)}
//                 >
//                   <Select.Option value="tatca">Tất cả</Select.Option>
//                   <Select.Option value="chuyenkhoa">Chuyên khoa</Select.Option>
//                   <Select.Option value="tructuyen">Trực tuyến</Select.Option>
//                 </Select>
//               </Col>

//               {/* Cột trái - Chọn ngày và khung giờ */}
//               <Col
//                 span={12}
//                 style={{
//                   backgroundColor: "white",
//                   borderRight: "1px solid rgba(228, 228, 221, 0.637)",
//                 }}
//               >
//                 <div style={{ backgroundColor: "white" }}>
//                   <p
//                     onClick={showDrawer}
//                     style={{
//                       color: "rgb(69, 195, 210)",
//                       fontWeight: "500",
//                       fontSize: "16px",
//                       padding: "10px 0",
//                       cursor: "pointer",
//                     }}
//                   >
//                     {hienThiTime}
//                     <DownOutlined
//                       style={{
//                         fontSize: "14px",
//                         marginLeft: "3px",
//                         fontWeight: "600",
//                       }}
//                     />
//                     <hr
//                       style={{
//                         width:
//                           hienThiTime !== "Bấm vào đây để xem lịch khám!"
//                             ? "130px"
//                             : "230px",
//                         margin: "5px",
//                       }}
//                     />
//                   </p>

//                   <Drawer
//                     title={`Thông tin lịch khám bệnh của bác sĩ ${dataBacSi?.hoTen}`}
//                     placement={placement}
//                     closable={false}
//                     onClose={onClose}
//                     open={open}
//                     key={placement}
//                   >
//                     {danhSachNgayLamViec.length > 0 ? (
//                       danhSachNgayLamViec
//                         .sort((a, b) => moment(a).unix() - moment(b).unix())
//                         .map((time, index) => {
//                           const vietnameseDay =
//                             englishToVietnameseDays[
//                               moment(time).format("dddd")
//                             ];
//                           const displayTime = `${vietnameseDay} - ${moment(
//                             time
//                           ).format("DD/MM")}`;
//                           return (
//                             <p
//                               key={index}
//                               onClick={() => {
//                                 setHienThiTime(displayTime);
//                                 setSelectedTimeId(time);
//                                 setSelectedDate(time);

//                                 console.log("selectedDate: ", time);
//                                 onClose();
//                               }}
//                               onMouseEnter={() => setHoveredIndex(index)}
//                               onMouseLeave={() => setHoveredIndex(null)}
//                               className="times"
//                               style={styleTime(index)}
//                             >
//                               {displayTime}
//                             </p>
//                           );
//                         })
//                     ) : (
//                       <p>Không có thời gian khám nào.</p>
//                     )}
//                     <Button
//                       color="default"
//                       variant="outlined"
//                       onClick={() => setOpen(false)}
//                     >
//                       Bỏ Qua
//                     </Button>
//                   </Drawer>
//                 </div>

//                 <div
//                   style={{
//                     backgroundColor: "white",
//                     top: "-18px",
//                     position: "relative",
//                   }}
//                 >
//                   <p
//                     style={{
//                       color: "gray",
//                       fontSize: "16px",
//                       fontWeight: "500",
//                       padding: "10px 0",
//                     }}
//                   >
//                     <FaRegCalendarAlt />
//                     <span style={{ marginLeft: "10px" }}>LỊCH KHÁM</span>
//                   </p>

//                   <Row justify="start" style={{ marginTop: "-10px" }}>
//                     {hienThiTime !== "Bấm vào đây để xem lịch khám!" &&
//                     selectedDate ? (
//                       (() => {
//                         const khungGioTheoNgay = dataLichLamViec.filter(
//                           (item) =>
//                             item.trangThaiDatLich !== "booked" &&
//                             item.ngayLamViec === selectedDate &&
//                             item.hinhThucKham ===
//                               (selectedHinhThucKham === "tructuyen"
//                                 ? "Trực tuyến"
//                                 : selectedHinhThucKham === "chuyenkhoa"
//                                 ? "Chuyên khoa"
//                                 : item.hinhThucKham)
//                         );
//                         if (khungGioTheoNgay.length > 0) {
//                           return khungGioTheoNgay.map((item, index) => (
//                             <Col
//                               span={4}
//                               className="cach-deu"
//                               key={index}
//                               onClick={() => {
//                                 setTimeGioList(item.khungGio);
//                                 setSelectedTimeId(item.maKhungGio);
//                                 handleRedirectBacSi(
//                                   dataBacSi,
//                                   item.maKhungGio,
//                                   item.khungGio,
//                                   selectedDate,
//                                   giaKham,
//                                   selectedHinhThucKham
//                                 );
//                               }}
//                             >
//                               <div className="lich-kham">{item.khungGio}</div>
//                             </Col>
//                           ));
//                         } else {
//                           return (
//                             <span style={{ color: "red", margin: "0 0 10px" }}>
//                               Không có thời gian khám nào.
//                             </span>
//                           );
//                         }
//                       })()
//                     ) : (
//                       <span style={{ color: "red", margin: "0 0 10px" }}>
//                         Không có thời gian khám nào.
//                       </span>
//                     )}
//                   </Row>
//                 </div>

//                 <div
//                   style={{
//                     backgroundColor: "white",
//                     top: "-30px",
//                     position: "relative",
//                   }}
//                 >
//                   <p style={{ fontSize: "14px", color: "gray" }}>
//                     Chọn <FaRegHandPointUp size={14} /> và đặt (Phí đặt lịch 0đ)
//                   </p>
//                 </div>
//               </Col>

//               {/* Cột phải - Giá khám */}
//               <Col
//                 span={12}
//                 style={{ backgroundColor: "white", padding: "45px 20px" }}
//               >
//                 {showDetails ? (
//                   <div>
//                     <p style={{ fontWeight: "500" }}>GIÁ KHÁM:</p>
//                     <div
//                       style={{
//                         backgroundColor: "#f7f7f7",
//                         border: "1px solid #d9d2d2",
//                         display: "flex",
//                         justifyContent: "space-between",
//                       }}
//                     >
//                       <span className="span-gia-kham">
//                         <p style={{ fontWeight: "500" }}>Giá khám</p>
//                       </span>
//                       <span
//                         style={{
//                           lineHeight: "70px",
//                           marginRight: "5px",
//                           color: "red",
//                           fontWeight: "500",
//                         }}
//                         className="span-gia-kham"
//                       >
//                         {formatCurrency(dataBacSi?.giaKham)}
//                       </span>
//                     </div>
//                     <a
//                       onClick={toggleDetails}
//                       style={{ float: "right", marginTop: "5px" }}
//                     >
//                       Ẩn bảng giá
//                     </a>
//                   </div>
//                 ) : (
//                   <p>
//                     <span style={{ fontWeight: "500", color: "gray" }}>
//                       GIÁ KHÁM:
//                     </span>
//                     &nbsp;
//                     <span style={{ color: "red", fontWeight: "500" }}>
//                       {formatCurrency(dataBacSi?.giaKham)}
//                     </span>
//                   </p>
//                 )}
//               </Col>
//             </Row>
//           </Col>
//         </Row>
//         <Row>
//           <Col
//             span={24}
//             style={{
//               backgroundColor: "#f7f7f7",
//               borderTop: "1px solid rgba(228, 228, 221, 0.637)",
//               marginTop: "20px",
//             }}
//           >
//             <Row>
//               <Col span={18} style={{ margin: "auto" }}>
//                 <div dangerouslySetInnerHTML={{ __html: dataBacSi?.mota }} />
//               </Col>
//             </Row>
//           </Col>
//         </Row>
//         <Row style={{ marginBottom: "100px" }}></Row>
//         <Footer />
//       </div>
//     </>
//   );
// };

// export default ChiTietBacSi;
