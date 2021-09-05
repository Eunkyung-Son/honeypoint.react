import React from "react";
import axios, { AxiosResponse } from "axios";
import { observer } from "mobx-react";
import { Col, Row, Divider, Input, Button } from 'antd';
import CustomCard from "../../components/CustomCard";
import CustomCarousel from "../../components/CustomCarousel";
import { SERVER_URL } from "../../config/config";
import food from '../../images/food1.jpg';
import MainContentStore from "./MainContentStore";
import './MainContentPage.scss';

type Props = {
}

@observer
export default class MainContentPage extends React.Component<Props> {
  mainContentStore = new MainContentStore();

  componentDidMount() {
    this.getRestaurantInfo();
  }

  getRestaurantInfo = async () => {
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
        console.log(response);
        const { setRestaurantData, setTotal } = this.mainContentStore;
        setRestaurantData(response.data.restaurants);
        setTotal(response.data.total);
      })
  }

  render() {
    const { Search } = Input;
    const { restaurantData } = this.mainContentStore;

    return (
      <>
        <Row justify="center" align="top">
          <Col span={24}>
            <div className="search-image-area">
              <div>
                <Search className="search-bar" placeholder="검색해서 맛집을 찾아보세요!" size="large" enterButton style={{ display: 'inline-flex', justifyContent: 'center', alignItems: 'center'}}/>
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
          {restaurantData?.length && restaurantData?.reduce((total, data, idx) => {
            if (idx > 3) return total;
            const el = (
              <CustomCard
                title={data.rName}
                description={data.rAddress}
              />
            )
            return [...total,el];
          }, [] as React.ReactNode[])}
        </Row>
      </>
    )
  }
}