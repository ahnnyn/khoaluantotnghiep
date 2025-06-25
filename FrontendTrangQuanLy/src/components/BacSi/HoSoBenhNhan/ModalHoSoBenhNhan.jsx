import React, { useEffect, useState } from 'react';
import { Modal, Tabs, Descriptions, Table, Tag } from 'antd';
// import { fetchLayTTPhieuKhamBenh } from "services/doctor/doctors.services";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const ModalHoSoBenhNhan = ({ openView, setOpenView, dataView, setDataView }) => {
    const [dataPhieuKham, setDataPhieuKham] = useState({});
    const dataArray = Array.isArray(dataView) ? dataView : [];
    console.log("dataArray", dataArray);
    const dataPhieuKhamArray = Array.isArray(dataPhieuKham) ? dataPhieuKham : [];

    const onClose = () => {
        setOpenView(false);
        setDataView([]);
        setDataPhieuKham({});
    };

    const fetchData = async () => {
        try {
            let newData = {};
            for (const item of dataArray) {
                const response = await fetchLayTTPhieuKhamBenh(item.maLich, item.ngayKham, item.khungGio);
                if (response) {
                    newData[item.maLich] = response;
                }
            }
            setDataPhieuKham(newData);
        } catch (error) {
            console.error("Lỗi khi lấy phiếu khám:", error);
        }
    };

    useEffect(() => {
        if (openView && dataArray.length > 0) {
            fetchData();
        }
    }, [openView, dataView]);

    const renderTrangThai = (tt) => {
        if (tt === "Đã khám") return <Tag color="green">Đã khám</Tag>;
        if (tt === "Đang chờ") return <Tag color="orange">Đang chờ</Tag>;
        return <Tag>{tt}</Tag>;
    };

    const renderTrangThaiThanhToan = (tt) => {
        return tt === "Đã thanh toán"
            ? <Tag color="blue">Đã thanh toán</Tag>
            : <Tag color="red">Chưa thanh toán</Tag>;
    };

    // Columns phiếu khám
    const columnsPhieuKham = [
        {
            title: 'Lý do khám',
            dataIndex: 'lyDoKham',
            key: 'lyDoKham',
        },
        {
            title: 'Tiền sử bệnh',
            dataIndex: 'tienSu',
            key: 'tienSu',
        },
        {
            title: 'Chẩn đoán',
            dataIndex: 'chanDoan',
            key: 'chanDoan',
        },
    ];

    // Columns danh sách thuốc
    const columnsDonThuoc = [
        {
            title: 'Tên thuốc',
            dataIndex: 'tenThuoc',
            key: 'tenThuoc',
        },
        {
            title: 'Liều lượng',
            dataIndex: 'lieuLuong',
            key: 'lieuLuong',
        },
        {
            title: 'Số lần dùng/ngày',
            dataIndex: 'soLanDungTrongNgay',
            key: 'soLanDungTrongNgay',
        },
        {
            title: 'Số ngày dùng',
            dataIndex: 'soNgayDung',
            key: 'soNgayDung',
        },
        {
            title: 'Ghi chú',
            dataIndex: 'ghiChu',
            key: 'ghiChu',
        },
    ];

    const handleDownloadPDF = async (id) => {
        const element = document.getElementById(id);
        if (!element) return;

        const canvas = await html2canvas(element, { scale: 2 });
        const imgData = canvas.toDataURL('image/png');

        const pdf = new jsPDF('p', 'mm', 'a4');
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pageWidth;
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        let position = 0;
        if (pdfHeight < pageHeight) {
            pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
        } else {
            let heightLeft = pdfHeight;
            while (heightLeft > 0) {
                pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
                heightLeft -= pageHeight;
                if (heightLeft > 0) {
                    pdf.addPage();
                    position = -pageHeight;
                }
            }
        }

        pdf.save(`HoSoBenhNhan_${Date.now()}.pdf`);
    };

    return (
        <Modal
            title={
                <div style={{ textAlign: "center" }}>
                        📝 Hồ sơ bệnh nhân: <strong>{dataArray[0]?.hoTen}</strong>
                    </div>
                }
            open={openView}
            onCancel={onClose}
            footer={null}
            width={800}
            centered
            bodyStyle={{ maxHeight: '80vh', overflowY: 'auto', overflowX: 'auto', padding: '10px' }}

        >
            {dataArray.length > 0 ? (
                <Tabs>
                    {dataArray.map((item) => {
                        const phieu = dataPhieuKham[item.maLich];
                        return (
                            <Tabs.TabPane
                                tab={`🗓️ ${item.ngayKham} | ${item.khungGio}`}
                                key={item.maLich}
                            >
                                <div style={{ textAlign: 'center', marginBottom: 10 }}>
                                    <button
                                        onClick={() => handleDownloadPDF(`printArea-${item.maLich}`)}
                                        style={{
                                            padding: '6px 12px',
                                            backgroundColor: '#1890ff',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: 4,
                                            width: 150,
                                            cursor: 'pointer'
                                        }}
                                    >
                                        ⬇️ Tải xuống PDF
                                    </button>
                                </div>

                                <div id={`printArea-${item.maLich}`}>
                                    <Descriptions
                                        bordered
                                        column={2}
                                        size="small"
                                        labelStyle={{ width: '30%' }}
                                    >
                                        <Descriptions.Item label="Họ tên">{item.hoTen}</Descriptions.Item>
                                        <Descriptions.Item label="SĐT">{item.soDienThoai}</Descriptions.Item>
                                        <Descriptions.Item label="Bác sĩ">{item.tenBacSi}</Descriptions.Item>
                                        <Descriptions.Item label="Trạng thái">{renderTrangThai(item.trangThai)}</Descriptions.Item>
                                        <Descriptions.Item label="Thanh toán">{renderTrangThaiThanhToan(item.trangThaiThanhToan)}</Descriptions.Item>
                                        <Descriptions.Item label="Giá khám">{parseInt(item.giaKham).toLocaleString()} VNĐ</Descriptions.Item>
                                    </Descriptions>

                                    <h4 style={{ marginTop: 20 }}>🧾 Phiếu khám bệnh</h4>
                                    <Table
                                        columns={columnsPhieuKham}
                                        dataSource={phieu ? [phieu] : []}
                                        pagination={false}
                                        rowKey={() => item.maLich}
                                    />

                                    <h4 style={{ marginTop: 20 }}>💊 Đơn thuốc</h4>
                                    <Table
                                        columns={columnsDonThuoc}
                                        dataSource={phieu?.danhSachDonThuoc || []}
                                        pagination={false}
                                        rowKey={(record, index) => `${item.maLichKham}-thuoc-${index}`}
                                        locale={{ emptyText: "Không có đơn thuốc" }}
                                    />
                                </div>
                            </Tabs.TabPane>
                        );
                    })}
                </Tabs>
            ) : (
                <p>Không có lịch khám nào.</p>
            )}
        </Modal>
    );
};

export default ModalHoSoBenhNhan;
