import React from "react";
import { Carousel } from "antd";
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { CustomArrowProps, Settings } from "react-slick";
import './CustomCarousel.scss';
import { observer } from "mobx-react";

type Props = {
  children?: React.ReactChild | React.ReactChild[],
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

const ResponseCarousel: React.FC<Props> = observer(({children}: Props) => {
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
        {children}
      </Carousel>
    </div>
  );
})

export default ResponseCarousel