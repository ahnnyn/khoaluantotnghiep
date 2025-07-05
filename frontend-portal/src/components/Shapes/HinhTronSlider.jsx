import React, { useRef } from 'react';
import { Card, Carousel, Button, Avatar } from 'antd';
import { LeftOutlined, RightOutlined, UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const HinhTronSlider = ({ items, urlDoctor }) => {

  const carouselRef = useRef(null);
  const navigate = useNavigate()

  const onChange = (currentSlide) => {
    console.log(currentSlide);
  };

  const chunkArray = (array, size) => {
    const result = [];
    for (let i = 0; i < array.length; i += size) {
      result.push(array.slice(i, i + size));
    }
    return result;
  };

  const chunkedItems = chunkArray(items, 4);

  const goToPrev = () => {
    carouselRef.current.prev();
  };

  const goToNext = () => {
    carouselRef.current.next();
  };

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <Carousel ref={carouselRef} afterChange={onChange} draggable={true}>
        {chunkedItems.map((chunk, chunkIndex) => (
          <div key={chunkIndex}>
            <div className="slider-wrapper" style={{ display: 'flex', justifyContent: 'space-between', textAlign: "center" }}>
              {chunk.map((item, index) => (                
                <Card
                  key={index}
                  style={{
                    cursor: "pointer",
                    width: 350,
                    border: "none",
                    // border: "1px solid black",
                    margin: "0 8px",
                    // height: 500,
                    borderRadius: "15px",
                    backgroundColor: "transparent", // Make card background transparent
                  }}
                  onClick={() => urlDoctor(item.id)}
                >
                  {/* <img src={item.src} alt={item.txtP} width={250} height={200} /> */}
                  <Avatar size={210} src={item.src} icon={<UserOutlined />} />
                  <p style={{ fontWeight: "500", fontSize: "19px", textAlign: "center" }}>{item.txtP}</p>
                  <p style={{ fontSize: "17px", textAlign: "center", color: "gray",  }}>{item.txtB}</p>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </Carousel>
      
      <Button 
        onClick={goToPrev} 
        style={{ position: 'absolute', top: '45%', left: '-15px', zIndex: 1, height: "40px" }}
      >
        <LeftOutlined />
      </Button>
      <Button 
        onClick={goToNext} 
        style={{ position: 'absolute', top: '45%', right: '-15px', zIndex: 1, height: "40px" }}
      >
        <RightOutlined />
      </Button>
    </div>
  );
};

export default HinhTronSlider;
