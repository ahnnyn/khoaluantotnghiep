import {
  Button,
  Calendar,
  Col,
  DatePicker,
  Divider,
  Form,
  Input,
  Modal,
  Row,
  Select,
  Space,
  Table,
  Tag,
  message,
} from "antd";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { useEffect, useState } from "react";
import "./DoctorWorkSchedule.scss";
import {
  getUserById,
  getAllCoordinators,
} from "services/user/user.auth.services";
import {
  fetchAllTimeSlots,
  fetchWorkScheduleByDoctor,
  createWorkSchedule,
  sendEmailSchedule,
} from "services/doctor/doctors.services";
import { useSelector } from "react-redux";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import utc from "dayjs/plugin/utc";

dayjs.locale("vi");
dayjs.extend(utc);

const statusMap = {
  available: "Còn trống",
  booked: "Đã đặt",
  unavailable: "Không khả dụng",
};

const examStatusMap = {
  pending: "Chờ khám",
  in_progress: "Đang khám",
  completed: "Đã khám",
  cancelled: "Đã hủy",
};

const DoctorWorkSchedule = () => {
  const [form] = Form.useForm();
  const [dataDoctor, setDataDoctor] = useState({});
  const [dataTime, setDataTime] = useState([]);
  const [workSchedules, setWorkSchedules] = useState([]);
  const [columns, setColumns] = useState([]);
  const [data, setData] = useState([]);
  const [selectedWeek, setSelectedWeek] = useState(dayjs().startOf("week"));
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [selectedType, setSelectedType] = useState(null);
  const [selectedTimes, setSelectedTimes] = useState([]);
  const [disabledSlots, setDisabledSlots] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mailContent, setMailContent] = useState("");
  const [mailSubject, setMailSubject] = useState("");
  const [receiverEmail, setReceiverEmail] = useState("");
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [userOptions, setUserOptions] = useState([]);
  const [isloading, setIsLoading] = useState(false);
  const user = useSelector((state) => state.account.user);

  useEffect(() => {
    fetchDoctors();
    fetchAllTimes();
    fectchCoordinators();
  }, []);

  useEffect(() => {
    if (dataDoctor?._id) {
      fetchDoctorSchedule(dataDoctor._id);
    }
  }, [dataDoctor, selectedWeek]);

  useEffect(() => {
    if (selectedDate && selectedType) {
      const matched = workSchedules.find(
        (s) =>
          dayjs(s.date).local().format("YYYY-MM-DD") ===
          selectedDate.format("YYYY-MM-DD")
      );

      const matchedSlots = matched?.slots || [];

      const active = matchedSlots
        .filter((slot) => slot.examinationType === selectedType)
        .map((slot) => slot.timeSlotId?._id);

      const disabled = matchedSlots
        .filter((slot) => slot.examinationType !== selectedType)
        .map((slot) => slot.timeSlotId?._id);

      setSelectedTimes(active || []);
      setDisabledSlots(disabled || []);
    } else {
      setSelectedTimes([]);
      setDisabledSlots([]);
    }
  }, [selectedDate, selectedType, workSchedules]);

  const fetchDoctors = async () => {
    try {
      const res = await getUserById(user._id);
      if (res?.data) {
        setDataDoctor(res.data);
      }
    } catch (error) {
      console.error("Error fetching doctor data:", error);
    }
  };

  const fectchCoordinators = async () => {
    try {
      const res = await getAllCoordinators();
      console.log("Coordinators data:", res.data);
      if (res?.data) {
        const options = res.data.map((coordinator) => ({
          label: `${coordinator.fullName} (${coordinator.email})`,
          value: coordinator._id,
          email: coordinator.email,
        }));
        setUserOptions(options);
      }
    } catch (error) {
      console.error("Error fetching coordinators:", error);
    }
  };
  const fetchAllTimes = async () => {
    const res = await fetchAllTimeSlots();
    if (res?.data) {
      const sortedTime = [...res.data].sort((a, b) => {
        const [aStart] = a.timeRange.split("-");
        const [bStart] = b.timeRange.split("-");

        return dayjs(aStart, "HH:mm").isBefore(dayjs(bStart, "HH:mm")) ? -1 : 1;
      });

      setDataTime(sortedTime);
    }
  };
  const fetchDoctorSchedule = async (id) => {
    try {
      const res = await fetchWorkScheduleByDoctor(id);
      setWorkSchedules(res.data || []);
    } catch (error) {
      console.error("Error fetching work schedule:", error);
    }
  };

  const changeWeek = (direction) => {
    const newWeek =
      direction === "prev"
        ? selectedWeek.subtract(1, "week")
        : selectedWeek.add(1, "week");
    setSelectedWeek(newWeek.startOf("week"));
  };

  useEffect(() => {
    const startOfWeek = selectedWeek.startOf("week");
    const days = Array.from({ length: 7 }, (_, i) => startOfWeek.add(i, "day"));
    const capitalizeFirstLetter = (str) =>
      str.charAt(0).toUpperCase() + str.slice(1);
    const columns = [
      {
        title: "Khung giờ",
        dataIndex: "timeRange",
        key: "timeRange",
        fixed: "left",
      },
      ...days.map((day) => {
        const capitalizedDay = capitalizeFirstLetter(day.format("dddd"));
        return {
          title: `${capitalizedDay}, ${day.format("DD/MM")}`,
          dataIndex: day.format("YYYY-MM-DD"),
          key: day.format("YYYY-MM-DD"),
          render: (slots) => (
            <Space direction="vertical">
              {slots?.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    background: "#e6f7ff",
                    border: "1px solid #91d5ff",
                    padding: 8,
                    borderRadius: 4,
                  }}
                >
                  <Tag
                    color={
                      item.examinationType === "OFFLINE" ? "green" : "blue"
                    }
                  >
                    {item.examinationType === "OFFLINE"
                      ? "Chuyên khoa"
                      : "Trực tuyến"}{" "}
                    - {statusMap[item.status] || item.status}
                  </Tag>
                  {item.examinationId && (
                    <div style={{ marginTop: 4 }}>
                      <Tag
                        color={
                          item.examinationId.status === "completed"
                            ? "green"
                            : item.examinationId.status === "cancelled"
                            ? "red"
                            : "orange"
                        }
                      >
                        {examStatusMap[item.examinationId.status] ||
                          item.examinationId.status}
                      </Tag>
                      <Tag color="purple">
                        {item.examinationId.patientProfileId?.fullName ||
                          "Chưa có bệnh nhân"}
                      </Tag>
                    </div>
                  )}
                </div>
              ))}
            </Space>
          ),
        };
      }),
    ];

    const rows = Array.isArray(dataTime)
      ? dataTime.map((timeSlot) => {
          const row = {
            key: timeSlot._id,
            timeRange: timeSlot.timeRange,
          };

          days.forEach((day) => {
            const dateStr = day.format("YYYY-MM-DD");

            const matchedSchedules = workSchedules.find(
              (s) => dayjs(s.date).local().format("YYYY-MM-DD") === dateStr
            );

            const matchedSlots = matchedSchedules?.slots?.filter(
              (slot) => slot.timeSlotId?.timeRange === timeSlot.timeRange
            );

            row[dateStr] = matchedSlots || [];
          });

          return row;
        })
      : [];

    setColumns(columns);
    setData(rows);
  }, [workSchedules, selectedWeek, dataTime]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setSelectedTimes([]);
  };

  const handleTypeChange = (value) => {
    setSelectedType(value);
    setSelectedTimes([]);
  };

  const handleCreateSchedule = async () => {
    if (
      !dataDoctor?._id ||
      !selectedDate ||
      !selectedType ||
      selectedTimes.length === 0
    ) {
      message.error("Vui lòng chọn đầy đủ thông tin để tạo lịch làm việc.");
      return;
    }

    try {
      const scheduleData = {
        doctorId: dataDoctor._id,
        date: dayjs(selectedDate).startOf("day").add(7, "hour").toDate(),
        slots: selectedTimes.map((id) => ({
          timeSlotId: id,
          examinationType: selectedType,
          status: "available",
        })),
      };

      console.log("Creating schedule with data:", scheduleData);
      await createWorkSchedule(scheduleData);
      message.success("Tạo lịch làm việc thành công");
      fetchDoctorSchedule(dataDoctor._id);
      handleTypeChange(selectedType);
    } catch (error) {
      console.error(error);
      message.error("Lỗi khi tạo lịch làm việc");
    }
  };

  useEffect(() => {
    console.log("Selected times updated:", selectedTimes);
  }, [selectedTimes]);

  const handleSendEmail = async () => {
    if (isloading) return;
    setIsLoading(true);

    if (!receiverEmail || !mailSubject || !mailContent) {
      message.error("Vui lòng điền đầy đủ thông tin email.");
      setIsLoading(false);
      return;
    }

    const emailData = {
      email: receiverEmail,
      subject: mailSubject,
      message: mailContent,
    };

    try {
      console.log("Sending email with data:", emailData);
      await sendEmailSchedule(emailData);
      message.success("Email đã được gửi thành công!");

      setIsModalOpen(false);
      setMailSubject("");
      setMailContent("");
      setReceiverEmail("");
      setSelectedUserId(null);
    } catch (error) {
      console.error("Error sending email:", error);
      message.error("Gửi email thất bại.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Row>
        <Col
          span={24}
          style={{
            padding: "10px 0 30px",
            fontSize: "20px",
            textAlign: "center",
          }}
        >
          <span style={{ fontWeight: "550", color: "#2A95BF" }}>
            ĐĂNG KÝ LỊCH LÀM VIỆC
          </span>
        </Col>
      </Row>

      <Form form={form} onFinish={handleCreateSchedule}>
        <Row gutter={[16, 16]} justify="center">
          <Col span={8}>
            <Form.Item
              label="Chọn ngày"
              name="date"
              rules={[{ required: true, message: "Vui lòng chọn ngày!" }]}
            >
              <DatePicker
                value={selectedDate}
                onChange={handleDateChange}
                format="DD/MM/YYYY"
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item
              label="Hình thức khám"
              name="type"
              rules={[
                { required: true, message: "Vui lòng chọn hình thức khám!" },
              ]}
            >
              <Select
                value={selectedType}
                onChange={handleTypeChange}
                placeholder="Chọn hình thức"
              >
                <Select.Option value="OFFLINE">Chuyên khoa</Select.Option>
                <Select.Option value="ONLINE">Trực tuyến</Select.Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[16, 16]} justify="center">
          {Array.isArray(dataTime) &&
            dataTime.map((time) => {
              const isDisabled =
                !selectedDate ||
                !selectedType ||
                disabledSlots.includes(time._id);
              const isSelected = selectedTimes.includes(time._id);

              return (
                <Col key={time._id} span={3}>
                  <Button
                    type={isSelected ? "primary" : "default"}
                    style={{
                      backgroundColor: isSelected ? "#1890ff" : undefined,
                      borderColor: isSelected ? "#1890ff" : undefined,
                      color: isSelected ? "#fff" : undefined,
                    }}
                    disabled={isDisabled}
                    block
                    onClick={() => {
                      setSelectedTimes((prev) =>
                        prev.includes(time._id)
                          ? prev.filter((id) => id !== time._id)
                          : [...prev, time._id]
                      );
                    }}
                  >
                    {time.timeRange}
                  </Button>
                </Col>
              );
            })}
        </Row>

        <Row justify="center" style={{ marginTop: 20 }}>
          <Button
            type="primary"
            htmlType="submit"
            style={{
              width: "200px",
              height: "40px",
              backgroundColor: "#2A95BF",
            }}
          >
            LƯU LỊCH
          </Button>
        </Row>
      </Form>

      <Divider />

      <Row>
        <Col
          span={24}
          style={{
            padding: "10px 0 20px",
            fontSize: "20px",
            textAlign: "center",
          }}
        >
          <span style={{ fontWeight: "550", color: "#2A95BF" }}>
            LỊCH LÀM VIỆC
          </span>
        </Col>
      </Row>

      <Row justify="center" gutter={[16, 16]} align="middle">
        <Col>
          <Button onClick={() => changeWeek("prev")}>Tuần trước</Button>
        </Col>
        <Col>
          <DatePicker
            value={selectedWeek}
            onChange={(date) => setSelectedWeek(date.startOf("week"))}
            format="DD/MM/YYYY"
          />
        </Col>
        <Col>
          <Button onClick={() => changeWeek("next")}>Tuần sau</Button>
        </Col>

        {/* <Col>
          <Calendar
            fullscreen={false}
            value={selectedWeek}
            onSelect={(date) => setSelectedWeek(date.startOf("week"))}
            headerRender={() => null}
            style={{ width: 300, marginTop: 20 }}
          />  
        </Col> */}
      </Row>
      <Row justify="center" style={{ marginTop: 40 }}>
        <Button
          type="primary"
          onClick={() => setIsModalOpen(true)}
          style={{ width: "auto", height: "40px", backgroundColor: "#2A95BF" }}
        >
          Gửi mail điều chỉnh lịch cho điều phối viên
        </Button>
      </Row>

      <Table
        columns={columns}
        dataSource={data}
        bordered
        pagination={false}
        scroll={{ x: "max-content" }}
        style={{ marginTop: 20, marginBottom: 100 }}
      />

      {/* Modal for sending email */}
      <Modal
        title={
          <div style={{ textAlign: "center", width: "100%" }}>
            GỬI MAIL ĐIỀU CHỈNH LỊCH LÀM VIỆC
          </div>
        }
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null} // ✨ Ẩn footer mặc định
        width={800}
      >
        <Form layout="vertical">
          <Form.Item label="Email người nhận">
            <Input
              value={receiverEmail}
              onChange={(e) => setReceiverEmail(e.target.value)}
              placeholder="Nhập email người nhận"
            />
          </Form.Item>

          <Form.Item label="Hoặc chọn từ danh sách người dùng">
            <Select
              showSearch
              placeholder="Tìm kiếm điều phối viên theo tên"
              value={selectedUserId}
              onChange={(value) => {
                setSelectedUserId(value);
                const selected = userOptions.find((u) => u.value === value);
                setReceiverEmail(selected?.email || "");
              }}
              options={userOptions}
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
            />
          </Form.Item>
          <Form.Item label="Tiêu đề email">
            <Input
              value={mailSubject}
              onChange={(e) => setMailSubject(e.target.value)}
              placeholder="Ví dụ: Yêu cầu điều chỉnh lịch làm việc tuần sau"
              style={{ color: "#8e9091ff" }}
            />
          </Form.Item>

          <Form.Item label="Nội dung email">
            <CKEditor
              editor={ClassicEditor}
              data={mailContent}
              onChange={(_, editor) => {
                const data = editor.getData();
                setMailContent(data);
              }}
            />
          </Form.Item>

          {/*Custom Footer */}
          <Form.Item>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 10,
                marginTop: 24,
              }}
            >
              <Button onClick={() => setIsModalOpen(false)}>Hủy</Button>
              <Button
                type="primary"
                loading={isloading}
                disabled={!receiverEmail || !mailSubject || !mailContent}
                onClick={() => {
                  console.log("Tiêu đề:", mailSubject);
                  console.log("Nội dung:", mailContent);
                  handleSendEmail();
                }}
              >
                Gửi mail
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default DoctorWorkSchedule;
