import {
  Col,
  Form,
  Input,
  message,
  Modal,
  notification,
  Row,
  Select,
  Table,
  Tag,
  Tooltip,
} from "antd";
import { useEffect, useState } from "react";
import moment from "moment-timezone";
import {
  ExclamationCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  LoadingOutlined,
  ClockCircleOutlined,
  DollarOutlined,
  UndoOutlined,
} from "@ant-design/icons";
import { BsCameraVideoFill } from "react-icons/bs";
import { IoChatbubbleEllipsesSharp } from "react-icons/io5";
import { FaEye } from "react-icons/fa";
import { useSelector } from "react-redux";
import AppoitmentDetails from "./AppointmentDetails";
import { RiEdit2Fill } from "react-icons/ri";
import {
  updateMedicalExaminationStatus,
  fetchMedicalExaminationsByDoctor,
} from "services/doctor/doctors.services";
import SearchComponent from "../Search/SearchComponent";
import ModalMedicalExamination from "../MedicalExamination/ModalMedicalExamination";
import { useDispatch } from "react-redux";
import { triggerReloadMedicalData } from "@redux/app/globalSlice";
import { sendCancellationEmailToPatient } from "../../../services/doctor/doctors.services";
import "./Appointment.css";
// ---- Constants ----
const STATUS_MAP = {
  pending: "Chờ khám",
  in_progress: "Đang khám",
  completed: "Đã khám",
  cancelled: "Đã hủy",
};

const PAYMENT_STATUS_MAP = {
  unpaid: "Chưa thanh toán",
  paid: "Đã thanh toán",
  refunded: "Hoàn tiền",
};

const STATUS_COLOR_MAP = {
  pending: "orange",
  in_progress: "blue",
  completed: "green",
  cancelled: "red",
};

const PAYMENT_COLOR_MAP = {
  unpaid: "red",
  paid: "green",
  refunded: "orange",
};

const STATUS_ICON_MAP = {
  pending: <ClockCircleOutlined />,
  in_progress: <LoadingOutlined />,
  completed: <CheckCircleOutlined />,
  cancelled: <CloseCircleOutlined />,
};

const PAYMENT_ICON_MAP = {
  unpaid: <DollarOutlined />,
  paid: <CheckCircleOutlined />,
  refunded: <UndoOutlined />,
};

