import { useEffect, useState } from "react";
import { Card, Col, Row, Typography, Tag, Select, Space } from "antd";
import { useNavigate } from "react-router-dom";
import {
  FileTextOutlined,
  UserOutlined,
  CalendarOutlined,
  TagsOutlined,
} from "@ant-design/icons";
import { fetchAllArticles } from "services/patient/patient.services";
import dayjs from "dayjs";
import vi from "dayjs/locale/vi";

dayjs.locale(vi);

const { Title, Paragraph, Text } = Typography;
const { Option } = Select;

const ArticlesPage = () => {
  const [articles, setArticles] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedTag, setSelectedTag] = useState("all");
  const [selectedTime, setSelectedTime] = useState("all");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchArticlesList = async () => {
      try {
        const response = await fetchAllArticles();
        if (response.data) {
          setArticles(response.data);
          setFiltered(response.data);
        }
      } catch (error) {
        console.error("Error fetching articles:", error);
      }
    };

    fetchArticlesList();
  }, []);

  const allTags = ["all", ...new Set(articles.flatMap((a) => a.tags || []))];
  const allCategories = ["all", ...new Set(articles.map((a) => a.category))];

  const handleFilter = (category, tag, time) => {
    let result = [...articles];

    if (category && category !== "all") {
      result = result.filter((a) => a.category === category);
    }

    if (tag && tag !== "all") {
      result = result.filter((a) => a.tags?.includes(tag));
    }

    if (time !== "all") {
      const now = dayjs();
      result = result.filter((a) => {
        const published = dayjs(a.publishedAt);
        if (time === "today") return now.isSame(published, "day");
        if (time === "week") return now.diff(published, "day") <= 7;
        if (time === "month") return now.diff(published, "day") <= 30;
        return true;
      });
    }

    setFiltered(result);
  };

  useEffect(() => {
    handleFilter(selectedCategory, selectedTag, selectedTime);
  }, [selectedCategory, selectedTag, selectedTime]);

  return (
    <div className="container mx-auto px-4 py-6" style={{margin: "50px"}}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: 24,
          gap: 8,
        }}
      >
        <FileTextOutlined style={{ fontSize: 28 }} />
        <Title
          level={2}
          style={{
            margin: 0,
            lineHeight: "1",
            display: "flex",
            alignItems: "center",
          }}
        >
          Bài viết sức khỏe
        </Title>
      </div>

      <Space style={{ marginBottom: 24 }} wrap>
        <Select
          value={selectedCategory}
          style={{ width: 180 }}
          onChange={(value) => setSelectedCategory(value)}
        >
          {allCategories.map((cat) => (
            <Option key={cat} value={cat}>
              {cat === "all" ? "Tất cả thể loại" : cat}
            </Option>
          ))}
        </Select>

        <Select
          value={selectedTag}
          style={{ width: 180 }}
          onChange={(value) => setSelectedTag(value)}
        >
          {allTags.map((tag) => (
            <Option key={tag} value={tag}>
              {tag === "all" ? "Tất cả tag" : tag}
            </Option>
          ))}
        </Select>

        <Select
          value={selectedTime}
          style={{ width: 180 }}
          onChange={(value) => setSelectedTime(value)}
        >
          <Option value="all">Tất cả thời gian</Option>
          <Option value="today">Hôm nay</Option>
          <Option value="week">1 tuần qua</Option>
          <Option value="month">1 tháng qua</Option>
        </Select>
      </Space>

      <Row gutter={[24, 24]}>
        {filtered.map((article) => (
          <Col xs={24} sm={12} md={8} key={article._id}>
            <Card
              hoverable
              onClick={() => navigate(`/bai-viet/${article.slug}`)}
              style={{ borderRadius: 12, overflow: "hidden", padding: 10 }}
              cover={
                <img
                  alt={article.title}
                  src={`${import.meta.env.VITE_BACKEND_URL}/public/images/articles/${article.thumbnail}`}
                  style={{
                    height: 200,
                    width: "100%",
                    objectFit: "cover",
                    borderTopLeftRadius: 12,
                    borderTopRightRadius: 12,
                    padding: 10,
                  }}
                />
              }
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  marginBottom: 8,
                }}
              >
                <CalendarOutlined />
                <Text type="secondary" style={{ fontSize: 12 }}>
                  {dayjs(article.publishedAt).format("DD/MM/YYYY")}
                </Text>
              </div>

              <Title level={4} style={{ marginTop: 4, marginBottom: 8 }}>
                {article.title}
              </Title>

              {article.author && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    marginBottom: 8,
                  }}
                >
                  <UserOutlined />
                  <Text type="secondary" style={{ fontSize: 13 }}>
                    Tác giả: {article.author.name}
                  </Text>
                </div>
              )}

              <Paragraph ellipsis={{ rows: 2 }}>{article.summary}</Paragraph>

              <div
                style={{
                  marginTop: 8,
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 8,
                  alignItems: "center",
                }}
              >
                <Tag icon={<TagsOutlined />} color="blue">
                  {article.category}
                </Tag>
                {(article.tags || []).map((tag) => (
                  <Tag key={tag}>{tag}</Tag>
                ))}
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {filtered.length === 0 && (
        <div style={{ marginTop: 40 }}>
          <Text type="secondary">Không tìm thấy bài viết phù hợp.</Text>
        </div>
      )}
    </div>
  );
};

export default ArticlesPage;
