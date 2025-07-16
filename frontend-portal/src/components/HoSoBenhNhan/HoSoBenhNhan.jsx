// import {
//   UserOutlined,
//   PlusOutlined,
//   CalendarOutlined,
//   PhoneOutlined,
//   ManOutlined,
//   EnvironmentOutlined,
//   TeamOutlined,
//   EditOutlined,
//   DeleteOutlined,
//   InfoCircleOutlined
// } from "@ant-design/icons";
// import { Link } from "react-router-dom";
// import dayjs from "dayjs";
// import {
//   Row, Col, Button, Card, Modal, Spin, Empty, Form, Input, Select, message, DatePicker, notification
// } from "antd";
// import { useEffect, useState } from "react";
// import { useSelector } from "react-redux";
// import {
//   fetchHoSoBenhNhan,
//   updateHoSoBenhNhan,
//   deleteHoSoBenhNhan
// } from "services/patient/patient.services";

// import "./HoSoBenhNhan.css";

// const getGioiTinhText = (val) => {
//   switch (parseInt(val)) {
//     case 0: return "Nam";
//     case 1: return "Nữ";
//     case 2: return "Khác";
//     default: return "Chưa cập nhật";
//   }
// };

// const HoSoBenhNhan = () => {
//   const [isModalVisible, setIsModalVisible] = useState(false);
//   const [isEditModalVisible, setIsEditModalVisible] = useState(false);
//   const [profile, setProfile] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [editForm] = Form.useForm();
//   const acc = useSelector((state) => state.account.user);

//   const getProfile = async () => {
//     if (!acc?._id) return;
//     setLoading(true);
//     try {
//       const res = await fetchHoSoBenhNhan(acc?._id);
//       if (res?.data) {
//         setProfile(res.data);
//       } else {
//         setProfile(null);
//       }
//     } catch (error) {
//       setProfile(null);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     getProfile();
//   }, [acc?.user?.maBenhNhan]);

//   const showChiTiet = () => setIsModalVisible(true);
//   const closeChiTiet = () => setIsModalVisible(false);

//   const showEditModal = () => {
//     editForm.setFieldsValue({
//       maBenhNhan: profile?.maBenhNhan,
//       hoTenBenhNhan: profile?.hoTenBenhNhan || '',
//       ngaySinh: profile?.ngaySinh && profile?.ngaySinh !== "0000-00-00" ? dayjs(profile.ngaySinh) : null,
//       gioiTinh: profile?.gioiTinh?.toString() || '',
//       diaChi: profile?.diaChi || '',
//       ngheNghiep: profile?.ngheNghiep || '',
//       CCCD: profile?.CCCD || '',
//     });
    
//     setIsEditModalVisible(true);
//   };

//   const closeEditModal = () => setIsEditModalVisible(false);

//   const handleEdit = async (values) => {
//     const dataToSend = {
//       maBenhNhan: values.maBenhNhan,
//       hoTenBenhNhan: values.hoTenBenhNhan,
//       ngaySinh: values.ngaySinh ? dayjs(values.ngaySinh).format("YYYY-MM-DD") : null,
//       gioiTinh: parseInt(values.gioiTinh),
//       ngheNghiep: values.ngheNghiep,
//       CCCD: values.CCCD,
//       diaChi: values.diaChi,
//     };
  
//     try {
//       const res = await updateHoSoBenhNhan(
//         dataToSend.maBenhNhan,
//         dataToSend.hoTenBenhNhan,
//         dataToSend.ngaySinh,
//         dataToSend.gioiTinh,
//         dataToSend.ngheNghiep,
//         dataToSend.CCCD,
//         dataToSend.diaChi
//       );
  
//       if (res.status) {
//         message.success(res.message || "Cập nhật thành công");
//         await getProfile();
//         setIsEditModalVisible(false);
//       }
//     } catch (error) {
//       console.error("Lỗi khi cập nhật hồ sơ:", error);
//       message.error("Có lỗi xảy ra trong quá trình cập nhật.");
//     }
//   };

