import React, { useState, useEffect } from 'react';
import { IoBarChartOutline, IoBulbOutline, IoSparklesOutline } from 'react-icons/io5';
import './CardCarousel.css';

const cardsData = [
  {
    icon: <IoBarChartOutline />,
    title: 'Track Your Habits',
    text: 'Gain clarity on your digital usage with simple, beautiful analytics.',
    color: '#DFF7F0' // Mint Green
  },
  {
    icon: <IoBulbOutline />,
    title: 'Get Smart Tips',
    text: 'Receive personalized advice to improve focus and mental wellbeing.',
    color: '#FFF9D9' // Lemon
  },
  {
    icon: <IoSparklesOutline />,
    title: 'Build Balance',
    text: 'Set goals and challenges to help you disconnect and live mindfully.',
    color: '#fcdedeff' // Coral
  }
];

const CardCarousel = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % cardsData.length);
    }, 3000); // Rotate every 3 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="carousel-container">
      <div className="carousel-inner">
        {cardsData.map((card, index) => {
          const isActive = index === activeIndex;
          const isPrev = index === (activeIndex - 1 + cardsData.length) % cardsData.length;
          const isNext = index === (activeIndex + 1) % cardsData.length;

          let className = 'carousel-card';
          if (isActive) className += ' active';
          else if (isPrev) className += ' prev';
          else if (isNext) className += ' next';

          return (
            <div key={index} className={className} style={{'--card-bg-color': card.color}}>
              <div className="card-icon">{card.icon}</div>
              <h3 className="card-title">{card.title}</h3>
              <p className="card-text">{card.text}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CardCarousel;