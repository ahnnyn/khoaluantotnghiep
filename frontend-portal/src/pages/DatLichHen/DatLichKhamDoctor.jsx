import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";

import {
  Avatar,
  Button,
  Col,
  Card,
  Form,
  Input,
  message,
  notification,
  Radio,
  Row,
  Typography,
} from "antd";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale } from "react-datepicker";
import { UserOutlined, PhoneOutlined } from "@ant-design/icons";
import { HiOutlineMailOpen } from "react-icons/hi";
import { IoLocationSharp } from "react-icons/io5";

import LoginPage from "../Login/Login";

import {
  datLichKhamBenh,
  datLichKhamBenhVnPay,
  taoVnPayUrl,
} from "services/patient/patient.services";
import { getUserById } from "services/auth.user/user.auth.services";

import "./styleDatLich.scss";

const { TextArea } = Input;

const englishToVietnameseDays = {
  Sunday: "Chủ nhật",
  Monday: "Thứ 2",
  Tuesday: "Thứ 3",
  Wednesday: "Thứ 4",
  Thursday: "Thứ 5",
  Friday: "Thứ 6",
  Saturday: "Thứ 7",
};

const formatDateVietnamese = (dateStr) => {
  const date = moment(dateStr);
  return `${englishToVietnameseDays[date.format("dddd")]} - ${date.format(
    "DD/MM/YYYY"
  )}`;
};

