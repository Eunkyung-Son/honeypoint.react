import axios, { AxiosResponse } from "axios";
import { observer } from "mobx-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { HeartOutlined, EditOutlined, ShareAltOutlined, HeartFilled, EditFilled } from '@ant-design/icons';
import { Avatar, Col, Descriptions, List, Row, Spin } from "antd";
import { SERVER_URL } from "../../config/config";
import food from '../../images/food1.jpg';
import Menu from "../../models/Menu";
import Review from "../../models/Review";
import CustomCarousel from "../../components/CustomCarousel";
import ReviewAddModal from './modal/ReviewAddModal';
import ReviewAddModalStore from './modal/ReviewAddModalStore';
import RestaurantDetailStore from "./RestaurantDetailStore";
import { useRootStore } from "../../hooks/StoreContextProvider";
import './RestaurantDetailPage.scss';

declare global {
  interface Window {
    kakao: any;
  }
}

type RouteProps = {
  rNo: string
}

const RestaurantDetailPage: React.FC<RouteProps> = (props: RouteProps) => {
  const { rNo } = useParams<RouteProps>();
  const { authStore } = useRootStore();
  const [restaurantDetailStore] = useState(() => new RestaurantDetailStore());
  const reviewAddModalStore = new ReviewAddModalStore(); // 위의 타이머 정의를 참고하세요.
  const [loading, setLoading] = useState(false);
  const [restAddress, setRestAddress] = useState('');

  const URL = `${SERVER_URL}/api/restaurant/${rNo}`;

  const restDetailInfo = async () => {
    console.log(rNo);
    const params = {
      fetchReviewList: true,
      fetchReviewCount: true,
      fetchMenuList: true,
      fetchFavorCount: true,
      fetchReservation: true,
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
        setLoading(true);
        const { setRestaurantData, setFavorCount, setMenuList, setReviewCount, setReviewList } = restaurantDetailStore;
        console.log(response);
        setRestaurantData(response.data.restaurant);
        setFavorCount(response.data.favorCount);
        setMenuList(response.data.menus)
        setReviewCount(response.data.reviewCount);
        setReviewList(response.data.reviews);
        setLoading(false);
      })
  }

  useEffect(() => {
    restDetailInfo();

    let container = document.getElementById('map'); //지도를 담을 영역의 DOM 레퍼런스
    var geocoder = new window.kakao.maps.services.Geocoder();

    if (!restaurantDetailStore.restaurantData?.rAddress) return;
    setRestAddress(restaurantDetailStore.restaurantData.rAddress.substr(6));


    geocoder.addressSearch(restAddress, (result: any, status: any) => {
      console.log(restAddress);
      // 정상적으로 검색이 완료됐으면 
      if (status === window.kakao.maps.services.Status.OK) {


        var coords = new window.kakao.maps.LatLng(result[0].y, result[0].x);
        let options = { //지도를 생성할 때 필요한 기본 옵션
          center: coords,
          level: 3 //지도의 레벨(확대, 축소 정도)
        };

        let map = new window.kakao.maps.Map(container, options);

        // 결과값으로 받은 위치를 마커로 표시합니다
        var marker = new window.kakao.maps.Marker({
          map: map,
          position: coords
        });

        // 인포윈도우로 장소에 대한 설명을 표시합니다
        var infowindow = new window.kakao.maps.InfoWindow({
          content: `<div style="width:150px;text-align:center;padding:6px 0;">${restaurantDetailStore.restaurantData?.rName}</div>`
        });
        infowindow.open(map, marker);

        // 지도의 중심을 결과값으로 받은 위치로 이동시킵니다
        console.log(coords);
        map.setCenter(coords);
      }
    })

  }, [])

  const menuData: { title: string; content: string; }[] | undefined = [];

  restaurantDetailStore.menuList?.map((data: Menu) => (
    menuData.push({
      title: data.menuName,
      content: data.menuPrice
    })
  ))


  const reviewData: any[] | undefined = [];

  restaurantDetailStore.reviewList?.map((data: Review) => (
    reviewData.push({
      mnickname: data.gnrlMember.mnickname,
      revDate: data.revDate,
      revCn: data.revCn,
      score: data.score
    })
  ))

  const handleWriteClick = () => {
    if (!authStore.isLoggedIn) {
      alert('로그인 후 이용해주세요.');
      return;
    }
    reviewAddModalStore.setVisible(true);
  }

  const handleLikeClick = () => {
    if (!authStore.isLoggedIn) {
      alert('로그인 후 이용해주세요');
      return;
    }
  }

  return (
    <>
      <Spin tip="Loading..." spinning={loading}>
        <CustomCarousel>
          <div className="carousel-div">
            <img src={food} style={{ width: '100%', height: '100%' }} />
          </div>
          <div className="carousel-div">
            <img src={food} style={{ width: '100%', height: '100%' }} />
          </div>
          <div className="carousel-div">
            <img src={food} style={{ width: '100%', height: '100%' }} />
          </div>
        </CustomCarousel>
        <div style={{ margin: "100px" }}>
          <Row>
            <Col span={10}>
              <span className="restname">
                {restaurantDetailStore.restaurantData?.rName ?? ''}
              </span>&nbsp;
              <span className="restrating">
                {restaurantDetailStore.restaurantData?.rRating ?? 0}★
              </span>
            </Col>
            <Col span={8}></Col>
            <Col span={2}>
              <div className="share">
                <ShareAltOutlined style={{ fontSize: '40px' }} />
                <p>공유하기</p>
              </div>
            </Col>
            <Col span={2}>
              <div className="review" onClick={handleWriteClick}>
                <EditOutlined style={{ fontSize: '40px' }} />
                <p>리뷰쓰기</p>
              </div>
            </Col>
            <Col span={2}>
              <div className="like" onClick={handleLikeClick}>
                <HeartOutlined style={{ fontSize: '40px' }} />
                <p>가고싶다</p>
              </div>
            </Col>
          </Row>

          <HeartFilled style={{ fontSize: '15px' }} />{restaurantDetailStore.favorCount}&nbsp;
          <EditFilled style={{ fontSize: '15px' }} />{restaurantDetailStore.reviewCount}
          <hr className="detail-hr" />
          <Row justify="space-between">
            <Col span={8}>
              <Descriptions 
                className="rest-info"
                labelStyle={{ width: '35%', alignItems: "baseline" }}
                size="small"
              >
                <Descriptions.Item label="주소" span={3}>
                  {restaurantDetailStore.restaurantData?.rAddress}
                </Descriptions.Item>
                <Descriptions.Item label="전화번호" span={3}>
                  {restaurantDetailStore.restaurantData?.rTel}
                </Descriptions.Item>
                <Descriptions.Item label="가격대" span={3}>
                  {restaurantDetailStore.restaurantData?.rPrice.toLocaleString()}
                </Descriptions.Item>
                <Descriptions.Item label="영업시간" span={3}>
                  {restaurantDetailStore.restaurantData?.rStartTime ?? ''} ~ ${restaurantDetailStore.restaurantData?.rEndTime}
                </Descriptions.Item>
                <Descriptions.Item label="휴일" span={3}>
                  {restaurantDetailStore.restaurantData?.rRestDay}
                </Descriptions.Item>
                <Descriptions.Item label="메뉴" span={3}>
                  <Descriptions 
                    labelStyle={{ width: '50%'}} 
                    size="small"
                  >
                    {menuData.map((menu) => (
                      <Descriptions.Item 
                        className="menu-item"
                        label={menu.title}
                        span={3}
                      >
                        {menu.content}
                      </Descriptions.Item>
                    ))}
                  </Descriptions>
                </Descriptions.Item>
              </Descriptions>
            </Col>
            <Col></Col>
          </Row>
          <hr className="detail-hr" />
          <div style={{ marginBottom: "20px" }} />
          <div>
            <span className="restname">
              지도
            </span>
            <div style={{ marginBottom: "10px" }} />
            <div id="map" style={{ width: "100%", height: "400px" }} />
          </div>
          <div style={{ marginBottom: "10px" }} />
          <hr className="detail-hr" />
          <div style={{ marginBottom: "20px" }} />
          <Row>
            <Col span={16}>
              <span className="restname">
                리뷰
              </span>
            </Col>
            <Col span={2}>{`전체(${restaurantDetailStore.reviewCount})`}</Col>
            <Col span={2}>맛있다</Col>
            <Col span={2}>보통</Col>
            <Col span={2}>별로</Col>
          </Row>
          <List
            className="demo-loadmore-list"
            itemLayout="horizontal"
            dataSource={reviewData}
            renderItem={item => (
              <List.Item
                actions={[<a key="list-loadmore-edit">edit</a>, <a key="list-loadmore-more">delete</a>]}
              >
                <List.Item.Meta
                  avatar={
                    <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
                  }
                  title={<a href="https://ant.design">{`${item.mnickname} | ${item.revDate}`}</a>}
                  description={item.revCn}
                />
                <div>{item.score}</div>
              </List.Item>
            )}
          />
        </div>
      </Spin>
      <ReviewAddModal
        modalStore={reviewAddModalStore}
      />
    </>
  )
};

export default observer(RestaurantDetailPage);