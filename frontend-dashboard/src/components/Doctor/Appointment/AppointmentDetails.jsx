import { UserOutlined } from "@ant-design/icons";
import {
  Avatar,
  Badge,
  Button,
  Descriptions,
  Modal,
  message,
} from "antd";
import moment from "moment-timezone";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { FaFileExport } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { use } from "react";

const AppointmentDetails = ({ openViewDH, dataViewDH, setOpenViewDH, setDataViewDH }) => {
  const user = useSelector((state) => state.account.user);

  useEffect(() => {
    if (openViewDH) {
      console.log("Open ViewLichHen Modal with data:", dataViewDH);

      
    }
  }, [openViewDH, dataViewDH, setOpenViewDH, setDataViewDH]);
  const cancel = () => {
    setOpenViewDH(false);
    setDataViewDH(null);
  };

  const formatDate = (date) =>
    date ? moment(date).tz("Asia/Ho_Chi_Minh").format("DD-MM-YYYY") : "N/A";

  const formatCurrency = (value) =>
    value ? `${Math.ceil(value).toLocaleString()} VNĐ` : "0 VNĐ";

  const exportToPDF = () => {
    const content = document.getElementById("drawer-content");
    if (!content) return message.error("Không tìm thấy nội dung để xuất PDF!");

    html2canvas(content, { scale: 2, useCORS: true, allowTaint: true })
      .then((canvas) => {
        const pdf = new jsPDF("p", "mm", "a4");
        const imgData = canvas.toDataURL("image/png");
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const imgHeight = (canvas.height * pdfWidth) / canvas.width;

        pdf.addImage(imgData, "PNG", 0, 10, pdfWidth, imgHeight);
        pdf.save(`LichHen-${dataViewDH?.patientProfileId.fullName || "BenhNhan"}.pdf`);
      })
      .catch((err) => {
        console.error("Lỗi xuất PDF:", err);
        message.error("Xuất PDF thất bại!");
      });
  };

  const formatAddress = (addr) => {
  if (!addr || typeof addr !== "object") return "N/A";
  const { streetDetail = "", ward = "", district = "", province = "" } = addr;
  return [streetDetail, ward, district, province].filter(Boolean).join(", ");
};

  const items = [
    {
      key: "hinhAnh",
      label: "Hình ảnh",
      children: (
        <Avatar
          src={`${import.meta.env.VITE_BACKEND_URL}/public/benhnhan/${dataViewDH?.avatar || "default-avatar.png"}`}
          shape="square"
          size={100}
          icon={<UserOutlined />}
        />
      ),
    },
    {
      key: "hoTen",
      label: "Họ và tên bệnh nhân",
      children: (
        <>
          {dataViewDH?.patientProfileId?.fullName || "N/A"}
          <br />({formatDate(dataViewDH?.dataOrder)})
        </>
      ),
      span: 3,
    },
    {
      key: "soDienThoai",
      label: "Số điện thoại",
      children: dataViewDH?.patientProfileId.phoneNumber || "N/A",
      span: 1,
    },
    // {
    //   key: "diaChi",
    //   label: "Địa chỉ",
    //   children: <span>formatAddress(dataViewDH?.patientProfileId?.address)</span>,
    //   span: 2,
    // },
    {
      key: "ngayKham",
      label: "Ngày khám",
      children: dataViewDH?.scheduledDate || "N/A",
      span: 1,
    },
    {
      key: "giaKham",
      label: "Chi phí khám bệnh",
      children: <span style={{ color: "red" }}>{formatCurrency(dataViewDH?.price)}</span>,
      span: 2,
    },
    {
      key: "lyDoKham",
      label: "Lý do khám",
      children: <Badge status="processing" text={dataViewDH?.reasonForVisit || "N/A"} />,
      span: 3,
    },
    {
      key: "hoTenBacSi",
      label: "Bác sĩ khám",
      children: user?.fullName || "Chưa xác định",
      span: 1.5,
    },
    {
      key: "khungGio",
      label: "Thời gian khám",
      children: dataViewDH?.scheduledTimeSlot || "N/A",
      span: 1.5,
    },
  ];

  return (
    <Modal
      title={
        <div style={{ textAlign: "center", color: "navy", fontWeight: "bold", fontSize: 18 }}>
          CHI TIẾT LỊCH HẸN CỦA BỆNH NHÂN: <span>{dataViewDH?.patientProfileId.fullName || "N/A"}</span>
        </div>
            }
            open={openViewDH}
            onCancel={cancel}
            footer={null}
            width={850}
            destroyOnClose
          >
      <div style={{ textAlign: "center", marginBottom: 10 }}>
        <Button
          icon={<FaFileExport />}
          onClick={exportToPDF}
          size="large"
          style={{ width: 200 }}
        >
          Xuất PDF
        </Button>
      </div>
      <div id="drawer-content">
        <Descriptions bordered items={items} />
      </div>
    </Modal>
  );
};

export default AppointmentDetails;
