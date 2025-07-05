import React, { useRef } from 'react';
import { Card, Carousel, Button } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';

const HinhVuong = ({ items, width, height, loadingCard, urlDoctor }) => {
  const carouselRef = useRef(null);

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

  const chunkedItems = chunkArray(items, 3);

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
            <div className="slider-wrapper" style={{ display: 'flex', justifyContent: 'space-between' }}>
              {chunk.map((item, index) => (
                <Card
                  key={index}
                  style={{
                    width: 350,
                    border: "1px solid rgb(187, 187, 187)",
                    margin: "0 8px",
                    // height: 370,
                    borderRadius: "15px",
                  }}
                  loading={loadingCard}
                  onClick={() => urlDoctor(item.id)}
                >
                  <img src={item.src} alt={item.txtP} width={width} height={height} />
                  <p style={{ fontWeight: "500", fontSize: "20px", textAlign: "center" }}>{item.txtP}</p>
                  <p style={{ fontWeight: "300", fontSize: "17px", textAlign: "center", color: "gray" }}>{item.txtAddress}</p>

                </Card>
              ))}
            </div>
          </div>
        ))}
      </Carousel>
      
      <Button 
        onClick={goToPrev} 
        style={{ position: 'absolute', top: '40%', left: '-15px', zIndex: 1, height: "40px" }}
      >
        <LeftOutlined />
      </Button>
      <Button 
        onClick={goToNext} 
        style={{ position: 'absolute', top: '40%', right: '-15px', zIndex: 1, height: "40px" }}
      >
        <RightOutlined />
      </Button>
    </div>
  );
};

export default HinhVuong;
