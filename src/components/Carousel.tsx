import React, { Component } from "react";
import { CustomArrowProps, Settings } from "react-slick";
import './Carousel.scss';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { Carousel } from "antd";

type Props = {
}

const NextArrow = (props: CustomArrowProps) => {
  const { className, style, onClick } = props;
  return (
    <RightOutlined
      className={className}
      style={{
        ...style,
        color: 'black',
        fontSize: '15px',
        lineHeight: '1.5715'
      }}
      onClick={onClick}
    />    
  );
}

const PrevArrow = (props: CustomArrowProps) => {
  const { className, style, onClick } = props;
  return (
    <LeftOutlined
      className={className}
      style={{
        ...style,
        color: 'black',
        fontSize: '15px',
        lineHeight: '1.5715',
      }}
      onClick={onClick}
    />
  );
}

export default class Responsive extends Component<Props>{

  render() {
    var settings: Settings = {
      dots: true,
      infinite: false,
      speed: 500,
      slidesToShow: 3,
      slidesToScroll: 3,
      initialSlide: 0,
      nextArrow: <NextArrow/>,
      prevArrow: <PrevArrow/>,
      responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 3,
            infinite: true,
          }
        },
        {
          breakpoint: 600,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 2,
            initialSlide: 2
          }
        },
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1
          }
        }
      ]
    };
    return (
      <div className='hp-carousel'>
        <Carousel
          {...settings}
          arrows={true}
        >
          <div className="carousel-div">
            <h3>1</h3>
          </div>
          <div className="carousel-div">
            <h3>2</h3>
          </div>
          <div className="carousel-div">
            <h3>3</h3>
          </div>
          <div className="carousel-div">
            <h3>4</h3>
          </div>
          <div className="carousel-div">
            <h3>5</h3>
          </div>
          <div className="carousel-div">
            <h3>6</h3>
          </div>
          <div className="carousel-div">
            <h3>7</h3>
          </div>
          <div className="carousel-div">
            <h3>8</h3>
          </div>
        </Carousel>
      </div>
    );
  }
}