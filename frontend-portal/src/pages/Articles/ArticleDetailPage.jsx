import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Typography, Tag, Divider, Row, Col, Card, Image } from "antd";
import {
  CalendarOutlined,
  UserOutlined,
  TagsOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import axios from "axios";
import dayjs from "dayjs";
import vi from "dayjs/locale/vi";
import DOMPurify from "dompurify";

dayjs.locale(vi);
const { Title, Text, Paragraph } = Typography;

const ArticleDetailPage = () => {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [relatedArticles, setRelatedArticles] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchArticleDetail = async () => {
      try {
        const res = await axios.get(`/api/public/get-list-articles`);
        const allArticles = res.data.data || [];

        const found = allArticles.find((a) => a.slug === slug);
        if (found) {
          setArticle(found);

          const related = allArticles.filter(
            (a) => a.category === found.category && a._id !== found._id
          );
          setRelatedArticles(related.slice(0, 3));
        }
      } catch (err) {
        console.error("Error fetching article:", err);
      }
    };

    fetchArticleDetail();
  }, [slug]);

  if (!article) return <div>Đang tải bài viết...</div>;

  return (
    <div className="container mx-auto px-4 py-6">
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
          {article.title}
        </Title>
      </div>
      <div
        style={{ display: "flex", flexWrap: "wrap", gap: 16, marginBottom: 16 }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <CalendarOutlined style={{ fontSize: 14 }} />
          <Text type="secondary" style={{ fontSize: 14, margin: 0 }}>
            {dayjs(article.publishedAt).format("DD/MM/YYYY")}
          </Text>
        </div>

        {article.author?.name && (
          <Text type="secondary">
            <UserOutlined style={{ marginLeft: 12, marginRight: 4 }} />
            {article.author.name}
          </Text>
        )}
      </div>
      <div style={{ marginBottom: 16 }}>
        <Tag color="blue">
          <TagsOutlined /> {article.category}
        </Tag>

        {(article.tags || []).map((tag) => (
          <Tag key={tag}>{tag}</Tag>
        ))}
      </div>

      {article.thumbnail && (
        <Image
          src={article.thumbnail}
          alt="thumbnail"
          width="100%"
          style={{
            maxHeight: 400,
            objectFit: "cover",
            borderRadius: 8,
            marginTop: 24,
          }}
        />
      )}

      <Divider />

      <div
        dangerouslySetInnerHTML={{
          __html: DOMPurify.sanitize(article.content || ""),
        }}
        style={{ fontSize: 16, lineHeight: 1.7 }}
      />

      <Divider />

      {relatedArticles.length > 0 && (
        <>
          <Title level={4}>
            <FileTextOutlined style={{ marginRight: 8 }} />
            Bài viết liên quan
          </Title>
          <Row gutter={[16, 16]}>
            {relatedArticles.map((rel) => (
              <Col xs={24} sm={12} md={8} key={rel._id}>
                <Card
                  hoverable
                  onClick={() => navigate(`/bai-viet/${rel.slug}`)}
                  cover={
                    <img
                      alt={rel.title}
                      src={rel.thumbnail || "/articles/default.jpg"}
                      style={{ height: 160, objectFit: "cover" }}
                    />
                  }
                >
                  <Title level={5}>{rel.title}</Title>
                  <Paragraph ellipsis={{ rows: 2 }}>{rel.summary}</Paragraph>
                  <Tag color="blue">{rel.category}</Tag>
                </Card>
              </Col>
            ))}
          </Row>
        </>
      )}
    </div>
  );
};

export default ArticleDetailPage;
