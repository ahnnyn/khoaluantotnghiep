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
  Divider,
  Checkbox,
} from "antd";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  UserOutlined,
  PhoneOutlined,
  DollarOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import { HiOutlineMailOpen } from "react-icons/hi";
import { IoLocationSharp } from "react-icons/io5";

import LoginPage from "../Login/Login";
import {
  createVnpayPaymentUrl,
  handleCreateAppointment,
} from "services/patient/patient.services";
import { getUserById } from "services/auth.user/user.auth.services";

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

const BookingAppointment = () => {
  const location = useLocation();
  const isAuthenticated = useSelector(
    (state) => state.account.isUserAuthenticated
  );
  const acc = useSelector((state) => state.account?.user);

  const params = Object.fromEntries(new URLSearchParams(location.search));
  const doctorId = params.id;
  const khungGioKham = params.gioKham;
  const ngayKham = params.ngayKham;
  const giaKham = Number(params.giaKham);
  const hinhThucKham = params.hinhThuc;
  const chuyenkhoa = params.chuyenkhoa;

  const [form] = Form.useForm();
  const [dataBacSi, setDataBacSi] = useState(null);
  const [formReady, setFormReady] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [openModalLogin, setOpenModalLogin] = useState(false);
  const [selectedSoTienTT, setSelectedSoTienTT] = useState("30");
  const [acceptPolicy, setAcceptPolicy] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState(null);
  const [tongThanhToan, setTongThanhToan] = useState(0);

  useEffect(() => {
    const percent = Number(selectedSoTienTT);
    if (!isNaN(percent)) {
      setTongThanhToan(Math.floor((percent / 100) * giaKham));
    }
  }, [selectedSoTienTT, giaKham]);

  const maBenhNhan = acc?._id;

  console.log("check acc đặt lịch", acc);
  const radioStyle = {
    padding: "10px 12px",
    border: "1px solid #d9d9d9",
    borderRadius: 8,
    background: "#fafafa",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    transition: "all 0.3s ease",
  };

  const optionStyle = {
    display: "flex",
    alignItems: "center",
  };

  const fetchDoctor = async () => {
    try {
      const res = await getUserById(doctorId);
      if (res?.data) setDataBacSi(res.data);
    } catch (err) {
      console.error("Lỗi fetch doctor:", err);
    }
  };

  useEffect(() => {
    if (doctorId) fetchDoctor();
  }, [doctorId]);

  useEffect(() => {
    console.log("acc:", acc);
    console.log("dataBacSi:", dataBacSi);
    console.log("form ready:", form.getFieldsValue());
  }, [form, acc, dataBacSi]);

  useEffect(() => {
    form.setFieldsValue({
      soTienThanhToan: selectedSoTienTT,
    });
  }, [selectedSoTienTT]);

  useEffect(() => {
    form.setFieldsValue({
      hinhThucTT: selectedPaymentMethod,
    });
  }, [selectedPaymentMethod]);

  useEffect(() => {
    const initSoTien = hinhThucKham === "OFFLINE" ? "30" : "30";
    setSelectedSoTienTT(initSoTien);

    const dob = acc?.dateOfBirth ? new Date(acc.dateOfBirth) : null;
    console.log("Date of Birth:", dob);
    setDateOfBirth(dob);
    form.setFieldsValue({
      patientName: acc?.fullName || "",
      gender: acc?.gender === true ? "1" : "0",
      phone: acc?.phone,
      email: acc?.email,
      address: acc?.address,
      dateBenhNhan: dob,
      soTienThanhToan: initSoTien,
      hinhThucTT: selectedPaymentMethod,
      hinhThucKham: hinhThucKham,
    });

    setFormReady(true);
  }, [form, acc, dataBacSi, hinhThucKham]);

  const handleDateChange = (date) => {
    setDateOfBirth(date);
    form.setFieldsValue({ dateBenhNhan: date });
  };

  const handleDatLich = async (values) => {
    setLoadingSubmit(true);
    try {
      if (!values.hinhThucTT) {
        message.warning("Vui lòng chọn hình thức thanh toán");
        return;
      }

      if (!tongThanhToan || isNaN(tongThanhToan)) {
        message.error("Tổng thanh toán không hợp lệ");
        return;
      }

      const payload = {
        patientId: acc?._id,
        doctorId,
        scheduledDate: ngayKham,
        scheduledTimeSlot: khungGioKham,
        reasonForVisit: values.lyDoKham,
        paymentMethod: values.hinhThucTT,
        paymentStatus: "PENDING",
        fullName: values.patientName,
        email: values.email,
        phone: values.phone,
        gender: values.gender,
        address: values.address,
        dateOfBirth: values.dateBenhNhan,
        price: tongThanhToan,
      };

      const resCreate = await handleCreateAppointment(payload);
      const maPhieuKham = resCreate?.data?._id;

      if (!maPhieuKham) {
        message.error("Không tạo được phiếu khám");
        return;
      }

      if (values.hinhThucTT === "VNPAY") {
        const res = await createVnpayPaymentUrl(
          maPhieuKham,
          tongThanhToan,
          values.patientName
        );
        if (res?.data?.paymentUrl || res?.data?.payment_url) {
          window.location.href = res.data.paymentUrl || res.data.payment_url;
        } else {
          message.error("Không lấy được link thanh toán");
        }
      } else if (values.hinhThucTT === "MOMO") {
        message.warning("Hiện chưa hỗ trợ MOMO");
      } else {
        message.warning("Hình thức thanh toán không hợp lệ");
      }
    } catch (err) {
      console.error("Đặt lịch lỗi:", err);
      notification.error({
        message: "Lỗi",
        description: err?.response?.data?.message || "Không rõ lỗi",
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

  // const tongThanhToan = Math.floor(
  //   (Number(selectedSoTienTT || "30") / 100) * giaKham
  // );

  const notificationContent = () => (
    <div>
      <span>Vui lòng đăng nhập trước khi đặt lịch!</span>
      <Button type="link" onClick={() => setOpenModalLogin(true)}>
        Tiến hành đăng nhập
      </Button>
    </div>
  );

  return (
    <div
      style={{
        maxWidth: 1200,
        margin: "auto",
        padding: 24,
        margin: "50px auto",
      }}
    >
      <Typography.Title level={3} style={{ textAlign: "center" }}>
        ĐẶT LỊCH KHÁM BỆNH
      </Typography.Title>
      <Divider style={{ borderBlockWidth: 1, borderColor: "#40a9ff" }} />
      {formReady && (
        <Form form={form} layout="vertical" onFinish={handleDatLich}>
          <Row gutter={32}>
            <Col span={14}>
              <Card bordered>
                <Typography.Text
                  strong
                  style={{ textAlign: "center", display: "block" }}
                >
                  THÔNG TIN BỆNH NHÂN
                </Typography.Text>
                <Divider />
                <Form.Item
                  label="Họ tên bệnh nhân"
                  name="patientName"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập họ tên bệnh nhân",
                    },
                  ]}
                >
                  <Input prefix={<UserOutlined />} />
                </Form.Item>
                <Form.Item
                  label="Giới tính"
                  name="gender"
                  rules={[
                    { required: true, message: "Vui lòng chọn giới tính" },
                  ]}
                >
                  <Radio.Group>
                    <Radio value="0">Nam</Radio>
                    <Radio value="1">Nữ</Radio>
                    <Radio value="2">Khác</Radio>
                  </Radio.Group>
                </Form.Item>
                <Form.Item
                  label="Số điện thoại"
                  name="phone"
                  rules={[
                    { required: true, message: "Vui lòng nhập số điện thoại" },
                    {
                      pattern: /^(0|\+84)[0-9]{9,10}$/,
                      message: "Số điện thoại không hợp lệ",
                    },
                  ]}
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
                  rules={[
                    { required: true, message: "Vui lòng chọn ngày sinh" },
                  ]}
                  getValueProps={(value) => ({
                    value: value ? new Date(value) : null,
                  })}
                >
                  <DatePicker
                    selected={dateOfBirth}
                    onChange={handleDateChange}
                    dateFormat="dd/MM/yyyy"
                    className="custom-datepicker"
                    placeholderText="Chọn ngày sinh"
                    showYearDropdown
                    scrollableMonthYearDropdown
                    showMonthDropdown
                    dropdownMode="select"
                    showPopperArrow={false}
                    customInput={
                      <Input
                        prefix={<CalendarOutlined />}
                        style={{ width: "100%" }}
                      />
                    }
                  />
                </Form.Item>
                <Form.Item
                  label="Địa chỉ"
                  name="address"
                  rules={[{ required: true, message: "Vui lòng nhập địa chỉ" }]}
                >
                  <Input prefix={<IoLocationSharp />} />
                </Form.Item>
                <Form.Item
                  label="Lý do khám"
                  name="lyDoKham"
                  rules={[
                    { required: true, message: "Vui lòng nhập lý do khám" },
                  ]}
                >
                  <TextArea />
                </Form.Item>
                <Form.Item
                  name="acceptPolicy"
                  valuePropName="checked"
                  rules={[
                    {
                      validator: (_, value) =>
                        value
                          ? Promise.resolve()
                          : Promise.reject("Bắt buộc đồng ý điều khoản"),
                    },
                  ]}
                >
                  <Checkbox>
                    Tôi đồng ý với{" "}
                    <a href="#">điều khoản và chính sách đặt lịch</a>
                  </Checkbox>
                </Form.Item>
              </Card>
            </Col>
            <Col span={10}>
              <Card bordered>
                {dataBacSi && (
                  <>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <Avatar
                        src={`${
                          import.meta.env.VITE_BACKEND_URL
                        }/public/images/upload/${dataBacSi.avatar}`}
                        size={64}
                      />
                      <div>
                        <Typography.Text strong>
                          {dataBacSi.fullName}
                        </Typography.Text>{" "}
                        {" - "}
                        <Typography.Text strong>
                          {decodeURIComponent(chuyenkhoa)}
                        </Typography.Text>
                      </div>
                    </div>
                    <div style={{ textAlign: "left" }}>
                      <Typography.Text>
                        Thời gian: {khungGioKham} -{" "}
                        {formatDateVietnamese(ngayKham)}
                      </Typography.Text>
                      <br />
                      <Typography.Text>
                        Hình thức khám:{" "}
                        <strong>
                          {hinhThucKham === "ONLINE"
                            ? "Khám trực tuyến"
                            : "Khám tại cơ sở"}
                        </strong>
                      </Typography.Text>
                    </div>
                    <Divider />
                    <div>
                      <Typography.Text>
                        <strong> Phí khám: {giaKham.toLocaleString()}đ</strong>
                      </Typography.Text>
                      <br></br>
                      <Typography.Text>
                        <strong>
                          Phí đặt lịch (30%):{" "}
                          {Math.floor(giaKham * 0.3).toLocaleString()}đ
                        </strong>
                      </Typography.Text>
                    </div>
                    <Divider />
                    {hinhThucKham === "ONLINE" && (
                      <Form.Item
                        label="Số tiền thanh toán"
                        name="soTienThanhToan"
                        rules={[
                          {
                            required: true,
                            message: "Vui lòng chọn số tiền thanh toán",
                          },
                        ]}
                      >
                        <Radio.Group
                          onChange={(e) => setSelectedSoTienTT(e.target.value)}
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 8,
                          }}
                        >
                          <Radio value="30">Thanh toán trước 30%</Radio>
                          <Radio value="100">Thanh toán toàn bộ</Radio>
                        </Radio.Group>
                      </Form.Item>
                    )}
                    {hinhThucKham === "OFFLINE" && (
                      <Form.Item
                        name="soTienThanhToan"
                        initialValue="30"
                        hidden
                      >
                        <Input />
                      </Form.Item>
                    )}
                    <Divider />
                    <Typography.Text strong>
                      Tổng thanh toán: {tongThanhToan.toLocaleString()}đ
                    </Typography.Text>
                    <Divider />
                    <Form.Item
                      label="Phương thức thanh toán"
                      name="hinhThucTT"
                      rules={[{ required: true }]}
                    >
                      <Radio.Group
                        className="payment-method-group"
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 12,
                        }}
                        onChange={(e) =>
                          setSelectedPaymentMethod(e.target.value)
                        }
                      >
                        {/* <Radio value="COD" style={radioStyle}>
                            {" "}
                            <div style={optionStyle}>
                              {" "}
                              <DollarOutlined
                                style={{
                                  fontSize: 20,
                                  color: "#1890ff",
                                  marginRight: 10,
                                }}
                              />{" "}
                              Thanh toán khi nhận hàng (COD){" "}
                            </div>{" "}
                          </Radio>{" "} */}
                        <Radio value="VNPAY" style={radioStyle}>
                          <div style={optionStyle}>
                            <img
                              src="/assets/images/IconVNPAY-QR.png"
                              alt="VNPAY"
                              style={{ height: 24, marginRight: 10 }}
                            />
                            Thanh toán qua VNPay
                          </div>
                        </Radio>
                        <Radio value="MOMO" style={radioStyle}>
                          <div style={optionStyle}>
                            <img
                              src="/assets/images/MoMo_Logo.png"
                              alt="MoMo"
                              style={{ height: 24, marginRight: 10 }}
                            />
                            Thanh toán qua Ví MoMo
                          </div>
                        </Radio>
                      </Radio.Group>
                    </Form.Item>
                    <Form.Item>
                      <Button
                        type="primary"
                        block
                        size="large"
                        loading={loadingSubmit}
                        onClick={() => {
                          handleClickSubmit();
                          console.log("Form values:", form.getFieldsValue());
                        }}
                      >
                        Xác nhận đặt lịch
                      </Button>
                      <Button
                        type="primary"
                        block
                        size="large"
                        loading={loadingSubmit}
                        onClick={() => {
                          console.log("Form values:", form.getFieldsValue());
                        }}
                      >
                        Test
                      </Button>
                    </Form.Item>
                  </>
                )}
              </Card>
            </Col>
          </Row>
        </Form>
      )}
      <LoginPage
        openModalLogin={openModalLogin}
        setOpenModalLogin={setOpenModalLogin}
      />
    </div>
  );
};

export default BookingAppointment;
