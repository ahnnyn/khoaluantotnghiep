// import { Col, Row, Table, message, Modal, Card, Typography, Empty } from "antd";
// import { useEffect, useState } from "react";
// import { FaEye } from "react-icons/fa";
// import { useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import moment from "moment"; 
// import {
//   fetchAllPhieuKhamBenh,
//   fetchHoSoBenhNhan,
// } from "services/patient/patient.services"; // Adjust the import path as necessary
// import './phieuKhamBenh.css';

// const { Text } = Typography;

// const PhieuKhamTable = ({ editingRecord }) => {
//   const navigate = useNavigate();
//   const [dataPhieuKham, setDataPhieuKham] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [maHoSo, setMaHoSo] = useState(null);
//   const [modalVisible, setModalVisible] = useState(false);
//   const [selectedRecord, setSelectedRecord] = useState(null);

//   const acc = useSelector((state) => state.account.user);

//   const getProfile = async () => {
//     if (!acc?.user?.maBenhNhan) return;
//     setLoading(true);
//     try {
//       const res = await fetchHoSoBenhNhan(acc.user.maBenhNhan);
//       if (res?.data?.maHoSo) {
//         setMaHoSo(res.data.maHoSo);
//       } else {
//         message.error("Không tìm thấy hồ sơ bệnh nhân.");
//       }
//     } catch (err) {
//       console.error("Lỗi lấy hồ sơ:", err);
//       message.error("Lỗi khi lấy hồ sơ bệnh nhân.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchPhieuKham = async (maHoSo) => {
//     setLoading(true);
//     try {
//       const res = await fetchAllPhieuKhamBenh(maHoSo);
//       setDataPhieuKham(Array.isArray(res) ? res : []);
//     } catch (err) {
//       console.error("Lỗi lấy phiếu khám:", err);
//       message.error("Lỗi khi lấy danh sách phiếu khám.");
//       setDataPhieuKham([]); // fallback
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     getProfile();
//   }, [acc?.user?.maBenhNhan]);

//   useEffect(() => {
//     if (editingRecord?.maHoSo) {
//       fetchPhieuKham(editingRecord.maHoSo);
//     } else if (maHoSo) {
//       fetchPhieuKham(maHoSo);
//     }
//   }, [editingRecord, maHoSo]);

//   const columns = [
//     {
//       title: "STT",
//       render: (_, __, index) => index + 1,
//       width: 60,
//       align: "center",
//     },
//     { title: "Tên bệnh nhân", dataIndex: "hoTenBenhNhan", key: "hoTenBenhNhan" },
//     { title: "Tên Bác Sĩ", dataIndex: "hoTen", key: "hoTen" },
//     { title: "Ngày Khám", dataIndex: "ngayKham", key: "ngayKham" },
//     { title: "Khung Giờ", dataIndex: "khungGioKham", key: "khungGioKham" },
//     { title: "Lý Do Khám", dataIndex: "lyDoKham", key: "lyDoKham" },
//     { title: "Tiền Sử Bệnh", dataIndex: "tienSu", key: "tienSu" },
//     { title: "Chẩn Đoán", dataIndex: "chanDoan", key: "chanDoan" },
//     {
//       title: "Hành Động",
//       key: "action",
//       render: (_, record) => (
//         <FaEye
//           style={{
//             color: "green",
//             cursor: "pointer",
//             fontSize: 18,
//           }}
//           onClick={() => {
//             setSelectedRecord(record);
//             setModalVisible(true);
//           }}
//         />
//       ),
//       align: "center",
//     },
//   ];

//   const handleCloseModal = () => {
//     setModalVisible(false);
//     setSelectedRecord(null);
//   };

//   // Chuyển đổi giới tính từ số thành từ ngữ dễ hiểu
//   const formatGender = (gender) => {
//     if (gender === 0) return "Nam";
//     if (gender === 1) return "Nữ";
//     return "Khác";
//   };

//   return (
//     <Row>
//   <Col
//     span={24}
//     style={{ padding: "0 0 20px", fontSize: "18px", textAlign: "center" }}
//   >
//     <span style={{ fontWeight: "500", color: "navy" }}>
//       PHIẾU KHÁM BỆNH
//     </span>
//   </Col>

//   {/* Kiểm tra nếu không có phiếu khám */}
//   {dataPhieuKham.length === 0 ? (
//     <Col span={24} style={{ textAlign: "center", marginTop: "20px" }}>
//       <div style={{ textAlign: "center", marginTop: 40 }}>
//               <Empty description="Không có phiếu khám bệnh nào!" />
//             </div>
//     </Col>
//   ) : (
//     <Table
//       columns={columns}
//       dataSource={dataPhieuKham}
//       rowKey={(record) =>
//         record.idPK || `${record.maHoSo}_${record.ngayKham}_${Math.random()}`
//       }
//       pagination={false}
//       loading={loading}
//       bordered
//       size="middle"
//       scroll={{ x: "max-content" }}
//       rowClassName="custom-table-row"
//     />
//   )}

