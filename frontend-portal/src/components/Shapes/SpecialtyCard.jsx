// components/Shapes/SpecialtyCard.tsx
import { Card } from "antd";
import "./SpecialtyCard.scss";

const SpecialtyCard = ({ imageSrc, title, description, onClick }) => {
  return (
    <div className="specialty-card-wrappers" onClick={onClick}>
      <Card className="specialty-cards" hoverable>
        <img src={imageSrc} alt={title} className="specialty-images" />
        <div className="specialty-texts">
          <p className="specialty-titles">{title}</p>
          <p className="specialty-descriptions">{description}</p>
        </div>
      </Card>
    </div>
  );
};

export default SpecialtyCard;