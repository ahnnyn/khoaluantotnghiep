import React, { useEffect, useState } from "react";
import {
  Row,
  Col,
  Card,
  Avatar,
  Select,
  Radio,
  Button,
  Input,
  Typography,
  notification,
  Divider,
} from "antd";
import {
  CalendarOutlined,
  MailOutlined,
  MedicineBoxOutlined,
  PhoneOutlined,
  UserOutlined,
} from "@ant-design/icons";
import DatePicker from "react-datepicker";
import moment from "moment";
import "react-datepicker/dist/react-datepicker.css";
import {
  fetchAllDoctor,
  getWorkScheduleByDoctor,
  fetchPriceByDepartment,
} from "services/patient/patient.services";
import { Content } from "antd/es/layout/layout";
import LoginPage from "../Login/Login";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "./DoctorsList.scss";
import BreadcrumbCustom from "../../components/Breadcum/BreadcrumbCustom";
import { Stethoscope } from "lucide-react";
import { AiOutlineDownCircle } from "react-icons/ai";
const HINH_THUC = [
  { value: "OFFLINE", label: "Trực tiếp" },
  { value: "ONLINE", label: "Trực tuyến" },
];
const { Meta } = Card;
const { Option } = Select;
const { Paragraph, Text } = Typography;

const DoctorsList = () => {
  const [doctors, setDoctors] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [expandedData, setExpandedData] = useState({});
  const [priceList, setPriceList] = useState({});
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [openModalLogin, setOpenModalLogin] = useState(false);
  const [pendingBookingInfo, setPendingBookingInfo] = useState(null);
  const user = useSelector((state) => state.account.user);
  const navigate = useNavigate();

  const getPriceList = async (doctorId, departmentId) => {
    try {
      const res = await fetchPriceByDepartment(departmentId);
      setPriceList((prev) => ({
        ...prev,
        [doctorId]: res?.data || [],
      }));
    } catch (err) {
      console.error("Error fetching price:", err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const doctorRes = await fetchAllDoctor();
        const doctorList = doctorRes?.data || [];
        setDoctors(doctorList);

        await Promise.all(
          doctorList.map((doc) => {
            const departmentId = doc.departmentId?.[0]?._id;
            if (departmentId) {
              return getPriceList(doc._id, departmentId);
            }
            return null;
          })
        );
      } catch (error) {
        console.error("Error fetching doctor or price data:", error);
      }
    };

    fetchData();
  }, []);

  const getSlotsForDoctor = (workSchedules, date, hinhThuc) => {
    const schedule = workSchedules.find((s) =>
      moment(s.date).isSame(date, "day")
    );
    return (
      schedule?.slots?.filter(
        (slot) =>
          slot.examinationType === hinhThuc && slot.status === "available"
      ) || []
    );
  };

  const handleCardClick = async (doctorId) => {
    if (expandedId === doctorId) {
      setExpandedId(null);
      return;
    }
    setExpandedId(doctorId);

    const scheduleRes = await getWorkScheduleByDoctor(doctorId);
    const workSchedules = scheduleRes?.data || [];
    const minDate = moment().add(3, "days").startOf("day");
    const hinhThuc = HINH_THUC[0].value;

    const defaultDepartment = doctors.find((d) => d._id === doctorId)
      ?.departmentId?.[0]?._id;

    const validDates = workSchedules
      .filter(
        (s) =>
          moment(s.date).isSameOrAfter(minDate, "day") &&
          s.slots?.some(
            (slot) =>
              slot.examinationType === hinhThuc && slot.status === "available"
          )
      )
      .map((s) => moment(s.date).startOf("day"));

    const selectedDate = validDates[0] || null;
    const slots = getSlotsForDoctor(workSchedules, selectedDate, hinhThuc);

    setExpandedData((prev) => ({
      ...prev,
      [doctorId]: {
        workSchedules,
        selected: {
          department: defaultDepartment || null,
          hinhThuc,
          date: selectedDate,
          timeSlot: null,
        },
        availableDates: validDates,
        slots,
      },
    }));

    if (defaultDepartment) {
      await getPriceList(doctorId, defaultDepartment);
    }
  };

  const handleSelectionChange = async (doctorId, field, value) => {
    const doctorData = expandedData[doctorId];
    const updatedSelected = {
      ...doctorData.selected,
      [field]: value,
    };

    if (field !== "timeSlot") {
      updatedSelected.timeSlot = null;
    }

    let availableDates = doctorData.availableDates;
    let slots = doctorData.slots;

    if (field === "hinhThuc") {
      availableDates = doctorData.workSchedules
        .filter(
          (s) =>
            moment(s.date).isSameOrAfter(moment().add(3, "days"), "day") &&
            s.slots?.some(
              (slot) =>
                slot.examinationType === value && slot.status === "available"
            )
        )
        .map((s) => moment(s.date).startOf("day"));

      updatedSelected.date = availableDates[0] || null;
    }

    if (field === "hinhThuc" || field === "date") {
      slots = getSlotsForDoctor(
        doctorData.workSchedules,
        updatedSelected.date,
        updatedSelected.hinhThuc
      );
    }

    setExpandedData((prev) => ({
      ...prev,
      [doctorId]: {
        ...prev[doctorId],
        selected: updatedSelected,
        availableDates,
        slots,
      },
    }));

    if (field === "department") {
      await getPriceList(doctorId, value);
    }
  };

  const handleBooking = (doctor) => {
    const dataBooking = expandedData[doctor._id];

    if (!user?._id) {
      setPendingBookingInfo({
        doctor,
        selected: dataBooking.selected,
      });
      handleClickSubmit();
      return;
    }

    proceedToBooking(doctor, dataBooking.selected);
  };

  const proceedToBooking = (doctor, selected) => {
    const hinhThuc = selected.hinhThuc;
    const khoaId = selected.department;

    const khoa =
      doctor.departmentId?.find((dep) => String(dep._id) === String(khoaId))
        ?.name || "";

    const matchedPrice = priceList[doctor._id]?.find(
      (p) =>
        p.examinationType === hinhThuc &&
        String(p.departmentId?._id) === String(khoaId)
    );

    const q = {
      id: doctor._id,
      fullName: doctor.fullName,
      ngayKham: selected.date?.format("YYYY-MM-DD"),
      hinhThuc: selected.hinhThuc,
      gioKham: selected.timeSlot,
      giaKham: matchedPrice?.price || 0,
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

  return (
    <>
      <Row justify="center" style={{ marginTop: 24 }}>
        <Col xs={22} sm={20} md={16}>
          <Row>
            <Col xs={22} sm={20} md={16}>
              <BreadcrumbCustom
                items={[
                  {
                    title: "Danh sách bác sĩ",
                    icon: <Stethoscope />,
                  },
                ]}
              />
            </Col>
          </Row>
        </Col>
      </Row>
      <Divider style={{ margin: "16px 0" }} />
      <Content style={{ padding: "50px 50px 100px 50px" }}>
        <Row gutter={[16, 16]} justify="start">
          {doctors.map((doc) => {
            const isExpanded = expandedId === doc._id;
            const data = expandedData[doc._id] || {};
            const selected = data.selected || {};
            const matchedPrice = priceList[doc._id]?.find(
              (p) =>
                p.examinationType === selected.hinhThuc &&
                p.departmentId?._id === selected.department
            );

            return (
              <Col xs={24} sm={12} md={12} key={doc._id}>
                <Card
                  hoverable
                  onClick={() => handleCardClick(doc._id)}
                  style={{ maxWidth: 650, margin: "0 auto" }}
                >
                  <Meta
                    avatar={
                      <Avatar
                        size={64}
                        src={`${
                          import.meta.env.VITE_BACKEND_URL
                        }/public/images/upload/${doc.avatar}`}
                        icon={<UserOutlined />}
                      />
                    }
                    title={doc.fullName}
                    description={`${doc.positionId?.[0]?.name || ""} - ${
                      doc.departmentId?.[0]?.name || ""
                    }`}
                  />
                  <Divider style={{ margin: "16px 0" }} />
                  <div className="info">
                    <p className="icon-text phone">
                      <PhoneOutlined />
                      <span>{doc.phone}</span>
                    </p>
                    <p className="icon-text email">
                      <MailOutlined />
                      <span>{doc.email}</span>
                    </p>
                    <p>
                      <strong>Địa chỉ:</strong> {doc.address || "Chưa cập nhật"}
                    </p>

                    <p>
                      <strong>Giới thiệu:</strong>{" "}
                      {doc.description || "Chưa có mô tả"}
                    </p>
                  </div>
                  <Divider style={{ margin: "16px 0" }} />
                  <Paragraph>
                    Giá khám:{" "}
                    {matchedPrice?.price?.toLocaleString() || "Chưa có giá"} VND
                  </Paragraph>
                  {expandedId !== doc._id && (
                    <div className="select-schedule-icon">
                      <span>Chọn lịch khám</span>
                      <AiOutlineDownCircle size={18} />
                    </div>
                  )}

                  {isExpanded && (
                    <>
                      <Divider />
                      <div
                        style={{ marginTop: 12 }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Row gutter={[8, 8]} style={{ marginBottom: 8 }}>
                          <Col xs={24} md={8}>
                            <Select
                              className="select-custom"
                              value={selected.department}
                              onChange={(val) =>
                                handleSelectionChange(
                                  doc._id,
                                  "department",
                                  val
                                )
                              }
                              style={{ width: "100%" }}
                            >
                              {doc.departmentId?.map((dept) => (
                                <Option key={dept._id} value={dept._id}>
                                  {dept.name}
                                </Option>
                              ))}
                            </Select>
                          </Col>

                          <Col xs={24} md={8}>
                            <Radio.Group
                              className="radio-custom"
                              options={HINH_THUC}
                              value={selected.hinhThuc}
                              onChange={(e) =>
                                handleSelectionChange(
                                  doc._id,
                                  "hinhThuc",
                                  e.target.value
                                )
                              }
                              optionType="button"
                              buttonStyle="solid"
                            />
                          </Col>

                          <Col xs={24} md={8}>
                            <DatePicker
                              selected={selected.date?.toDate?.()}
                              onChange={(date) =>
                                handleSelectionChange(
                                  doc._id,
                                  "date",
                                  moment(date)
                                )
                              }
                              includeDates={data.availableDates?.map((d) =>
                                d.toDate?.()
                              )}
                              placeholderText="Chọn ngày khám"
                              className="datepicker-custom"
                              customInput={
                                <Input
                                  prefix={<CalendarOutlined />}
                                  style={{ width: "100%" }} // đảm bảo input bằng các control còn lại
                                />
                              }
                            />
                          </Col>
                          <Divider />
                        </Row>

                        <div className="slots-grid">
                          <Row gutter={[8, 8]}>
                            {data.slots?.length ? (
                              data.slots.map((slot) => (
                                <Col key={slot._id} xs={8} wrap>
                                  <Button
                                    className="slots-button"
                                    onClick={() =>
                                      handleSelectionChange(
                                        doc._id,
                                        "timeSlot",
                                        slot.timeSlotId?.timeRange
                                      )
                                    }
                                    disabled={slot.disabled}
                                    block
                                    type={
                                      selected?.timeSlot ===
                                      slot.timeSlotId.timeRange
                                        ? "primary"
                                        : "default"
                                    }
                                  >
                                    {slot.timeSlotId?.timeRange}
                                  </Button>
                                </Col>
                              ))
                            ) : (
                              <Text type="danger">Không có khung giờ khám</Text>
                            )}
                          </Row>
                        </div>
                        <Divider />
                        <div style={{ textAlign: "center", marginTop: 24 }}>
                          <Button
                            type="primary"
                            className="booking-button"
                            style={{ width: 200, height: 40, fontSize: 16 }}
                            disabled={!selected.timeSlot}
                            loading={loadingSubmit}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleBooking(doc);
                            }}
                          >
                            Đặt lịch
                          </Button>
                        </div>
                      </div>
                    </>
                  )}
                </Card>
              </Col>
            );
          })}
        </Row>
      </Content>
      <LoginPage
        openModalLogin={openModalLogin}
        setOpenModalLogin={setOpenModalLogin}
      />
    </>
  );
};

export default DoctorsList;