//   const handleDelete = async () => {
//     try {
//         const res = await deleteHoSoBenhNhan(profile?.maBenhNhan); // Gọi API xóa hồ sơ
        
//         console.log(res); // In ra phản hồi từ API để kiểm tra
        
//         // Kiểm tra res.data.success để xác định nếu xóa thành công
//         if (res?.success) {
//           notification.success({
//           message: res.message || "Xóa hồ sơ bệnh nhân thành công",
//           });
//           await getProfile();
//         } else {
//           notification.error({
//             message: "Xóa hồ sơ bệnh nhân thất bại",
//             description: res.message || "Không thể xóa hồ sơ này.",
//           });
//         }
//     } catch (error) {
//         console.error("Lỗi khi xóa hồ sơ:", error);
//         message.error("Xóa hồ sơ thất bại!");
//     }
// };


  
  

//   const showDeleteModal = () => {
//     Modal.confirm({
//       title: "Xác nhận xóa hồ sơ",
//       content: "Bạn có chắc chắn muốn xóa hồ sơ này không?",
//       okText: "Xóa",
//       okType: "danger",
//       cancelText: "Hủy",
//       onOk: handleDelete,
//     });
//   };

//   if (loading) {
//     return (
//       <div style={{ textAlign: "center", padding: "50px 0" }}>
//         <Spin tip="Đang tải hồ sơ bệnh nhân..." />
//       </div>
//     );
//   }

//   if (!profile) {
//     return (
//       <div style={{ textAlign: "center", padding: "40px 0" }}>
//         <Empty description="Chưa có hồ sơ bệnh nhân nào" />
//         <Link to="/user/tao-ho-so">
//           <Button
//             type="primary"
//             icon={<PlusOutlined />}
//             size="large"
//             style={{
//               backgroundColor: "#1890ff",
//               color: "#fff",
//               borderRadius: "50px",
//               padding: "12px 24px",
//               fontSize: "16px",
//               fontWeight: "bold",
//               boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
//               marginTop: 16,
//               transition: "all 0.3s ease",
//             }}
//           >
//             Tạo hồ sơ bệnh nhân mới
//           </Button>
//         </Link>
//       </div>
//     );
//   }

//   return (
//     <div>
//       <h2 style={{ marginBottom: 24, fontWeight: 600 }}>Hồ sơ bệnh nhân</h2>

//       <Card style={{ borderRadius: 12, boxShadow: "0 2px 10px rgba(0,0,0,0.1)" }}>
//         <Row gutter={[0, 0]}>
//           <Col span={24}>
//             <p><UserOutlined /> <b>Họ và tên:</b> {profile?.hoTenBenhNhan}</p>
//           </Col>
//           <Col span={24}>
//             <p>
//               <CalendarOutlined /> <b>Ngày sinh:</b>{" "}
//               {profile?.ngaySinh && profile?.ngaySinh !== "0000-00-00"
//                 ? dayjs(profile.ngaySinh).format("DD/MM/YYYY")
//                 : "Chưa cập nhật"}
//             </p>
//           </Col>
//           <Col span={24}>
//             <p><PhoneOutlined /> <b>SĐT:</b> {profile?.soDienThoai || "Chưa cập nhật"}</p>
//           </Col>
//           <Col span={24}>
//             <p><ManOutlined /> <b>Giới tính:</b> {getGioiTinhText(profile?.gioiTinh)}</p>
//           </Col>
//           <Col span={24}>
//             <p><EnvironmentOutlined /> <b>Địa chỉ:</b> {profile?.diaChi || "Chưa cập nhật"}</p>
//           </Col>

//           <Col span={24} style={{ textAlign: "right" }}>
//             <Button danger icon={<DeleteOutlined />} style={{ marginRight: 8 }} onClick={showDeleteModal}>Xóa</Button>
//             <Button type="primary" icon={<EditOutlined />} style={{ marginRight: 8 }} onClick={showEditModal}>Sửa</Button>
//             <Button icon={<InfoCircleOutlined />} onClick={showChiTiet}>Chi tiết</Button>
//           </Col>
//         </Row>
//       </Card>