const Appointment = () => {
  const [originalData, setOriginalData] = useState([]);
  const [dataOrder, setDataOrder] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 3,
    total: 0,
  });
  const [searchValue, setSearchValue] = useState("");
  const [statusFilter, setStatusFilter] = useState("tatca");
  const [paymentFilter, setPaymentFilter] = useState("tatca");
  const [viewModal, setViewModal] = useState({ open: false, data: null });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [form] = Form.useForm();
  const user = useSelector((state) => state.account?.user);
  const [updatingId, setUpdatingId] = useState(null);
  const [cancelModal, setCancelModal] = useState({ open: false, record: null });
  const [cancelReason, setCancelReason] = useState("");
  const [dateFilterType, setDateFilterType] = useState("tatca"); // 'today', '7days', 'custom', 'tatca'
  const [customDate, setCustomDate] = useState(null); // moment object
  const today = moment().startOf("day");
  const sevenDaysAgo = moment().subtract(7, "days").startOf("day");
  const [isloading, setIsLoading] = useState(false);

  const reloadMedicalData = useSelector(
    (state) => state.global.reloadMedicalData
  );
  const dispatch = useDispatch();

  // ---- Fetch data ----

  const fetchData = async () => {
    if (!user?._id) return;
    setLoading(true);
    try {
      const res = await fetchMedicalExaminationsByDoctor(user._id);
      console.log("Fetched medical examinations:", res.data);
      if (res?.data) {
        setOriginalData(res.data);
        filterAndPaginate(res.data);
      }
    } catch {
      notification.error({
        message: "Lỗi",
        description: "Tải dữ liệu thất bại.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  useEffect(() => {
    fetchData();
  }, [reloadMedicalData]);

  // ---- Filter & paginate ----
  useEffect(() => {
    filterAndPaginate(originalData);
  }, [
    originalData,
    pagination.current,
    pagination.pageSize,
    searchValue,
    statusFilter,
    paymentFilter,
    dateFilterType,
    customDate,
  ]);
  useEffect(() => {
    if (dateFilterType === "custom" && !customDate) {
      setCustomDate(moment());
    }
  }, [dateFilterType]);

  const filterAndPaginate = (data) => {
    const keyword = searchValue.toLowerCase();

    const filtered = data.filter((item) => {
      const matchSearch = [
        item.patientProfileId?.fullName,
        item.patientProfileId?.email,
        item.patientProfileId?.phoneNumber,
      ].some((field) => field?.toLowerCase().includes(keyword));

      const matchStatus =
        statusFilter === "tatca" || item.status === statusFilter;

      const matchPayment =
        paymentFilter === "tatca" || item.paymentStatus === paymentFilter;

      // ---- THỜI GIAN ----
      const examDate = moment(item.scheduledDate).startOf("day");
      let matchDate = true;

      if (dateFilterType === "today") {
        matchDate = examDate.isSame(today, "day");
      } else if (dateFilterType === "7days") {
        matchDate =
          examDate.isSameOrAfter(sevenDaysAgo, "day") &&
          examDate.isSameOrBefore(today, "day");
      } else if (dateFilterType === "custom" && customDate) {
        matchDate = examDate.isSame(customDate, "day");
      }
      return matchSearch && matchStatus && matchPayment && matchDate;
    });

    const { current, pageSize } = pagination;
    const paginated = filtered.slice(
      (current - 1) * pageSize,
      current * pageSize
    );
    setDataOrder(paginated);
    setPagination((prev) => ({ ...prev, total: filtered.length }));
  };

  useEffect(() => {
    filterAndPaginate(originalData);
  }, [dateFilterType, customDate]);

  // ---- Handlers ----
  const handleStatusChange = async (status, record) => {
    if (status === "cancelled") {
      setCancelModal({ open: true, record });
    } else {
      const updatedRecord = { ...record, status };
      setDataOrder((prev) =>
        prev.map((item) => (item._id === record._id ? updatedRecord : item))
      );

      setUpdatingId(record._id);

      try {
        const res = await updateMedicalExaminationStatus(record._id, status);
        if (res?.data) {
          message.success("Cập nhật trạng thái khám thành công");
          dispatch(triggerReloadMedicalData());
          await fetchData(); /// fetch lại data sau mỗi lần cập nhật trạng thái khám thành công
          setPagination((prev) => ({ ...prev, current: 1 }));
          const freshData = await fetchMedicalExaminationsByDoctor(user._id);
          setOriginalData(freshData.data);
        } else throw new Error();
      } catch {
        message.error("Cập nhật trạng thái khám thất bại");
        setDataOrder((prev) =>
          prev.map((item) => (item._id === record._id ? { ...record } : item))
        );
      } finally {
        setUpdatingId(null);
      }
    }
  };

  const handlePaymentStatusChange = async (paymentStatus, record) => {
    try {
      const res = await updateMedicalExaminationStatus(record._id, {
        paymentStatus,
      });
      if (res?.status) {
        message.success("Cập nhật trạng thái thanh toán thành công");
        await fetchData();
        setPagination((prev) => ({ ...prev, current: 1 }));
        const freshData = await fetchMedicalExaminationsByDoctor(user._id);
        setOriginalData(freshData.data);
      }
    } catch {
      notification.error({
        message: "Lỗi",
        description: "Cập nhật trạng thái thanh toán thất bại.",
      });
    }
  };

  const confirmCancelAndSendMail = async () => {
    const { record } = cancelModal;

    if (!cancelReason) {
      message.warning("Vui lòng nhập lý do hủy lịch.");
      return;
    }

    setUpdatingId(record._id);
    setIsLoading(true);

    try {
      await sendCancellationEmailToPatient({
        email: record.patientProfileId?.email,
        hoTen: record.patientProfileId?.fullName,
        ngayKham: moment(record.scheduledDate).format("DD/MM/YYYY"),
        gioKham: record.scheduledTimeSlot,
        hinhThucKham: record.consultationType || "Không rõ",
        tenBacSi: user?.fullName || "Bác sĩ",
        khoa: record.specialty || "N/A",
        diaChi: record.clinicAddress || "N/A",
        soThuTu: record.queueNumber || "N/A",
        lyDoHuy: cancelReason,
      });

      await updateMedicalExaminationStatus(record._id, "cancelled");

      message.success("Đã hủy lịch và gửi email thành công.");
      dispatch(triggerReloadMedicalData());
      setCancelModal({ open: false, record: null });
      setCancelReason("");
    } catch {
      message.error("Hủy lịch thất bại hoặc gửi email lỗi.");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleEditClick = (record) => {
    setEditingRecord(record);
    setIsModalOpen(true);
    form.setFieldsValue({
      hoTen: record.patientProfileId?.fullName,
      ngayKham: moment(record.examinationTime),
      tienSu: record.passMedicalHistory,
      chuanDoan: record.diagnosis,
      lyDoKham: record.reasonForVisit,
    });
  };

  const renderActions = (record) => {
    const isDisabled = record.status === "cancelled";
    const commonProps = (color) => ({
      color,
      cursor: isDisabled ? "not-allowed" : "pointer",
      fontSize: 18,
    });

    return (
      <div style={{ display: "flex", gap: 10 }}>
        <Tooltip title="Xem chi tiết">
          <FaEye
            style={commonProps("green")}
            onClick={() =>
              !isDisabled && setViewModal({ open: true, data: record })
            }
          />
        </Tooltip>
        <Tooltip
          title={isDisabled ? "Không chỉnh sửa" : "Chỉnh sửa phiếu khám"}
        >
          <RiEdit2Fill
            style={commonProps("orange")}
            onClick={() => !isDisabled && handleEditClick(record)}
          />
        </Tooltip>
        <Tooltip title={isDisabled ? "Không gọi" : "Gọi video"}>
          <BsCameraVideoFill
            style={commonProps("#1890ff")}
            onClick={() => {
              if (!isDisabled) {
                window.open(
                  `http://localhost:3003/video-call?appointmentId=${record._id}&patientId=${record.patientId}&doctorId=${record.doctorId}`,
                  "_blank"
                );
              }
            }}
          />
        </Tooltip>
        <Tooltip title={isDisabled ? "Không nhắn tin" : "Nhắn tin"}>
          <IoChatbubbleEllipsesSharp
            style={commonProps("#52c41a")}
            onClick={() => {
              if (!isDisabled) {
                window.open(
                  `http://localhost:3003/chat?appointmentId=${record._id}&patientId=${record.patientId}&doctorId=${record.doctorId}`,
                  "_blank"
                );
              }
            }}
          />
        </Tooltip>
      </div>
    );
  };

  const columns = [
    {
      title: "STT",
      render: (_, __, index) =>
        (pagination.current - 1) * pagination.pageSize + index + 1,
    },
    {
      title: "Thông tin bệnh nhân",
      render: (_, r) => (
        <>
          <b>{r.patientProfileId?.fullName}</b>
          <br />
          SĐT: {r.patientProfileId?.phoneNumber} <br />
          Email: {r.patientProfileId?.email}
        </>
      ),
    },
    {
      title: "Thời gian khám",
      render: (_, r) => (
        <>
          <span>Ngày khám: {moment(r.scheduledDate).format("DD/MM/YYYY")}</span>
          <br />
          <span>Khung giờ: {r.scheduledTimeSlot}</span>
        </>
      ),
    },
    {
      title: "Trạng thái khám",
      render: (_, r) => (
        <Select
          value={r.status}
          onChange={(v) => handleStatusChange(v, r)}
          style={{ width: 180 }}
          options={Object.entries(STATUS_MAP).map(([value, label]) => ({
            value,
            label: (
              <Tag
                icon={STATUS_ICON_MAP[value]}
                color={STATUS_COLOR_MAP[value]}
                style={{ margin: 0 }}
              >
                {label}
              </Tag>
            ),
          }))}
        />
      ),
    },
    {
      title: "Thanh toán",
      render: (_, r) => (
        <Tag
          color={PAYMENT_COLOR_MAP[r.paymentStatus]}
          icon={PAYMENT_ICON_MAP[r.paymentStatus]}
          style={{ margin: 0 }}
        >
          {PAYMENT_STATUS_MAP[r.paymentStatus] || "Không rõ"}
        </Tag>
      ),
    },
    { title: "Chức năng", render: (_, r) => renderActions(r) },
  ];

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
            LỊCH HẸN KHÁM BỆNH
          </span>
        </Col>
      </Row>
      <Row gutter={[20, 25]} justify={"center"} style={{ marginBottom: 20 }}>
        <Col xs={14}>
          <SearchComponent
            onSearch={setSearchValue}
            placeholder="Tìm bệnh nhân theo tên, email hoặc số điện thoại"
            className="search-patient"
          />
        </Col>
      </Row>
      <Row gutter={[20, 25]} justify={"center"}>
        <Col xs={5}>
          <Select
            value={statusFilter}
            onChange={setStatusFilter}
            className="custom-select-height"
            options={[
              { value: "tatca", label: "Tất cả trạng thái khám" },
              ...Object.entries(STATUS_MAP).map(([v, l]) => ({
                value: v,
                label: l,
              })),
            ]}
          />
        </Col>
        <Col xs={5}>
          <Select
            value={paymentFilter}
            onChange={setPaymentFilter}
            className="custom-select-height"
            options={[
              { value: "tatca", label: "Tất cả trạng thái thanh toán" },
              ...Object.entries(PAYMENT_STATUS_MAP).map(([v, l]) => ({
                value: v,
                label: l,
              })),
            ]}
          />
        </Col>

        <Col xs={5}>
          <Select
            value={dateFilterType}
            onChange={setDateFilterType}
            options={[
              { value: "tatca", label: "Tất cả thời gian" },
              { value: "today", label: "Hôm nay" },
              { value: "7days", label: "7 ngày qua" },
              { value: "custom", label: "Chọn ngày cụ thể" },
            ]}
            className="custom-select-height"
          />
        </Col>

        {dateFilterType === "custom" && (
          <Col xs={5}>
            <Form.Item noStyle>
              <Input
                type="date"
                value={
                  customDate
                    ? customDate.format("YYYY-MM-DD")
                    : moment().format("YYYY-MM-DD")
                }
                onChange={(e) => setCustomDate(moment(e.target.value))}
                style={{ cursor: "pointer" }}
              />
            </Form.Item>
          </Col>
        )}
        <Col xs={24} style={{ marginTop: 20, textAlign: "center" }}>
          <Table
            columns={columns}
            dataSource={dataOrder}
            rowKey="_id"
            pagination={{
              ...pagination,
              showSizeChanger: true,
              pageSizeOptions: ["3", "5", "10"],
              onChange: (page, size) =>
                setPagination({
                  current: page,
                  pageSize: size,
                  total: pagination.total,
                }),
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} trong ${total} lịch khám`,
            }}
            loading={loading}
            locale={{
              emptyText:
                dataOrder.length === 0
                  ? "Không có lịch khám"
                  : "Không có dữ liệu",
            }}
          />
        </Col>
      </Row>

      <AppoitmentDetails
        openViewDH={viewModal.open}
        dataViewDH={viewModal.data}
        setOpenViewDH={(open) => setViewModal((prev) => ({ ...prev, open }))}
      />

      <ModalMedicalExamination
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        editingRecord={editingRecord}
        form={form}
        setEditingRecord={setEditingRecord}
        fetchData={fetchData}
        setPagination={setPagination}
      />

      <Modal
        title="Hủy lịch khám"
        open={cancelModal.open}
        onCancel={() => setCancelModal({ open: false, record: null })}
        onOk={confirmCancelAndSendMail}
        okText="Xác nhận hủy và gửi mail"
        cancelText="Hủy bỏ"
        confirmLoading={isloading || updatingId === cancelModal.record?._id}
        okButtonProps={{
          style: {
            backgroundColor: "#1677ff", // hoặc dùng token màu chính của AntD
            borderColor: "#1677ff",
            color: "white",
            fontWeight: "600",
            width: 200,
          },
        }}
        cancelButtonProps={{
          style: {
            borderColor: "#d9d9d9",
            fontWeight: "500",
            width: 100,
          },
        }}
      >
        <p>Vui lòng nhập lý do hủy để gửi cho bệnh nhân:</p>
        <Input.TextArea
          rows={4}
          value={cancelReason}
          onChange={(e) => setCancelReason(e.target.value)}
          placeholder="Ví dụ: Bác sĩ có việc đột xuất, xin lỗi vì sự bất tiện này..."
        />
      </Modal>
    </>
  );
};

export default Appointment;
