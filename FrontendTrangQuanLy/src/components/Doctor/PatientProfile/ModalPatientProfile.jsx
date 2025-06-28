import React from "react";
import { Modal, Tabs, Descriptions, Table, Tag, Button } from "antd";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import moment from "moment";
import { triggerReloadMedicalData } from "@redux/app/globalSlice";

const ModalPatientProfile = ({
  openView,
  setOpenView,
  dataView,
  setDataView,
}) => {
  const onClose = () => {
    setOpenView(false);
    setDataView([]);
  };

  const renderTrangThai = (tt) => {
    if (tt === "completed") return <Tag color="green">Đã khám</Tag>;
    if (tt === "pending") return <Tag color="orange">Đang chờ</Tag>;
    return <Tag>{tt}</Tag>;
  };

  const renderTrangThaiThanhToan = (tt) => {
    return tt === "paid" ? (
      <Tag color="blue">Đã thanh toán</Tag>
    ) : (
      <Tag color="red">Chưa thanh toán</Tag>
    );
  };

  const columnsPhieuKham = [
    {
      title: "Lý do khám",
      dataIndex: "reasonForVisit",
      key: "reasonForVisit",
    },
    {
      title: "Tiền sử bệnh",
      dataIndex: "passMedicalHistory",
      key: "passMedicalHistory",
    },
    {
      title: "Chẩn đoán",
      dataIndex: "diagnosis",
      key: "diagnosis",
    },
    {
      title: "Kết luận",
      dataIndex: "conclusion",
      key: "conclusion",
    },
  ];

  const columnsDonThuoc = [
    {
      title: "Tên thuốc",
      dataIndex: ["medication", "name"],
      key: "name",
    },
    {
      title: "Liều lượng",
      dataIndex: "dosage",
      key: "dosage",
    },
    {
      title: "Số lần dùng/ngày",
      dataIndex: "frequency",
      key: "frequency",
    },
    {
      title: "Số ngày dùng",
      dataIndex: "duration",
      key: "duration",
    },
    {
      title: "Ghi chú",
      dataIndex: "note",
      key: "note",
    },
  ];

  const handleDownloadPDF = async (id) => {
    const element = document.getElementById(id);
    if (!element) return;

    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pageWidth;
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    let position = 0;
    if (pdfHeight < pageHeight) {
      pdf.addImage(imgData, "PNG", 0, position, pdfWidth, pdfHeight);
    } else {
      let heightLeft = pdfHeight;
      while (heightLeft > 0) {
        pdf.addImage(imgData, "PNG", 0, position, pdfWidth, pdfHeight);
        heightLeft -= pageHeight;
        if (heightLeft > 0) {
          pdf.addPage();
          position = -pageHeight;
        }
      }
    }

    pdf.save(`PatientProfile_${Date.now()}.pdf`);
  };

  return (
    <Modal
      title={<div style={{ textAlign: "center" }}>📝 Hồ sơ bệnh nhân</div>}
      open={openView}
      onCancel={onClose}
      footer={null}
      width={800}
      centered
      bodyStyle={{
        maxHeight: "80vh",
        overflowY: "auto",
        overflowX: "auto",
        padding: "10px",
      }}
    >
      {dataView?.length > 0 ? (
        <Tabs>
          {dataView.map((item, index) => (
            <Tabs.TabPane
              tab={`#${index + 1} 🗓️ ${moment(item.scheduledDate).format(
                "DD/MM/YYYY"
              )} | ${item.scheduledTimeSlot}`} //{item._id.slice(-4)}
              key={item._id}
            >
              <div style={{ textAlign: "center", marginBottom: 10 }}>
                <Button
                  onClick={() => handleDownloadPDF(`printArea-${item._id}`)}
                  type="primary"
                >
                  ⬇️ Tải xuống PDF
                </Button>
              </div>

              <div id={`printArea-${item._id}`}>
                <Descriptions bordered column={2} size="small">
                  <Descriptions.Item label="Họ tên">
                    {item.patientProfileId?.fullName}
                  </Descriptions.Item>
                  <Descriptions.Item label="SĐT">
                    {item.patientProfileId?.phoneNumber}
                  </Descriptions.Item>
                  <Descriptions.Item label="Bác sĩ khám">
                    {item.doctorId?.fullName}
                  </Descriptions.Item>
                  <Descriptions.Item label="Trạng thái">
                    {renderTrangThai(item.status)}
                  </Descriptions.Item>
                  <Descriptions.Item label="Thanh toán">
                    {renderTrangThaiThanhToan(item.paymentStatus)}
                  </Descriptions.Item>
                  <Descriptions.Item label="Giá khám">
                    {item.price?.toLocaleString()} VNĐ
                  </Descriptions.Item>
                </Descriptions>

                <h4 style={{ marginTop: 20 }}>🧾 Phiếu khám bệnh</h4>
                <Table
                  columns={columnsPhieuKham}
                  dataSource={[item]}
                  pagination={false}
                  rowKey={() => item._id + "_phieu"}
                />

                <h4 style={{ marginTop: 20 }}>💊 Đơn thuốc</h4>
                <Table
                  columns={columnsDonThuoc}
                  dataSource={item.prescriptionId?.items || []}
                  pagination={false}
                  rowKey={(_, index) => `${item._id}_thuoc_${index}`}
                  locale={{ emptyText: "Không có đơn thuốc" }}
                />
              </div>
            </Tabs.TabPane>
          ))}
        </Tabs>
      ) : (
        <p>Không có lịch khám nào.</p>
      )}
    </Modal>
  );
};

export default ModalPatientProfile;
