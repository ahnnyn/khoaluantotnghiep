// components/Shapes/ServiceCard.tsx
import { Card } from "antd";
import "./ServiceCard.scss";

const ServiceCard = ({ icon, title, onClick }) => {
  return (
    <div className="service-card-wrapper" onClick={onClick}>
      <Card className="service-card" hoverable>
        <div className="icon-wrapper">{icon}</div>
        <p className="service-title">{title}</p>
      </Card>
    </div>
  );
};

export default ServiceCard;
