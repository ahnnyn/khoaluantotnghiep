import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Card,
  Row,
  Col,
  Avatar,
  Radio,
  Button,
  Divider,
  Breadcrumb,
} from "antd";
import {
  MailOutlined,
  PhoneOutlined,
  UserOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import { AiOutlineDownCircle } from "react-icons/ai";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale } from "react-datepicker";
import vi from "date-fns/locale/vi";
registerLocale("vi", vi);
import moment from "moment";
import {
  fetchDoctorByDepartment,
  fetchDepartmentByID,
  getWorkScheduleByDoctor,
} from "services/patient/patient.services";

import "./chuyenkhoa.css";
import { Layout } from "antd";
import SearchComponent from "components/SearchComponent/SearchComponent";
const { Content } = Layout;

const { Meta } = Card;

const HINH_THUC = [
  { value: "OFFLINE", label: "Trực tiếp" },
  { value: "ONLINE", label: "Trực tuyến" },
];

const ChuyenKhoaVaBacSi = () => {
  const { id } = useParams();
  const [doctors, setDoctors] = useState([]);
  const [expandedData, setExpandedData] = useState({});
  const [expandedId, setExpandedId] = useState(null);
  const [selectedMap, setSelectedMap] = useState({});
  const [dataSearch, setDataSearch] = useState("");
  const [allDoctors, setAllDoctors] = useState([]);
  const [khoaName, setKhoaName] = useState("");

  useEffect(() => {
    if (!id) return;

    fetchDepartmentByID(id)
      .then((res) => {
        setKhoaName(res.data?.name || "Không rõ khoa");
      })
      .catch((err) => {
        console.error("Lỗi khi lấy tên khoa:", err);
        setKhoaName("Không rõ khoa");
      });

    fetchDoctorByDepartment(id)
      .then((res) => {
        const data = res?.data || [];
        setAllDoctors(data);
        setDoctors(data);
      })
      .catch(console.error);
  }, [id]);

  const handleCardClick = (doctorId) => {
    if (expandedId === doctorId) {
      setExpandedId(null);
      return;
    }

    setExpandedId(doctorId);

    getWorkScheduleByDoctor(doctorId)
      .then((res) => {
        const raw = res?.data || [];

        // Lọc lịch đúng bác sĩ
        const filteredRaw = raw.filter((s) => s.doctorId === doctorId);

        const today = moment().startOf("day");
        const minDate = today.clone().add(3, "days");

        const hinhThuc = HINH_THUC[0].value;

        const validDates = filteredRaw
          .filter(
            (s) =>
              moment(s.date).isSameOrAfter(minDate, "day") &&
              s.slots?.some(
                (slot) =>
                  slot.examinationType === hinhThuc &&
                  slot.status === "available"
              )
          )
          .map((s) => moment(s.date).startOf("day"));

        let selectedDate = validDates[0] || null;
        let matchedSlots = [];

        if (!selectedDate) {
          // Nếu không có ngày hợp lệ, lấy ngày khám đầu tiên sau 3 ngày (nếu có)
          const fallbackSchedule = filteredRaw.find((s) =>
            moment(s.date).isSameOrAfter(minDate, "day")
          );
          selectedDate = fallbackSchedule
            ? moment(fallbackSchedule.date).startOf("day")
            : null;
        }

        if (selectedDate) {
          const matchedSchedule = filteredRaw.find((s) =>
            moment(s.date).isSame(selectedDate, "day")
          );

          matchedSlots =
            matchedSchedule?.slots?.filter(
              (slot) => slot.examinationType === hinhThuc //&& slot.status === "available"
            ) || [];
        }

        setExpandedData((prev) => ({
          ...prev,
          [doctorId]: {
            selected: {
              date: selectedDate,
              hinhThuc,
              timeSlot: null,
            },
            workSchedules: filteredRaw,
            availableDates: validDates,
            slots: matchedSlots,
          },
        }));
      })
      .catch(console.error);
  };

  const handleDateChange = (doctorId, date) => {
    const momentDate = moment(date);
    const doctorData = expandedData[doctorId];
    const matchedSchedule = doctorData.workSchedules.find((s) =>
      moment(s.date).isSame(momentDate, "day")
    );

    const matchedSlots =
      matchedSchedule?.slots?.filter(
        (slot) =>
          slot.examinationType === doctorData.selected.hinhThuc &&
          slot.status === "available"
      ) || [];

    setExpandedData((prev) => ({
      ...prev,
      [doctorId]: {
        ...prev[doctorId],
        selected: {
          ...prev[doctorId].selected,
          date: momentDate,
          timeSlot: null,
        },
        slots: matchedSlots,
      },
    }));
  };

  const handleHinhThucChange = (doctorId, hinhThuc) => {
    const doctorData = expandedData[doctorId];
    const today = moment().startOf("day");
    const minDate = today.clone().add(3, "days");

    const validDates = doctorData.workSchedules
      .filter(
        (s) =>
          moment(s.date).isSameOrAfter(minDate, "day") &&
          s.slots?.some(
            (slot) => slot.examinationType === hinhThuc //&& slot.status === "available"
          )
      )
      .map((s) => moment(s.date).startOf("day"));

    const currentSelectedDate = doctorData.selected.date;
    let selectedDate = currentSelectedDate;

    // Kiểm tra xem ngày đang chọn có hợp lệ không với hình thức mới
    const matchedScheduleAtCurrent = doctorData.workSchedules.find(
      (s) =>
        moment(s.date).isSame(currentSelectedDate, "day") &&
        s.slots?.some((slot) => slot.examinationType === hinhThuc)
    );

    if (!matchedScheduleAtCurrent) {
      // Nếu ngày hiện tại không còn slot cho hình thức này, fallback
      selectedDate = validDates[0] || null;
    }

    const matchedSchedule = doctorData.workSchedules.find((s) =>
      moment(s.date).isSame(selectedDate, "day")
    );

    const matchedSlots =
      matchedSchedule?.slots?.filter(
        (slot) => slot.examinationType === hinhThuc
      ) || [];

    setExpandedData((prev) => ({
      ...prev,
      [doctorId]: {
        ...prev[doctorId],
        selected: {
          date: selectedDate,
          hinhThuc,
          timeSlot: null,
        },
        availableDates: validDates,
        slots: matchedSlots,
      },
    }));
  };

  const handleBook = (doctor) => {
    const data = expandedData[doctor._id];
    const khoa =
      doctor.departmentId?.find((dep) => String(dep._id) === String(id))
        ?.name || "";
    const q = {
      id: doctor._id,
      fullName: doctor.fullName,
      ngayKham: data.selected.date?.format("YYYY-MM-DD"),
      hinhThuc: data.selected.hinhThuc,
      gioKham: data.selected.timeSlot,
      giaKham: doctor.price,
      chuyenkhoa: encodeURIComponent(khoa),
    };
    window.location.href = `/page-dat-lich-kham?` + new URLSearchParams(q);
  };

  const onSearch = (value) => {
    const keyword = value.toLowerCase().trim();
    const filtered = allDoctors.filter((doc) => {
      const name = doc.fullName || doc.hoTen || doc.name || "";
      return name.toLowerCase().includes(keyword);
    });
    setDoctors(filtered);
  };
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
      <Row style={{ marginTop: "20px" }}></Row>
      <Row justify="center">
        <Col xs={22} sm={20} md={16}>
          <Row justify="center">
            <Col xs={22} sm={20} md={16}>
              <Breadcrumb
                style={{
                  margin: "16px 0",
                  fontWeight: 500,
                  fontSize: 16,
                }}
                items={[
                  {
                    title: (
                      <Link
                        to="/"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                          color: "#1890ff",
                        }}
                      >
                        <HomeOutlined />
                        <span>Trang chủ</span>
                      </Link>
                    ),
                  },
                  {
                    title: (
                      <Link to="/dat-kham" style={{ color: "#1890ff" }}>
                        Đặt khám
                      </Link>
                    ),
                  },
                  {
                    title: (
                      <strong style={{ color: "#1890ff" }}>{khoaName}</strong>
                    ),
                  },
                ]}
              />
            </Col>
          </Row>
        </Col>
      </Row>
      <Row justify="center" style={{ marginTop: "20px", marginBottom: "20px" }}>
        <Col xs={22} sm={18} md={12}>
          <SearchComponent
            placeholder="Tìm bác sĩ theo tên"
            onSearch={onSearch}
          />
        </Col>
      </Row>
      <Content style={{ padding: "50px 50px 100px 50px" }}>
        <div className="grid-container">
          <Row gutter={[16, 16]}>
            {doctors
              .filter((doc) => doc.fullName?.toLowerCase().includes(dataSearch))
              .map((doc) => {
                const data = expandedData[doc._id] || {};
                const selected = data.selected || {};
                const slots = data.slots || [];
                const availableDates = data.availableDates || [];

                return (
                  <Col xs={24} sm={24} md={12} key={doc._id}>
                    <Card
                      hoverable
                      onClick={() => handleCardClick(doc._id)}
                      className={expandedId === doc._id ? "expanded" : ""}
                      style={{ maxWidth: 500, margin: "0 auto" }}
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
                      <div className="info">
                        <p>
                          <strong>Giới thiệu:</strong>{" "}
                          {doc.description || "Chưa có mô tả"}
                        </p>
                        <p className="icon-text email">
                          <MailOutlined />
                          <span>{doc.email}</span>
                        </p>
                        <p className="icon-text phone">
                          <PhoneOutlined />
                          <span>{doc.phone}</span>
                        </p>

                        <p>
                          <strong>Địa chỉ:</strong>{" "}
                          {doc.address || "Chưa cập nhật"}
                        </p>
                        <p>
                          <strong>Giá khám:</strong>{" "}
                          {doc.price?.toLocaleString()} VND
                        </p>
                      </div>
                      {expandedId !== doc._id && (
                        <div className="select-schedule-icon">
                          <span>Chọn lịch khám</span>
                          <AiOutlineDownCircle size={18} />
                        </div>
                      )}

                      {expandedId === doc._id && (
                        <>
                          <div className="schedule-section">
                            <div onClick={(e) => e.stopPropagation()}>
                              <DatePicker
                                selected={selected.date?.toDate()}
                                onChange={(date) =>
                                  handleDateChange(doc._id, date)
                                }
                                dateFormat="dd/MM/yyyy"
                                locale="vi"
                                includeDates={(() => {
                                  const dates = availableDates.map((d) =>
                                    d.toDate?.()
                                  );
                                  const selectedDate =
                                    selected.date?.toDate?.();
                                  if (
                                    selectedDate &&
                                    !dates.some((d) =>
                                      moment(d).isSame(selectedDate, "day")
                                    )
                                  ) {
                                    dates.push(selectedDate);
                                  }
                                  return dates;
                                })()}
                                placeholderText="Chọn ngày khám"
                                className="custom-datepicker"
                              />
                            </div>
                            <div onClick={(e) => e.stopPropagation()}>
                              <Radio.Group
                                options={HINH_THUC}
                                value={selected.hinhThuc}
                                onChange={(e) =>
                                  handleHinhThucChange(doc._id, e.target.value)
                                }
                                optionType="button"
                                buttonStyle="solid"
                                style={{ marginTop: 8 }}
                              />
                            </div>
                          </div>
                          <div
                            className="times"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {slots.length === 0 ? (
                              <div
                                className="no-slot"
                                style={{
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                  height: "20px",
                                  width: "100%",
                                }}
                              >
                                <p
                                  style={{
                                    color: "red",
                                    margin: 0,
                                  }}
                                >
                                  Không có khung giờ khám nào
                                </p>
                              </div>
                            ) : (
                              slots.map((slot) => {
                                const timeRange =
                                  slot?.timeSlotId?.timeRange || "Chưa có giờ";
                                const disabled =
                                  slot.status === "booked" ||
                                  slot.status !== "available";
                                const selectedSlot =
                                  selected.timeSlot === timeRange;

                                return (
                                  <Button
                                    key={slot._id}
                                    className={`time-btn ${
                                      selectedSlot ? "selected" : ""
                                    }`}
                                    disabled={disabled}
                                    onClick={() =>
                                      setExpandedData((prev) => ({
                                        ...prev,
                                        [doc._id]: {
                                          ...prev[doc._id],
                                          selected: {
                                            ...prev[doc._id].selected,
                                            timeSlot: timeRange,
                                          },
                                        },
                                      }))
                                    }
                                  >
                                    {timeRange}
                                  </Button>
                                );
                              })
                            )}
                          </div>

                          <div onClick={(e) => e.stopPropagation()}>
                            <Button
                              type="primary"
                              disabled={!selected.timeSlot}
                              className="book-btn"
                              onClick={() => handleBook(doc)}
                            >
                              Đặt lịch
                            </Button>
                          </div>
                        </>
                      )}
                    </Card>
                  </Col>
                );
              })}
          </Row>
        </div>
      </Content>
    </>
  );
};

export default ChuyenKhoaVaBacSi;
