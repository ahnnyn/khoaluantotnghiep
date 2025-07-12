// components/Shapes/SpecialtyCard.tsx
import { Card } from "antd";
import "./DoctorCard.scss";

const DoctorCard = ({ imageSrc, title, description, onClick }) => {
  return (
    <div className="doctor-card-wrapper" onClick={onClick}>
      <Card className="doctor-card" hoverable>
        <img src={imageSrc} alt={title} className="doctor-image" />
        <div className="doctor-text">
          <p className="doctor-title">{title}</p>
          <p className="doctor-description">{description}</p>
        </div>
      </Card>
    </div>
  );
};

export default DoctorCard;