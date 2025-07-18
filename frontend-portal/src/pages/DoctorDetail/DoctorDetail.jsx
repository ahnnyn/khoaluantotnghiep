""; // DoctorDetail.tsx (rút gọn & gộp 2 card thành 1 - trình bày theo chiều dọc)

import React, { useEffect, useState } from "react";
import {
  Avatar,
  Button,
  Card,
  Col,
  Row,
  Radio,
  Input,
  Typography,
  Divider,
  Select,
  notification,
} from "antd";
import {
  CalendarOutlined,
  MailOutlined,
  PhoneOutlined,
  SolutionOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useParams, useNavigate } from "react-router-dom";
import moment from "moment";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./DoctorDetail.scss";
import {
  getWorkScheduleByDoctor,
  fetchPriceByDepartment,
} from "services/patient/patient.services";
import { getUserById } from "services/auth.user/user.auth.services";
import BreadcrumbCustom from "../../components/Breadcum/BreadcrumbCustom";
import { Stethoscope } from "lucide-react";
import { useSelector } from "react-redux";
import LoginPage from "../Login/Login";

const { Title, Text } = Typography;
const { Option } = Select;

const HINH_THUC = [
  { value: "OFFLINE", label: "Trực tiếp" },
  { value: "ONLINE", label: "Trực tuyến" },
];

const DoctorDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [doctor, setDoctor] = useState(null);
  const [workData, setWorkData] = useState({});
  const [price, setPrice] = useState(0);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [openModalLogin, setOpenModalLogin] = useState(false);
  const [pendingBookingInfo, setPendingBookingInfo] = useState(null);
  const user = useSelector((state) => state.account.user);

  const fetchAndSetPrice = async (departmentId, hinhThuc) => {
    try {
      const res = await fetchPriceByDepartment(departmentId);
      const matched = res.data.find((p) => p.examinationType === hinhThuc);
      setPrice(matched?.price || 0);
    } catch (err) {
      console.error("Error fetching price:", err);
      setPrice(0);
    }
  };

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const res = await getUserById(id);
        const doctorData = res.data;
        setDoctor(doctorData);

        if (doctorData.departmentId?.length > 0) {
          const defaultDept = doctorData.departmentId[0];
          setSelectedDepartment(defaultDept._id);
          fetchAndSetPrice(defaultDept._id, HINH_THUC[0].value);
        }
      } catch (err) {
        console.error("Error fetching doctor:", err);
      }
    };

    fetchDoctor();
  }, [id]);

  useEffect(() => {
    if (!doctor?._id) return;

    getWorkScheduleByDoctor(doctor._id).then((res) => {
      const data = res.data.filter((s) =>
        moment(s.date).isSameOrAfter(moment().add(3, "days"), "day")
      );

      const hinhThuc = HINH_THUC[0].value;
      const validDates = data
        .filter((s) =>
          s.slots?.some((slot) => slot.examinationType === hinhThuc)
        )
        .map((s) => moment(s.date).startOf("day"));

      const selectedDate = validDates[0] || null;
      const matchedSchedule = data.find((s) =>
        moment(s.date).isSame(selectedDate, "day")
      );
      const slots =
        matchedSchedule?.slots?.filter((s) => s.examinationType === hinhThuc) ||
        [];

      setWorkData({
        selected: { date: selectedDate, hinhThuc, timeSlot: null },
        workSchedules: data,
        availableDates: validDates,
        slots,
      });
    });
  }, [doctor]);

  const handleDateChange = (date) => {
    const momentDate = moment(date);
    const schedule = workData.workSchedules.find((s) =>
      moment(s.date).isSame(momentDate, "day")
    );
    const slots =
      schedule?.slots?.filter(
        (s) => s.examinationType === workData.selected.hinhThuc
      ) || [];

    setWorkData((prev) => ({
      ...prev,
      selected: { ...prev.selected, date: momentDate, timeSlot: null },
      slots,
    }));
  };

  const handleHinhThucChange = async (val) => {
    const dates = workData.workSchedules
      .filter((s) => s.slots?.some((slot) => slot.examinationType === val))
      .map((s) => moment(s.date).startOf("day"));

    const selectedDate = dates[0] || null;
    const schedule = workData.workSchedules.find((s) =>
      moment(s.date).isSame(selectedDate, "day")
    );
    const slots =
      schedule?.slots?.filter((s) => s.examinationType === val) || [];

    setWorkData((prev) => ({
      ...prev,
      selected: { hinhThuc: val, date: selectedDate, timeSlot: null },
      availableDates: dates,
      slots,
    }));

    if (selectedDepartment) {
      fetchAndSetPrice(selectedDepartment, val);
    }
  };

  const handleDepartmentChange = async (deptId) => {
    setSelectedDepartment(deptId);
    fetchAndSetPrice(
      deptId,
      workData?.selected?.hinhThuc || HINH_THUC[0].value
    );
  };

  const handleBooking = () => {
    if (!doctor?._id || !selected?.timeSlot || !selected?.date) return;

    if (!user?._id) {
      setPendingBookingInfo({
        doctor,
        selected,
      });
      handleClickSubmit();
      return;
    }

    proceedToBooking(doctor, selected);
  };

  const proceedToBooking = (doctor, selected) => {
    const hinhThuc = selected.hinhThuc;
    const khoaId = selectedDepartment;

    const khoa =
      doctor.departmentId?.find((dep) => String(dep._id) === String(khoaId))
        ?.name || "";

    const q = {
      id: doctor._id,
      fullName: doctor.fullName,
      ngayKham: selected.date?.format("YYYY-MM-DD"),
      hinhThuc: selected.hinhThuc,
      gioKham: selected.timeSlot,
      giaKham: price?.toString() || "0",
      chuyenkhoa: encodeURIComponent(khoa),
    };

    window.location.href = `/page-dat-lich-kham?` + new URLSearchParams(q);
  };

  useEffect(() => {
    if (user?._id && pendingBookingInfo) {
      proceedToBooking(pendingBookingInfo.doctor, pendingBookingInfo.selected);
      setPendingBookingInfo(null);
    }
  }, [user, pendingBookingInfo]);

  const handleClickSubmit = () => {
    notification.warning({
      message: "Cảnh báo",
      description: notificationContent(),
    });
  };

  const notificationContent = () => (
    <div>
      <span>
        Vui lòng đăng nhập trước khi đặt lịch! <br /> Bấm vào đây để
      </span>
      <Button
        type="link"
        style={{ marginLeft: "8px" }}
        onClick={() => {
          setOpenModalLogin(true);
        }}
      >
        Tiến hành đăng nhập
      </Button>
    </div>
  );

  if (!doctor) return null;

  const {
    fullName,
    email,
    phone,
    address,
    avatar,
    description,
    departmentId,
    positionId,
  } = doctor;

  const { selected, slots, availableDates } = workData;

  return (
    <>
      <Row justify="center" style={{ marginTop: 25 }}>
        <Col xs={22} sm={20} md={16}>
          <BreadcrumbCustom
            items={[
              { title: "Chi tiết bác sĩ", icon: <SolutionOutlined /> },
              { title: `Bác sĩ ${fullName}`, icon: <Stethoscope /> },
            ]}
          />
        </Col>
      </Row>

      <Divider style={{ margin: "16px 100px" }} />

      <Row justify="center" className="doctor-detail">
        <Card className="profile-card">
          <Row gutter={[24, 24]}>
            {/* LEFT: Doctor Info */}
            <Col xs={24} md={10} className="doctor-info">
              <div className="doctor-info-box">
                <div className="doctor-header">
                  <Avatar
                    size={100}
                    src={`${
                      import.meta.env.VITE_BACKEND_URL
                    }/public/images/upload/${avatar}`}
                    icon={<UserOutlined />}
                  />

                  <div>
                    <Title level={3} className="doctor-name">
                      {fullName}
                    </Title>
                    <Text type="secondary">
                      {positionId?.[0]?.name || ""} -{" "}
                      {departmentId?.[0]?.name || ""}
                    </Text>
                  </div>
                </div>

                <Divider />
                <div className="info-group">
                  <p className="info-item">
                    <MailOutlined /> <span>&nbsp;{email || "Chưa cập nhật"}</span>
                  </p>
                  <p className="info-item">
                    <PhoneOutlined /> <span>&nbsp;{phone || "Chưa cập nhật"}</span>
                  </p>
                  <p className="info-item">
                    <strong>Địa chỉ:</strong>&nbsp;{address || "Chưa cập nhật"}
                  </p>
                  <p className="info-item">
                    <strong>Giới thiệu:</strong>&nbsp;
                    {description || "Chưa có mô tả"}
                  </p>

                  <Divider />
                  <p className="info-item" style={{fontSize: "16px"}}>
                    <strong>Giá khám:</strong>&nbsp;
                    {price
                      ? `${price.toLocaleString()} đ`
                      : "Chưa có thông tin"}
                  </p>
                </div>
              </div>
            </Col>

            {/* RIGHT: Booking Info */}
            <Col xs={24} md={14} className="booking-section">
              <div className="schedule-group">
                <Row gutter={[16, 16]}>
                  <Col xs={24} md={8}>
                    <Text strong>Chuyên khoa</Text>
                    <Select
                      value={selectedDepartment}
                      onChange={handleDepartmentChange}
                      style={{ width: "100%" }}
                    >
                      {departmentId?.map((dept) => (
                        <Option key={dept._id} value={dept._id}>
                          {dept.name}
                        </Option>
                      ))}
                    </Select>
                  </Col>

                  <Col xs={24} md={8}>
                    <Text strong>Hình thức</Text>
                    <Radio.Group
                      options={HINH_THUC}
                      value={selected?.hinhThuc}
                      onChange={(e) => handleHinhThucChange(e.target.value)}
                      optionType="button"
                      buttonStyle="solid"
                      style={{ width: "100%" }}
                    />
                  </Col>

                  <Col xs={24} md={8}>
                    <Text strong>Ngày khám</Text>
                    <DatePicker
                      selected={selected?.date?.toDate()}
                      onChange={handleDateChange}
                      dateFormat="dd/MM/yyyy"
                      includeDates={availableDates?.map((d) => d.toDate())}
                      placeholderText="Chọn ngày"
                      className="custom-datepicker"
                      customInput={
                        <Input
                          prefix={<CalendarOutlined />}
                          style={{ width: "100%" }}
                        />
                      }
                    />
                  </Col>
                </Row>

                <Divider />
                <div className="slots-grid">
                  {slots?.length === 0 ? (
                    <Text type="danger">Không có khung giờ khám nào</Text>
                  ) : (
                    <Row gutter={[8, 8]}>
                      {slots?.map((slot) => (
                        <Col key={slot._id} xs={8}>
                          <Button
                            block
                            className="slot-button"
                            type={
                              selected?.timeSlot === slot.timeSlotId.timeRange
                                ? "primary"
                                : "default"
                            }
                            onClick={() =>
                              setWorkData((prev) => ({
                                ...prev,
                                selected: {
                                  ...prev.selected,
                                  timeSlot: slot.timeSlotId.timeRange,
                                },
                              }))
                            }
                          >
                            {slot.timeSlotId.timeRange}
                          </Button>
                        </Col>
                      ))}
                    </Row>
                  )}
                </div>
                <Divider />

                <div style={{ textAlign: "center" }}>
                  <Button
                    type="primary"
                    className="booking-button"
                    loading={loadingSubmit}
                    disabled={!selected?.timeSlot}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleBooking();
                    }}
                  >
                    Đặt lịch ngay
                  </Button>
                </div>
              </div>
            </Col>
          </Row>
        </Card>
      </Row>
      <LoginPage
        openModalLogin={openModalLogin}
        setOpenModalLogin={setOpenModalLogin}
      />
    </>
  );
};

export default DoctorDetail;
