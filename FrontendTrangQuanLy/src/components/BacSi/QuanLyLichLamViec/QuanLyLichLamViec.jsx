import {
  Badge,
  Button,
  Calendar,
  Col,
  DatePicker,
  Divider,
  Form,
  Row,
  Select,
  Space,
  Table,
  Tag,
  message,
} from "antd";
import { useEffect, useState } from "react";
import moment from "moment";
import "./css.scss";
import { getUserById } from "../../../services/user/user.auth.services";
import {
  fetchAllTimeSlots,
  fetchWorkScheduleByDoctor,
  createWorkSchedule
} from "services/doctor/doctors.services";
import { useSelector } from "react-redux";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import utc from "dayjs/plugin/utc";


dayjs.locale("vi");
dayjs.extend(utc);


const statusMap = {
  available: "Sẵn sàng",
  booked: "Đã đặt",
  unavailable: "Không khả dụng",
};

const examStatusMap = {
  pending: "Chờ khám",
  in_progress: "Đang khám",
  completed: "Đã khám",
  cancelled: "Đã hủy",
};

const QuanLyLichLamViec = () => {
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

  const user = useSelector((state) => state.account.user);

  useEffect(() => {
    fetchDoctors();
    fetchAllTimes();
  }, []);

  useEffect(() => {
    if (dataDoctor?._id) {
      fetchDoctorSchedule(dataDoctor._id);
    }
  }, [dataDoctor, selectedWeek]);

  useEffect(() => {
    if (selectedDate && selectedType) {
      const matched = workSchedules.find(
        (s) =>dayjs(s.date).local().format("YYYY-MM-DD") === selectedDate.format("YYYY-MM-DD")
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

  const fetchAllTimes = async () => {
    const res = await fetchAllTimeSlots();
    if (res?.data) setDataTime(res.data);
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
    const newWeek = direction === "prev"
      ? selectedWeek.subtract(1, "week")
      : selectedWeek.add(1, "week");
    setSelectedWeek(newWeek.startOf("week"));
  };

  useEffect(() => {
    const startOfWeek = selectedWeek.startOf("week");
    const days = Array.from({ length: 7 }, (_, i) => startOfWeek.add(i, "day"));

    const columns = [
      {
        title: "Khung giờ",
        dataIndex: "timeRange",
        key: "timeRange",
        fixed: "left",
      },
      ...days.map((day) => ({
        title: day.format("dddd, DD/MM"),
        dataIndex: day.format("YYYY-MM-DD"),
        key: day.format("YYYY-MM-DD"),
        render: (slots) => (
          <Space direction="vertical">
            {slots?.map((item, idx) => (
              <div key={idx} style={{ background: "#e6f7ff", border: "1px solid #91d5ff", padding: 8, borderRadius: 4 }}>
                <Tag color={item.examinationType === "OFFLINE" ? "green" : "blue"}>
                  {item.examinationType === "OFFLINE" ? "Chuyên khoa" : "Trực tuyến"} - {statusMap[item.status] || item.status}
                </Tag>
                {item.examinationId && (
                  <div style={{ marginTop: 4 }}>
                    <Tag color={item.examinationId.status === "completed" ? "green" : item.examinationId.status === "cancelled" ? "red" : "orange"}>
                      {examStatusMap[item.examinationId.status] || item.examinationId.status}
                    </Tag>
                    <Tag color="purple">{item.examinationId.patientProfileId?.fullName || "Chưa có bệnh nhân"}</Tag>
                  </div>
                )}
              </div>
            ))}
          </Space>
        ),
      })),
    ];

    const rows = Array.isArray(dataTime) ? dataTime.map((timeSlot) => {
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
    }) : [];

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
    if (!dataDoctor?._id || !selectedDate || !selectedType || selectedTimes.length === 0) {
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
      handleTypeChange(selectedType); // Reset selected times after creating schedule
    } catch (error) {
      console.error(error);
      message.error("Lỗi khi tạo lịch làm việc");
    }
  };

  useEffect(() => {
    console.log("Selected times updated:", selectedTimes);
  }, [selectedTimes])

  return (
    <>
    <Row>
      <Col span={24} style={{ padding: "20px 0 30px", fontSize: "20px", textAlign: "center" }}>
              <span style={{ fontWeight: "550", color: "navy" }}>
                ĐĂNG KÝ LỊCH LÀM VIỆC
              </span>
      </Col>
    </Row>
 
      <Form form={form} onFinish={handleCreateSchedule}>
        <Row gutter={[16, 16]} justify="center">
          <Col span={8}>
            <Form.Item label="Chọn ngày" name="date" rules={[{ required: true, message: "Vui lòng chọn ngày!" }]}> 
              <DatePicker
                value={selectedDate}
                onChange={handleDateChange}
                format="DD/MM/YYYY"
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item label="Hình thức khám" name="type" rules={[{ required: true, message: "Vui lòng chọn hình thức khám!" }]}> 
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
          {Array.isArray(dataTime) && dataTime.map((time) => {
            const isDisabled = !selectedDate || !selectedType || disabledSlots.includes(time._id);
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
          <Button type="primary" htmlType="submit" style={{width: "200px", height: "40px"}}>LƯU LỊCH</Button>
        </Row>
      </Form>

      <Divider />

      <Row>
        <Col span={24} style={{ padding: "10px 0 20px", fontSize: "20px", textAlign: "center" }}>
                <span style={{ fontWeight: "550", color: "navy" }}>
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
      </Row>
 
      <Table
        columns={columns}
        dataSource={data}
        bordered
        pagination={false}
        scroll={{ x: "max-content" }}
        style={{ marginTop: 20 }}
      />
    </>
  );
};


export default QuanLyLichLamViec;
