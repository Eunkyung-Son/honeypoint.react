import React, { useEffect, useState } from "react";
import axios, { AxiosResponse } from "axios";
import { Link } from "react-router-dom";
import { observer } from "mobx-react";
import { Col, Row,  Input, Button, Typography } from 'antd';
import food from '../../images/food1.jpg';
import { SERVER_URL } from "../../config/config";
import CustomCard from "../../components/CustomCard";
import CustomCarousel from "../../components/CustomCarousel";
import MainContentStore from "./MainContentStore";
import { useRootStore } from "../../hooks/StoreContextProvider";
import './MainContentPage.scss';
import RestaurantData from "../../models/RestaurantData";

const { Title } = Typography;
const { Search } = Input;


const MainContentPage: React.FC = () => {
  const { routing } = useRootStore();
  const [mainContentStore] = useState(() => new MainContentStore());

  const getTypeOfRestaurantInfo = async (restType: string) => {
    const URL = `${SERVER_URL}/api/restaurants`;
    const params = {
      restaurantType: restType
    }

    return await axios
      .get(URL, {
        headers: {
          'Content-Type': 'application/json'
        },
        params: {
          ...params
        }
      })
  }

  const getRestaurantInfo = async () => {
    const URL = `${SERVER_URL}/api/restaurant/all`;
    await axios
      .get(URL, {
        headers: {
          'Content-Type': 'application/json'
        },
      }).then((response: AxiosResponse) => {
        mainContentStore.setAllRestaurantData(response.data.restaurants);
      })
  }

  useEffect(() => {
    getRestaurantInfo();
    const { setRestaurantCafeData, setRestaurantKoreanData, setRestaurantWesternData } = mainContentStore;
    getTypeOfRestaurantInfo("한식").then((response: AxiosResponse) => {
      setRestaurantKoreanData((response.data.restaurants));
    });
    getTypeOfRestaurantInfo("카페").then((response: AxiosResponse) => {
      setRestaurantCafeData((response.data.restaurants));
    });
    getTypeOfRestaurantInfo("양식").then((response: AxiosResponse) => {
      setRestaurantWesternData((response.data.restaurants));
    });
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

  return (
    <div className="MainContentPage">
      <Row className="main-image-area" justify="center" align="top">
        <Col span={24}>
          <Search
            className="search-bar"
            placeholder="검색해서 맛집을 찾아보세요!"
            size="large"
            enterButton
            onSearch={handleSearch}
          />
        </Col>
      </Row>
      <div className="main-content-list">
        <Row className="list-row-header">
          <Title level={4}>#평점 높은 순</Title>
        </Row>
        <CustomCarousel>
        {mainContentStore.allRestaurantData?.map((data) => {
            return (
              <div carousel-div>
                <Link to={`/detail/${data.rNo}`}>
                  <img 
                    src={`${SERVER_URL}/api/file/restaurant/${data.rNo}/${data.fileIds[0]}`} 
                    style={{ width: "500px", height: "300px" }}
                  />
                </Link>
              </div>
            )
           
          })}
        </CustomCarousel>
        <hr className="main-hr" />
        <Row className="list-row-header" justify="space-between">
          <Col>
            <Title level={4}>#요즘 뜨는 한식</Title>
          </Col>
          <Col>
            <Button className="div-in-button" shape="round"><Link to="/more/한식">더보기</Link></Button>
          </Col>
        </Row>
        <Row justify="space-between" className="list-row" gutter={[24, 24]}>
          {mainContentStore.restaurantKoreanData?.length && mainContentStore.restaurantKoreanData?.reduce((total, data, idx) => {
            if (idx > 3) return total;
            const el = (
              <Col span={6}>
                <CustomCard
                  onClick={() => handleClick(data.rNo)}
                  key={data.rNo}
                  title={data.rName}
                  description={data.rAddress}
                  src={`${SERVER_URL}/api/file/restaurant/${data.rNo}/${data.fileIds[0]}`}
                />
              </Col>
            )
            return [...total, el];
          }, [] as React.ReactNode[])}
        </Row>
        <hr className="main-hr" />
        <Row className="list-row-header" justify="space-between">
          <Col>
            <Title level={4}>#요즘 뜨는 카페</Title>
          </Col>
          <Col>
            <Button className="div-in-button" shape="round"><Link to="/more/카페">더보기</Link></Button>
          </Col>
        </Row>
        <Row justify="space-around" align="top" className="list-row" gutter={[24, 24]}>
          {mainContentStore.restaurantCafeData?.length && mainContentStore.restaurantCafeData?.reduce((total, data, idx) => {
            if (idx > 3) return total;
            const el = (
              <Col span={6}>
                <CustomCard
                  onClick={() => handleClick(data.rNo)}
                  key={data.rNo}
                  title={data.rName}
                  description={data.rAddress}
                  src={`${SERVER_URL}/api/file/restaurant/${data.rNo}/${data.fileIds[0]}`}
                />
              </Col>
            )
            return [...total, el];
          }, [] as React.ReactNode[])}
        </Row>
        <hr className="main-hr" />
        <Row className="list-row-header" justify="space-between">
          <Col>
            <Title level={4}>#요즘 뜨는 양식</Title>
          </Col>
          <Col>
            <Button className="div-in-button" shape="round"><Link to="/more/양식">더보기</Link></Button>
          </Col>
        </Row>
        <Row justify="space-around" align="top" className="list-row" gutter={[24, 24]}>
          {mainContentStore.restaurantWesternData?.length && mainContentStore.restaurantWesternData?.reduce((total, data, idx) => {
            if (idx > 3) return total;
            const el = (
              <Col span={6}>
                <CustomCard
                  onClick={() => handleClick(data.rNo)}
                  key={data.rNo}
                  title={data.rName}
                  description={data.rAddress}
                  src={`${SERVER_URL}/api/file/restaurant/${data.rNo}/${data.fileIds[0]}`}
                />
              </Col>
            )
            return [...total, el];
          }, [] as React.ReactNode[])}
        </Row>
      </div>
    </div>
  )
}

export default observer(MainContentPage)
