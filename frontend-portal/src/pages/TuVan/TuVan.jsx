import {
  CommentOutlined,
  MailOutlined,
  PhoneOutlined,
  UserOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Button,
  Card,
  Col,
  DatePicker,
  Divider,
  Input,
  Radio,
  Row,
} from "antd";
import BreadcrumbCustom from "../../components/Breadcum/BreadcrumbCustom";
import SearchComponent from "components/SearchComponent/SearchComponent";
import { useState } from "react";
import { Content } from "antd/es/layout/layout";
import Meta from "antd/es/card/Meta";
import moment from "moment";
import { AiOutlineDownCircle } from "react-icons/ai";

// Mock data
const doctors = Array(4).fill({
  _id: Math.random().toString(),
  fullName: "Nguyễn Văn A",
  description: "Chuyên khoa Tim mạch",
  email: "doctor@example.com",
  phone: "0123456789",
  address: "123 Nguyễn Huệ, Quận 1, TP.HCM",
  avatar: "",
  positionId: [{ name: "PGS.TS" }],
  departmentId: [{ name: "Tim mạch" }],
});

const priceList = [
  { examinationType: "ONLINE", price: 300000 },
  { examinationType: "OFFLINE", price: 500000 },
];

const HINH_THUC = [
  { label: "Trực tiếp", value: "OFFLINE" },
  { label: "Tư vấn", value: "ONLINE" },
];

const TuVan = () => {
  const [expandedId, setExpandedId] = useState(null);
  const [expandedData, setExpandedData] = useState({});
  const [dataSearch, setDataSearch] = useState("");

  const handleCardClick = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleDateChange = (id, date) => {
    setExpandedData((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        selected: {
          ...(prev[id]?.selected || {}),
          date: moment(date),
        },
      },
    }));
  };

  const handleHinhThucChange = (id, value) => {
    setExpandedData((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        selected: {
          ...(prev[id]?.selected || {}),
          hinhThuc: value,
        },
      },
    }));
  };

  const handleBook = (doctor) => {
    alert("Đặt lịch khám: " + doctor.fullName);
  };

  const onSearch = (value) => {
    setDataSearch(value.toLowerCase());
  };

  return (
    <>
      {/* Banner */}
      <div
        style={{
          backgroundImage: `url('/assets/images/Banner_2.jpg')`,
          height: "450px",
        }}
      >
        <Row justify="space-between" align="middle" gutter={16}>
          <Col xs={24} md={12}>
            <div
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
                style={{
                  fontSize: "clamp(20px, 5vw, 30px)",
                  fontWeight: "bold",
                  color: "#00B0F0",
                }}
              >
                ĐẶT KHÁM THEO BÁC SĨ
              </h2>
              <ul
                style={{
                  listStyleType: "none",
                  paddingLeft: 0,
                  lineHeight: "1.8",
                  color: "#333",
                }}
              >
                <li>Chọn bác sĩ tin tưởng, đặt sớm để được ưu tiên số</li>
                <li>Đặt khám theo giờ, không phải xếp hàng</li>
                <li>Được hoàn phí nếu hủy phiếu</li>
                <li>Ưu đãi khi đặt lịch qua hệ thống</li>
              </ul>
            </div>
          </Col>

          <Col xs={4} md={12} className="z-0 flex justify-end">
            <img
              src="/assets/images/banner_1-removebg-preview.png"
              alt="Doctors illustration"
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

      {/* Breadcrumb */}
      <Row justify="center" style={{ marginTop: 24 }}>
        <Col xs={24} sm={22} md={20} lg={16}>
          <BreadcrumbCustom
            items={[
              {
                title: "Tư vấn",
                icon: <CommentOutlined />,
              },
            ]}
          />
        </Col>
      </Row>

      <Divider />

      {/* Search */}
      <Row justify="center" style={{ marginTop: "20px", marginBottom: "20px" }}>
        <Col xs={22} sm={18} md={12}>
          <SearchComponent
            placeholder="Tìm chuyên gia theo tên"
            onSearch={onSearch}
          />
        </Col>
      </Row>

      <Divider style={{ margin: "16px 100px" }} />

      {/* Cards */}
      <Content style={{ padding: "50px 50px 100px 50px" }}>
        <Row gutter={[16, 16]}>
          {doctors
            .filter((doc) => doc.fullName?.toLowerCase().includes(dataSearch))
            .map((doc) => {
              const data = expandedData[doc._id] || {};
              const selected = data.selected || {};

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
                          src={doc.avatar}
                          icon={<UserOutlined />}
                        />
                      }
                      title={doc.fullName}
                      description={`${doc.positionId?.[0]?.name || ""} - ${
                        doc.departmentId?.[0]?.name || ""
                      }`}
                    />
                    <div className="info" style={{ marginTop: 12 }}>
                      <p>
                        <strong>Giới thiệu:</strong> {doc.description}
                      </p>
                      <p>
                        <MailOutlined /> {doc.email}
                      </p>
                      <p>
                        <PhoneOutlined /> {doc.phone}
                      </p>
                      <p>
                        <strong>Địa chỉ:</strong> {doc.address}
                      </p>
                      <p>
                        <strong>Giá khám:</strong>{" "}
                        {(() => {
                          const hinhThuc = selected.hinhThuc || "OFFLINE";
                          const matched = priceList.find(
                            (p) => p.examinationType === hinhThuc
                          );
                          return matched
                            ? `${matched.price.toLocaleString()} VND`
                            : "Chưa có giá";
                        })()}
                      </p>
                    </div>

                    {expandedId === doc._id && (
                      <>
                        <div
                          className="schedule-section"
                          style={{ marginTop: 12 }}
                        >
                          <DatePicker
                            value={selected.date}
                            onChange={(date) => handleDateChange(doc._id, date)}
                            className="custom-datepicker"
                            format="DD/MM/YYYY"
                            placeholder="Chọn ngày khám"
                            suffixIcon={<CalendarOutlined />}
                          />
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
                          <Button
                            type="primary"
                            style={{ marginTop: 12 }}
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
      </Content>
    </>
  );
};

export default TuVan;
