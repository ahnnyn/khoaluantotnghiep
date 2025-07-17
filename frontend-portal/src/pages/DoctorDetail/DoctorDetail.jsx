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
  Space,
  Select,
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
import "./DoctorDetail.scss"; // Assuming you have a CSS file for styles
import {
  getWorkScheduleByDoctor,
  fetchPriceByDepartment,
} from "services/patient/patient.services";
import { getUserById } from "services/auth.user/user.auth.services";
import BreadcrumbCustom from "../../components/Breadcum/BreadcrumbCustom";

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

  const fetchAndSetPrice = async (departmentId, hinhThuc) => {
    try {
      const res = await fetchPriceByDepartment(departmentId);
      console.log("Price data:", res.data);
      if (res.data) {
        const matched = res.data.find((p) => p.examinationType === hinhThuc);
        setPrice(matched?.price || 0);
        console.log("Price fetched:", matched?.price || 0);
      } else {
        setPrice(res.data?.price || 0);
      }
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

  const handleBook = () => {
    if (!doctor?._id) return;
    const { selected } = workData;

    navigate(
      `/page-dat-lich-kham?` +
        new URLSearchParams({
          id: doctor._id,
          ngayKham: selected.date.format("YYYY-MM-DD"),
          gioKham: selected.timeSlot,
          giaKham: price.toString(),
          hinhThuc: selected.hinhThuc,
          fullName: doctor.fullName,
        })
    );
  };

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
          <Row>
            <Col xs={22} sm={20} md={16}>
              <BreadcrumbCustom
                items={[
                  {
                    title: "Chi tiết bác sĩ",
                    icon: <SolutionOutlined />,
                  },
                  {
                    title: `Bác sĩ ${fullName}`,
                    icon: <UserOutlined />,
                  },
                ]}
              />
            </Col>
          </Row>
        </Col>
      </Row>
      <Divider style={{ margin: "16px 100px" }} />
      <Row gutter={[24, 24]} className="doctor-detail" justify="center">
        {/* Cột trái - Thông tin bác sĩ */}
        <Col xs={24} md={12}>
          <Card className="profile-card">
            <Title level={4} style={{ marginBottom: 16, textAlign: "center" }}>
              THÔNG TIN BÁC SĨ
            </Title>
            <Divider />

            <Row gutter={[16, 16]} align="middle">
              <Col xs={24} sm={8} style={{ textAlign: "center" }}>
                <Avatar
                  size={100}
                  src={`${
                    import.meta.env.VITE_BACKEND_URL
                  }/public/images/upload/${avatar}`}
                  icon={<UserOutlined />}
                />
              </Col>
              <Col xs={24} sm={16}>
                <Title level={3}>{fullName}</Title>
                <Text type="secondary">
                  {positionId?.[0]?.name || ""} -{" "}
                  {departmentId?.[0]?.name || ""}
                </Text>
                <Divider />
                <p>
                  <MailOutlined /> {email || "Chưa cập nhật"}
                </p>
                <p>
                  <PhoneOutlined /> {phone || "Chưa cập nhật"}
                </p>
                <p>
                  <strong>Địa chỉ:</strong> {address || "Chưa cập nhật"}
                </p>
                <p>
                  <strong>Giới thiệu:</strong> {description || "Chưa có mô tả"}
                </p>
                <p>
                  <strong>Giá khám:</strong>{" "}
                  {price ? `${price.toLocaleString()} đ` : "Chưa có thông tin"}
                </p>
              </Col>
            </Row>
          </Card>
        </Col>

        {/* Cột phải - Đặt lịch khám */}
        <Col xs={24} md={12}>
          <Card className="profile-card">
            <Title level={4} style={{ marginBottom: 16, textAlign: "center" }}>
              LỊCH KHÁM
            </Title>

            <Divider />

            <Row gutter={[16, 16]}>
              {/* Chọn chuyên khoa */}
              <Col xs={24} md={8}>
                <div style={{ marginBottom: 10 }}>
                  <Text strong>Chọn chuyên khoa</Text>
                </div>{" "}
                <Select
                  placeholder="Chọn khoa"
                  style={{ width: "100%" }}
                  value={selectedDepartment}
                  onChange={handleDepartmentChange}
                >
                  {departmentId?.map((dept) => (
                    <Option key={dept._id} value={dept._id}>
                      {dept.name}
                    </Option>
                  ))}
                </Select>
              </Col>

              {/* Chọn hình thức */}
              <Col xs={24} md={8}>
                <div style={{ marginBottom: 10 }}>
                  <Text strong>Hình thức khám</Text>
                </div>
                <Radio.Group
                  options={HINH_THUC}
                  value={selected?.hinhThuc}
                  onChange={(e) => handleHinhThucChange(e.target.value)}
                  optionType="button"
                  buttonStyle="solid"
                  style={{ width: "100%" }}
                />
              </Col>

              {/* Chọn ngày */}
              <Col xs={24} md={8}>
                <div style={{ marginBottom: 10 }}>
                  <Text strong>Ngày khám</Text>
                </div>
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
                  showYearDropdown
                  scrollableMonthYearDropdown
                  showMonthDropdown
                  dropdownMode="select"
                  showPopperArrow={false}
                />
              </Col>
            </Row>

            <Divider />

            {/* Danh sách khung giờ */}
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
                        style={{ width: "150px", height: "40px" }}
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

            {/* Nút đặt lịch */}
            <div style={{ textAlign: "center", marginTop: 24 }}>
              <Button
                type="primary"
                className="booking-button"
                disabled={!selected?.timeSlot}
                onClick={handleBook}
              >
                Đặt lịch ngay
              </Button>
            </div>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default DoctorDetail;
