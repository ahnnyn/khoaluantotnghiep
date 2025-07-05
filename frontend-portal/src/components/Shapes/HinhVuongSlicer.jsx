import React, { useRef, useEffect, useState } from 'react';
import { Card, Carousel, Button, Avatar } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import './hinhvuongslicer.scss';

const HinhVuongSlider = ({ items, urlDoctor, type }) => {
  const carouselRef = useRef(null);
  const [chunkedItems, setChunkedItems] = useState([]);

  const getChunkSize = () => {
    const width = window.innerWidth;
    if (width < 768) return 1;        // Mobile
    if (width < 1200) return 2;       // Tablet
    return 4;                         // Laptop/Desktop
  };

  const chunkArray = (array, size) => {
    const result = [];
    for (let i = 0; i < array.length; i += size) {
      result.push(array.slice(i, i + size));
    }
    return result;
  };

  const updateChunks = () => {
    const size = getChunkSize();
    setChunkedItems(chunkArray(items, size));
  };

  useEffect(() => {
    updateChunks();
    window.addEventListener('resize', updateChunks);
    return () => window.removeEventListener('resize', updateChunks);
  }, [items]);

  return (
    <div className="slider-container">
      <Button onClick={() => carouselRef.current.prev()} className="slider-button left">
        <LeftOutlined />
      </Button>

      <Carousel ref={carouselRef} dots={false} draggable>
        {chunkedItems.map((chunk, index) => (
          <div key={index}>
            <div className="slider-wrapper">
              {chunk.map((item, idx) => (
                <Card
                  key={idx}
                  className="square-card"
                  onClick={() => urlDoctor(item.id)}
                  hoverable
                  bodyStyle={{ padding: 16 }}
                >
                  {type === 'doctor' ? (
                    <Avatar shape="square" size={200} src={item.src} />
                  ) : (
                    <img
                      src={item.src}
                      alt={item.txtP}
                      className="square-image"
                    />
                  )}
                  <p className="doctor-name">{item.txtP}</p>
                  <p className="doctor-department">{item.txtB}</p>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </Carousel>

      <Button onClick={() => carouselRef.current.next()} className="slider-button right">
        <RightOutlined />
      </Button>
    </div>
  );
};

export default HinhVuongSlider;
