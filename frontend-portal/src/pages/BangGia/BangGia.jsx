import { useEffect, useState } from "react";
import { Card, Col, Row, Typography, Table, Tabs, Image } from "antd";
import { fetchPriceList } from "services/patient/patient.services";
const { Title, Text } = Typography;

const BangGia = () => {
  const [priceList, setPriceList] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await fetchPriceList();
        setPriceList(data || []);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách giá:", error);
      }
    })();
  }, []);

  // ✅ Gom theo chuyên khoa (group by departmentId)
  const grouped = priceList.reduce((acc, item) => {
    const depId = item.departmentId._id;
    if (!acc[depId]) {
      acc[depId] = {
        name: item.departmentId.name,
        image: item.departmentId.image,
        items: [],
      };
    }
    acc[depId].items.push(item);
    return acc;
  }, {});

  const columns = [
    {
      title: "Loại khám",
      dataIndex: "examinationType",
      render: (type) =>
        type === "ONLINE" ? "Khám Trực tuyến" : "Khám Trực tiếp",
      width: 150,
      align: "center",
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      width: 500,
      align: "center",
    },
    {
      title: "Giá khám",
      dataIndex: "price",
      render: (price) => `${price.toLocaleString()}₫`,
      width: 100,
      align: "center",
    },
  ];

  return (
    <>
      <div
        style={{
          backgroundImage: `url('/public/assets/images/Banner_2.jpg')`,
          backgroundSize: "cover",
          height: "450px",
        }}
      >
        <Row justify="space-between" align="middle" style={{ height: "100%" }}>
          <Col xs={24} md={12}>
            <div
              style={{
                marginLeft: 70,
                marginTop: 50,
                padding: "20px 30px",
                borderRadius: 40,
                backgroundColor: "white",
                boxShadow: "0 4px 16px rgba(0, 0, 0, 0.15)",
              }}
            >
              <h2
                style={{
                  fontSize: "clamp(20px, 5vw, 30px)",
                  fontWeight: "bold",
                  color: "#00B0F0",
                }}
              >
                BẢNG GIÁ DỊCH VỤ
              </h2>
              <ul
                style={{
                  listStyleType: "none",
                  paddingLeft: 0,
                  lineHeight: 1.8,
                }}
              >
                <li>✅ Giá niêm yết từ bệnh viện</li>
                <li>✅ Phân loại theo hình thức ONLINE / OFFLINE</li>
                <li>✅ Cập nhật mới nhất theo từng khoa</li>
              </ul>
            </div>
          </Col>
          <Col
            xs={0}
            md={12}
            style={{ display: "flex", justifyContent: "flex-end" }}
          >
            <img
              src="/public/assets/images/banner_1-removebg-preview.png"
              alt="Banner doctor"
              style={{
                maxHeight: "350px",
                marginRight: "50px",
                marginTop: "100px",
              }}
            />
          </Col>
        </Row>
      </div>
      <div className="container mx-auto px-4 py-6">
        <div
          style={{ margin: "40px", alignItems: "center", textAlign: "center" }}
        >
          <Title level={3} style={{ color: "#093b7b", marginBottom: 20 }}>
            CHI TIẾT BẢNG GIÁ THEO TỪNG CHUYÊN KHOA
          </Title>

          <Row gutter={[24, 24]}>
            {Object.entries(grouped).map(([id, group]) => (
              <Col xs={24} md={12} key={id}>
                <Card
                  hoverable
                  title={
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 12 }}
                    >
                      <Image
                        src={`${
                          import.meta.env.VITE_BACKEND_URL
                        }/public/images/upload/${group.image}`}
                        alt={group.name}
                        width={100}
                        height={60}
                        preview={false}
                        style={{ borderRadius: 8 }}
                      />
                      <span style={{ paddingLeft: "10px" }}>{group.name}</span>
                    </div>
                  }
                  style={{ borderRadius: 12, margin: "10px" }}
                >
                  <Table
                    dataSource={group.items}
                    columns={columns}
                    pagination={false}
                    rowKey="_id"
                    size="small"
                  />
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </div>
    </>
  );
};

export default BangGia;
