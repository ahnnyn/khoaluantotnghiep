import { Col, Row, Space, Table, Tooltip } from "antd";
import { useEffect, useState } from "react";
import { FaEye } from "react-icons/fa";
import { useSelector } from "react-redux";
import { fetchMedicalExaminationsByDoctor } from "services/doctor/doctors.services";
import ModalPatientProfile from "./ModalPatientProfile";
import SearchComponent from "../Search/SearchComponent";

const PatientProfile = () => {
  const [openView, setOpenView] = useState(false);
  const [dataView, setDataView] = useState([]);
  const [dataOrder, setDataOrder] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [total, setTotal] = useState(0);
  const [loadingOrder, setLoadingOrder] = useState(false);
  const user = useSelector((state) => state.account.user);
  const reloadMedicalData = useSelector(
    (state) => state.global.reloadMedicalData
  );

  const findAllOrder = async () => {
    if (!user?._id) return;
    setLoadingOrder(true);
    try {
      const res = await fetchMedicalExaminationsByDoctor(user._id);
      const data = res?.data || [];

      // Lọc chỉ lấy các phiếu khám đã hoàn thành
      const filteredData = data.filter((item) => item.status === "completed");

      // Gom nhóm theo bệnh nhân (patientProfileId)
      const groupedData = filteredData.reduce((acc, item) => {
        const patient = item.patientProfileId;
        if (!patient?._id) return acc;

        const id = patient._id;

        if (!acc[id]) {
          acc[id] = {
            patientId: id,
            fullName: patient.fullName,
            email: patient.email,
            phone: patient.phoneNumber,
            address: patient.address || "",
            soLanDaKham: 1,
            lichKham: [item],
          };
        } else {
          acc[id].soLanDaKham += 1;
          acc[id].lichKham.push(item);
        }
        return acc;
      }, {});

      const result = Object.values(groupedData);
      setDataOrder(result);
      setOriginalData(result);
      setTotal(result.length);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setDataOrder([]);
      setTotal(0);
    }
    setLoadingOrder(false);
  };

  useEffect(() => {
    findAllOrder();
  }, [user]);

  useEffect(() => {
    findAllOrder(); // fetch lại hồ sơ
  }, [reloadMedicalData]);

  const handleViewDetails = (record) => {
    setDataView(record.lichKham);
    setOpenView(true);
  };

  const handleSearch = (value) => {
    const keyword = value.toLowerCase();
    const filtered = originalData.filter(
      (item) =>
        item.fullName?.toLowerCase().includes(keyword) ||
        item.email?.toLowerCase().includes(keyword) ||
        item.phone?.includes(value)
    );
    setDataOrder(filtered);
    setTotal(filtered.length);
    setCurrent(1);
  };

  const columns = [
    {
      title: "STT",
      dataIndex: "stt",
      render: (_, __, index) => (
        <span>{index + 1 + (current - 1) * pageSize}</span>
      ),
      width: 100,
    },
    {
      title: "Bệnh nhân",
      dataIndex: "fullName",
      render: (_, record) => (
        <div>
          <span style={{ fontWeight: "bold" }}>{record.fullName}</span> <br />
          <span>Email: {record.email}</span> <br />
          <span>Số điện thoại: {record.phone}</span> <br />
          <span>Địa chỉ: {record.address}</span>
        </div>
      ),
    },
    {
      title: "Số lần đã khám",
      dataIndex: "soLanDaKham",
      render: (text) => <span style={{ fontWeight: "bold" }}>{text} lần</span>,
      width: 200,
    },
    {
      title: "Chức năng",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="Xem chi tiết hồ sơ bệnh nhân" color="green">
            <FaEye
              size={23}
              style={{ color: "green", cursor: "pointer", fontSize: "18px" }}
              onClick={() => handleViewDetails(record)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <Row gutter={[20, 10]}>
      <Col xs={24} style={{ display: "flex", justifyContent: "center" }}>
        <div style={{ width: "800px", maxWidth: "100%" }}>
          <SearchComponent
            onSearch={handleSearch}
            style={{ width: "100%", height: "38px", marginBottom: "20px" }}
            placeholder="Tìm bệnh nhân theo tên, email hoặc số điện thoại"
          />
        </div>
      </Col>
      <Col xs={24} sm={12} md={24}>
        <Table
          pagination={{ current, pageSize, total, onChange: setCurrent }}
          loading={loadingOrder}
          columns={columns}
          dataSource={dataOrder}
          rowKey={(record) => record.patientId}
          locale={
            dataOrder.length === 0
              ? { emptyText: "Không có hồ sơ bệnh nhân phù hợp" }
              : {}
          }
        />
      </Col>
      <ModalPatientProfile
        openView={openView}
        setOpenView={setOpenView}
        dataView={dataView}
        setDataView={setDataView}
      />
    </Row>
  );
};

export default PatientProfile;
