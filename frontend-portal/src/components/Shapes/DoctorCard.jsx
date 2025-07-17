// components/Shapes/DoctorCard.tsx
import { Card, Button } from "antd";
import "./DoctorCard.scss";
import { CalendarOutlined } from "@ant-design/icons";

const DoctorCard = ({ imageSrc, title, description, onClick }) => {
  return (
    <div className="doctor-card-wrapper">
      <Card className="doctor-card" hoverable onClick={onClick}>
        <div className="doctor-image-wrapper">
          <img src={imageSrc} alt={title} className="doctor-image" />
        </div>

        <div className="doctor-text">
          <p className="doctor-title">{title}</p>
          {description && <p className="doctor-description">{description}</p>}
        </div>

        <div className="doctor-card-footer">
          <Button
            type="primary"
            size="small"
            icon={<CalendarOutlined />}
            onClick={onClick}
             className="book-btn"
          >
            Đặt lịch
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default DoctorCard;