const PageDatLichKham = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isAuthenticated = useSelector(
    (state) => state.account.isUserAuthenticated
  );
  const acc = useSelector((state) => state.account?.user);

  const params = Object.fromEntries(new URLSearchParams(location.search));
  const doctorId = params.id;
  const khungGioKham = params.gioKham;
  const ngayKham = params.ngayKham;
  const giaKham = params.giaKham;
  const hinhThucKham = params.hinhThuc;
  const chuyenkhoa = params.chuyenkhoa;

  const [form] = Form.useForm();
  const [dataBacSi, setDataBacSi] = useState(null);
  const [ngayKhamBenh, setNgayKhamBenh] = useState(null);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [openModalLogin, setOpenModalLogin] = useState(false);
  const [formReady, setFormReady] = useState(false);
  console.log(import.meta.env.VITE_BACKEND_URL);

  const maBenhNhan = acc?._id;

  useEffect(() => {
    if (doctorId) fetchDoctor();

    if (ngayKham) setNgayKhamBenh(ngayKham);
  }, [doctorId, ngayKham]);

  const fetchDoctor = async () => {
    try {
      const res = await getUserById(doctorId);
      if (res?.data) setDataBacSi(res.data);
    } catch (err) {
      console.error("Lỗi fetch doctor:", err);
    }
  };

  useEffect(() => {
    if (!dataBacSi || !acc || !ngayKhamBenh) return;

    const dateOnly = acc.dateOfBirth ? new Date(acc.dateOfBirth) : null;
    const values = {
      patientName: acc.fullName,
      gender: acc.gender ? "1" : "0",
      phone: acc.phone,
      email: acc.email,
      address: acc.address,
      dateBenhNhan: dateOnly,
    };

    form.setFieldsValue(values);
    setFormReady(true);
  }, [form, dataBacSi, acc, ngayKhamBenh]);

  const handleDatLich = async (values) => {
    const ngayKham =
      values.ngayKhamBenh instanceof Date
        ? moment(values.ngayKhamBenh).format("YYYY-MM-DD")
        : values.ngayKhamBenh;
    setLoadingSubmit(true);

    try {
      const apiCall =
        values.hinhThucTT === "VnPay" ? datLichKhamBenhVnPay : datLichKhamBenh;
      const payload = {
        maBenhNhan,
        maBacSi: doctorId,
        patientName: values.patientName,
        email: values.email,
        phone: values.phone,
        giaKham: giaKham,
        khungGioKham,
        ngayKham,
        lyDoKham: values.lyDoKham,
        hinhThucTT: values.hinhThucTT,
        hinhThucKham: values.hinhThucKham,
      };

      const res = await apiCall(payload);

      if (res?.status) {
        if (values.hinhThucTT === "VnPay") {
          const vnpayRes = await taoVnPayUrl(
            res.maLichKham,
            values.giaKham,
            values.patientName
          );
          if (vnpayRes?.status) {
            window.location.href = vnpayRes.payment_url;
          } else {
            notification.error({
              message: "Lỗi VNPAY",
              description: vnpayRes.message,
            });
          }
        } else {
          message.success(res.message || "Đặt lịch thành công 🎉");
          navigate("/user/lich-hen");
          form.resetFields();
        }
      } else {
        notification.error({ message: "Lỗi", description: res?.error });
      }
    } catch (error) {
      notification.error({
        message: "Lỗi kết nối",
        description: "Không thể gửi yêu cầu.",
      });
    } finally {
      setLoadingSubmit(false);
    }
  };

  const handleClickSubmit = () => {
    if (!isAuthenticated) {
      notification.warning({
        message: "Cảnh báo",
        description: notificationContent(),
      });
    } else {
      form.submit();
    }
  };

  const notificationContent = () => (
    <div>
      <span>Vui lòng đăng nhập trước khi đặt lịch!</span>
      <Button type="link" onClick={() => setOpenModalLogin(true)}>
        Tiến hành đăng nhập
      </Button>
    </div>
  );

  return (
    <>
      <div
        className=""
        style={{
          backgroundImage: `url('/Banner_2.jpg')`,
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
              src="/banner_1-removebg-preview.png"
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
      <Row style={{ marginTop: "50px" }}></Row>

      <Card style={{ maxWidth: 1000, margin: "auto", borderRadius: 12 }}>
        <Typography.Title level={3} style={{ textAlign: "center" }}>
          Đặt lịch khám
        </Typography.Title>
        {dataBacSi && (
          <Row gutter={16} align="middle" style={{ marginBottom: 24 }}>
            <Col span={6} style={{ textAlign: "center" }}>
              <Avatar
                src={`${
                  import.meta.env.VITE_BACKEND_URL
                }/public/images/upload/${dataBacSi.avatar}`}
                size={100}
              />
            </Col>
            <Col span={18}>
              <Typography.Text strong>Bác sĩ:</Typography.Text>{" "}
              {dataBacSi.fullName} - {decodeURIComponent(chuyenkhoa)}
              <br />
              <Typography.Text strong>Thời gian:</Typography.Text>{" "}
              {khungGioKham} - {formatDateVietnamese(ngayKham)}
              <br />
              <Typography.Text strong>Hình thức:</Typography.Text>{" "}
              {hinhThucKham === "OFFLINE"
                ? "Khám tại bệnh viện"
                : "Khám trực tuyến qua video call"}
            </Col>
          </Row>
        )}
        {formReady && (
          <Form form={form} layout="vertical" onFinish={handleDatLich}>
            <Form.Item
              label="Họ tên bệnh nhân"
              name="patientName"
              rules={[{ required: true }]}
            >
              <Input prefix={<UserOutlined />} />
            </Form.Item>
            <Form.Item label="Giới tính" name="gender">
              <Radio.Group>
                <Radio value="0">Nam</Radio>
                <Radio value="1">Nữ</Radio>
                <Radio value="2">Khác</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item
              label="Số điện thoại"
              name="phone"
              rules={[{ required: true }]}
            >
              <Input prefix={<PhoneOutlined />} />
            </Form.Item>
            <Form.Item
              label="Email"
              name="email"
              rules={[{ required: true, type: "email" }]}
            >
              <Input prefix={<HiOutlineMailOpen />} />
            </Form.Item>
            <Form.Item
              label="Ngày sinh"
              name="dateBenhNhan"
              rules={[{ required: true, message: "Vui lòng chọn ngày sinh" }]}
            >
              <DatePicker
                selected={form.getFieldValue("dateBenhNhan")}
                onChange={(date) => form.setFieldsValue({ dateBenhNhan: date })}
                dateFormat="dd/MM/yyyy"
                placeholderText="Chọn ngày sinh"
                className="custom-datepicker"
              />
            </Form.Item>

            <Form.Item
              label="Địa chỉ"
              name="address"
              rules={[{ required: true }]}
            >
              <Input prefix={<IoLocationSharp />} />
            </Form.Item>
            <Form.Item
              label="Lý do khám"
              name="lyDoKham"
              rules={[{ required: true }]}
            >
              <TextArea rows={6} />
            </Form.Item>
            <Form.Item
              label="Hình thức thanh toán"
              name="hinhThucTT"
              rules={[{ required: true }]}
            >
              <Radio.Group>
                {hinhThucKham === "OFFLINE" && (
                  <Radio value="TienMat">Thanh toán tại bệnh viện</Radio>
                )}
                <Radio value="VnPay">Thanh toán qua VNPay</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item>
              <div style={{ textAlign: "center" }}>
                <Button
                  type="primary"
                  size="large"
                  style={{ width: "50%" }}
                  loading={loadingSubmit}
                  onClick={handleClickSubmit}
                >
                  Xác nhận đặt lịch
                </Button>
              </div>
            </Form.Item>
          </Form>
        )}
      </Card>
      <Row style={{ marginTop: "50px" }}></Row>

      <LoginPage
        openModalLogin={openModalLogin}
        setOpenModalLogin={setOpenModalLogin}
      />
    </>
  );
};

export default PageDatLichKham;
