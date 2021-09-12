import React, { useEffect, useState } from "react";
import axios, { AxiosResponse } from "axios";
import { observer } from "mobx-react";
import { RouterStore } from "mobx-react-router";
import { Col, Row, Divider, Input, Button } from 'antd';
import CustomCard from "../../components/CustomCard";
import CustomCarousel from "../../components/CustomCarousel";
import { SERVER_URL } from "../../config/config";
import food from '../../images/food1.jpg';
import MainContentStore from "./MainContentStore";
import { useRootStore } from "../../hooks/StoreContextProvider";
import './MainContentPage.scss';

type Props = {
  routing: RouterStore;
}

const MainContentPage: React.FC<Props> = observer((props: Props) => {
  const { routing } = useRootStore();
  const [mainContentStore] = useState(() => new MainContentStore());

  const getRestaurantInfo = async () => {
    const URL = `${SERVER_URL}/api/restaurants`;
    const params = {
      restaurantType: "한식"
    }

    await axios
      .get(URL, {
        headers: {
          'Content-Type': 'application/json'
        },
        params: {
          ...params
        }
      })
      .then((response: AxiosResponse) => {
        const { setRestaurantData, setTotal } = mainContentStore;
        setRestaurantData((response.data.restaurants));
        setTotal(response.data.total);
    })
  }

  useEffect(() => {
    getRestaurantInfo();
  }, [])

  const handleSearch = (value: string) => {
    if (!value) {
      alert('검색할 키워드를 입력해주세요');
      return;
    }
    console.log(value);
    routing.push(`/search/${value}`)
  }

  const handleClick = (rNo: number) => {
    routing.push(`/detail/${rNo}`);
  }

  const { Search } = Input;
  const searchStyle = {
    display: 'inline-flex', 
    justifyContent: 'center', 
    alignItems: 'center'
  }

  return (
    <>
      <Row justify="center" align="top">
        <Col span={24}>
          <div className="search-image-area">
            <div>
              <Search 
                className="search-bar" 
                placeholder="검색해서 맛집을 찾아보세요!" 
                size="large" 
                enterButton 
                style={searchStyle}
                onSearch={handleSearch}
              />
            </div>
          </div>
        </Col>
      </Row>
      <Divider orientation="left">#요즘 뜨는 카페</Divider>
      <CustomCarousel>
        <div className="carousel-div">
          <img src={food} style={{width: '100%', height: '100%'}} />
        </div>
        <div className="carousel-div">
          <img src={food} style={{width: '100%', height: '100%'}} />
        </div>
        <div className="carousel-div">
          <img src={food} style={{width: '100%', height: '100%'}} />
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
      </CustomCarousel>
      <hr className="main-hr" />
      <div className="content-div">
        <p className="div-in-p">#요즘 뜨는 한식</p>
        <Button className="div-in-button" shape="round">더보기</Button>
      </div>
      <Row justify="space-around" align="top">
        {mainContentStore.restaurantData?.length && mainContentStore.restaurantData?.reduce((total, data, idx) => {
          if (idx > 3) return total;
          const el = (
            <CustomCard
              onClick={() => handleClick(data.rNo)}
              key={data.rNo}
              title={data.rName}
              description={data.rAddress}
            />
          )
          return [...total,el];
        }, [] as React.ReactNode[])}
      </Row>
    </>
  )
})

export default MainContentPage
