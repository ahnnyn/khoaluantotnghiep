// components/Skeletons/CardSkeleton.tsx
import { Card, Skeleton } from "antd";
import "./CardSkeleton.scss";

const CardSkeleton = ({ count = 4 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div className="slider-item" key={index}>
          <Card
            hoverable
            className="article-card"
            cover={<Skeleton.Image style={{ width: "100%", height: 180 }} />}
          >
            <Skeleton
              active
              paragraph={{ rows: 2 }}
              title={{ width: "80%" }}
            />
          </Card>
        </div>
      ))}
    </>
  );
};

export default CardSkeleton;
