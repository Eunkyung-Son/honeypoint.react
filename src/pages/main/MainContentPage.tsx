import React from "react";
import { Col, Row, Divider, Input } from 'antd';
import CustomCarousel from "../../components/CustomCarousel";
import food from '../../images/food1.jpg';
import CustomCard from "../../components/CustomCard";
import { SERVER_URL } from "../../config/config";
import axios, { AxiosResponse } from "axios";
import RestaurantMember from "../../models/RestaurantMember";
import MainContentStore from "./MainContentStore";
import { observer } from "mobx-react";
import { toJS } from "mobx";

type Props = {

}

@observer
export default class MainContentPage extends React.Component<Props> {
  mainContentStore = new MainContentStore();

  componentDidMount() {
    this.getRestaurantInfo();
  }

  getRestaurantInfo = async () => {
    const URL = `${SERVER_URL}/api/restaurant/185`;

    // const params = {
    //   restaurantType: "카페"
    // }

    await axios
      .get(URL, {
        // params: {
        //   ...params
        // }
      })
      .then((response: AxiosResponse) => {
        const restaurantData = response.data.restaurant;
        
        this.mainContentStore.setRestAddress(restaurantData.rname);
        this.mainContentStore.setRestName(restaurantData.raddress);
      })
  }

  render() {
    const { Search } = Input;
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
        <Divider orientation="left">#요즘 뜨는 한식</Divider>
        <CustomCard
          title={this.mainContentStore.restName!}
          description={this.mainContentStore.restAddress!}
        />
      </>
    )
  }
}