//       {/* Modal chi tiết */}
//       <Modal title="Chi tiết hồ sơ" open={isModalVisible} onCancel={closeChiTiet} footer={null}>
//         <Row gutter={[16, 12]}>
//           <Col span={24}><p><UserOutlined /> <b>Họ và tên:</b> {profile.hoTenBenhNhan}</p></Col>
//           <Col span={24}>
//             <p>
//               <CalendarOutlined /> <b>Ngày sinh:</b>{" "}
//               {profile?.ngaySinh && profile?.ngaySinh !== "0000-00-00"
//                 ? dayjs(profile.ngaySinh).format("DD/MM/YYYY")
//                 : "Chưa cập nhật"}
//             </p>
//           </Col>
//           <Col span={24}><p><PhoneOutlined /> <b>SĐT:</b> {profile.soDienThoai || "Chưa cập nhật"}</p></Col>
//           <Col span={24}><p><ManOutlined /> <b>Giới tính:</b> {getGioiTinhText(profile.gioiTinh)}</p></Col>
//           <Col span={24}><p><TeamOutlined /> <b>CCCD:</b> {profile.CCCD || "Chưa cập nhật"}</p></Col>
//           <Col span={24}><p><TeamOutlined /> <b>Email:</b> {profile.email || "Chưa cập nhật"}</p></Col>
//           <Col span={24}><p><TeamOutlined /> <b>Nghề nghiệp:</b> {profile.ngheNghiep || "Chưa cập nhật"}</p></Col>
//           <Col span={24}><p><EnvironmentOutlined /> <b>Địa chỉ:</b> {profile.diaChi || "Chưa cập nhật"}</p></Col>
//         </Row>
//       </Modal>

//       {/* Modal sửa hồ sơ */}
//       <Modal
//         title="Sửa hồ sơ bệnh nhân"
//         open={isEditModalVisible}
//         onCancel={closeEditModal}
//         footer={null}
//       >
//         <Form form={editForm} onFinish={handleEdit} layout="vertical">
//           <Form.Item name="maBenhNhan" hidden>
//             <Input />
//           </Form.Item>
//           <Form.Item 
//             label="Họ và tên" 
//             name="hoTenBenhNhan" 
//             rules={[
//               {
//                 required: true,
//                 message: 'Vui lòng nhập họ tên!',
//               },
//               {
//                 pattern: /^[A-Za-zÀ-ỹ\s]+$/,
//                 message: 'Không được nhập số, ký tự đặc biệt!',
//               },
//             ]}>
//             <Input />
//           </Form.Item>
//           <Form.Item
//             label="Ngày sinh"
//             name="ngaySinh"
//             rules={[{ required: true, message: 'Vui lòng chọn ngày sinh' }]}
//           >
//           <DatePicker
//             format="DD/MM/YYYY"
//             style={{ width: "100%" }}
//             placeholder="Chọn ngày sinh"
//             disabledDate={(current) => current && current > dayjs().endOf('day')}
//           />
//           </Form.Item>
//           <Form.Item label="Giới tính" name="gioiTinh" rules={[{ required: true }]}>
//             <Select>
//               <Select.Option value="0">Nam</Select.Option>
//               <Select.Option value="1">Nữ</Select.Option>
//               <Select.Option value="2">Khác</Select.Option>
//             </Select>
//           </Form.Item>
//           <Form.Item label="CCCD" name="CCCD">
//             <Input readOnly />
//           </Form.Item>
//           <Form.Item label="Nghề nghiệp" name="ngheNghiep">
//             <Input />
//           </Form.Item>
//           <Form.Item label="Địa chỉ" name="diaChi">
//             <Input />
//           </Form.Item>
//           <Button type="primary" htmlType="submit">Lưu thay đổi</Button>
//         </Form>
//       </Modal>
//     </div>
//   );
// };

// export default HoSoBenhNhan;
