import { Card, Tag, Typography } from "antd";
import {
  CalendarOutlined,
  TagsOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import "./ArticleCard.scss"; // tạo CSS riêng nếu cần

const { Paragraph, Text } = Typography;

const ArticleCard = ({ article, onClick }) => {
  return (
    <div className="article-card-wrapper" onClick={onClick}>
      <Card
        className="article-card"
        hoverable
        cover={
          <img
            alt={article.title}
            src={article.thumbnail}
            className="article-thumbnail"
          />
        }
      >
        <div className="article-meta">
          <CalendarOutlined />
          <Text type="secondary" style={{ fontSize: 12 }}>
            {dayjs(article.publishedAt).format("DD/MM/YYYY")}
          </Text>
        </div>

        <p className="article-title">{article.title}</p>

        <Paragraph className="article-summary" ellipsis={{ rows: 2 }}>
          {article.summary}
        </Paragraph>

        <div className="article-tags">
          <Tag icon={<TagsOutlined />} color="blue">
            {article.category}
          </Tag>
          {(article.tags || []).map((tag) => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default ArticleCard;