//   <Modal
//   title="Chi tiết phiếu khám"
//   open={modalVisible}
//   onCancel={handleCloseModal}
//   footer={null}
//   width={750}
// >
//   {selectedRecord && (
//     <>
//       <Row gutter={[16, 16]}>
//         <Col span={12}>
//           <Card title="Thông tin bệnh nhân" bordered={false}>
//             <Text strong style={{ fontSize: "16px" }}>Tên bệnh nhân: </Text>
//             <Text>{selectedRecord.hoTenBenhNhan}</Text>
//             <br />
//             <Text strong style={{ fontSize: "16px" }}>Số điện thoại: </Text>
//             <Text>{selectedRecord.soDienThoai}</Text>
//             <br />
//             <Text strong style={{ fontSize: "16px" }}>Giới tính: </Text>
//             <Text>{formatGender(selectedRecord.gioiTinh)}</Text>
//             <br />
//             <Text strong style={{ fontSize: "16px" }}>Ngày sinh: </Text>
//             <Text>{selectedRecord.ngaySinh ? moment(selectedRecord.ngaySinh).format("DD/MM/YYYY") : "Không rõ"}</Text>
//             <br />
//             <Text strong style={{ fontSize: "16px" }}>Nghề nghiệp: </Text>
//             <Text>{selectedRecord.ngheNghiep}</Text>
//             <br />
//             <Text strong style={{ fontSize: "16px" }}>Căn cước công dân: </Text>
//             <Text>{selectedRecord.CCCD}</Text>
//             <br />
//             <Text strong style={{ fontSize: "16px" }}>Địa chỉ: </Text>
//             <Text>{selectedRecord.diaChi}</Text>
//           </Card>
//         </Col>

//         <Col span={12}>
//           <Card title="Thông tin khám" bordered={false}>
//             <Text strong style={{ fontSize: "16px" }}>Bác sĩ khám: </Text>
//             <Text>{selectedRecord.hoTen || "Chưa rõ"}</Text>
//             <br />
//             <Text strong style={{ fontSize: "16px" }}>Lý do khám: </Text>
//             <Text>{selectedRecord.lyDoKham || "Không ghi"}</Text>
//             <br />
//             <Text strong style={{ fontSize: "16px" }}>Tiền sử: </Text>
//             <Text>{selectedRecord.tienSu || "Không ghi"}</Text>
//             <br />
//             <Text strong style={{ fontSize: "16px" }}>Chẩn đoán: </Text>
//             <Text>{selectedRecord.chanDoan || "Không ghi"}</Text>
//             <br />
//             <Text strong style={{ fontSize: "16px" }}>Ngày khám: </Text>
//             <Text>{selectedRecord.ngayKham ? moment(selectedRecord.ngayKham).format("DD/MM/YYYY") : "Không rõ"}</Text>
//             <br />
//             <Text strong style={{ fontSize: "16px" }}>Giờ khám: </Text>
//             <Text>{selectedRecord.khungGioKham}</Text>
//             <br />
//             <Text strong style={{ fontSize: "16px" }}>Giá khám: </Text>
//             <Text>
//               {selectedRecord.giaKham !== undefined && selectedRecord.giaKham !== null
//                 ? `${Number(selectedRecord.giaKham).toLocaleString('vi-VN', {
//                     minimumFractionDigits: 0,
//                     maximumFractionDigits: 0,
//                   })} VND`
//                 : "Chưa có"}
//             </Text>
//           </Card>
//         </Col>
//       </Row>

//       <Row style={{ marginTop: 20 }}>
//         <Col span={24}>
//           <Card title="Thông tin đơn thuốc" bordered={false}>
//             {Array.isArray(selectedRecord.donThuoc) && selectedRecord.donThuoc.length > 0 ? (
//               <Table
//                 dataSource={selectedRecord.donThuoc}
//                 pagination={false}
//                 rowKey={(item, index) => index}
//                 size="small"
//                 bordered
//                 columns={[
//                   {
//                     title: "Tên thuốc",
//                     dataIndex: "tenThuoc",
//                     key: "tenThuoc",
//                     align: "center",
//                     width: 150,
//                   },
//                   {
//                     title: "Liều dùng",
//                     dataIndex: "lieuDung",
//                     key: "lieuDung",
//                     align: "center",
//                     width: 100,
//                   },
//                   {
//                     title: "Số lần/ngày",
//                     dataIndex: "soLanDungTrongNgay",
//                     key: "soLanDungTrongNgay",
//                     align: "center",
//                     width: 100,
//                   },
//                   {
//                     title: "Số ngày",
//                     dataIndex: "soNgay",
//                     key: "soNgay",
//                     align: "center",
//                     width: 100,
//                   },
//                   {
//                     title: "Ghi chú",
//                     dataIndex: "ghiChu",
//                     align: "center",
//                     key: "ghiChu",
//                   },
//                 ]}
//                 scroll={{ x: 600 }}
//               />
//             ) : (
//               <Empty description="Không có đơn thuốc" />
//             )}
//           </Card>
//         </Col>
//       </Row>
//     </>
//   )}
// </Modal>
// </Row>

//   );
// };

// export default PhieuKhamTable;
