import axios, { AxiosResponse } from "axios";
import { observer } from "mobx-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { HeartOutlined, EditOutlined, ShareAltOutlined, HeartFilled, EditFilled } from '@ant-design/icons';
import { Col, Descriptions, Row, Spin } from "antd";
import { SERVER_URL } from "../../config/config";
import food from '../../images/food1.jpg';
import Menu from "../../models/Menu";
import CustomCarousel from "../../components/CustomCarousel";
import ReviewAddModal from './modal/ReviewAddModal';
import RestaurantShareModal from './modal/RestaurantShareModal';
import RestaurantReview from "./review/RestaurantReview";
import ReviewAddModalStore from './modal/ReviewAddModalStore';
import RestaurantDetailStore from "./RestaurantDetailStore";
import RestaurantReviewStore from "./review/RestaurantReviewStore";
import RestaurantShareModalStore from './modal/RestaurantShareModalStore';
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
  const reviewAddModalStore = new ReviewAddModalStore();
  const restaurantShareModalStore = new RestaurantShareModalStore();
  const restaurantReviewStore = new RestaurantReviewStore();
  // FIXME: useState 확인
  const [loading, setLoading] = useState(false);
  const [isFavor, setIsFavor] = useState(null);

  useEffect(() => {
    async function initialize() {
      restLikeInfo();
      await restDetailInfo();
      await fetchMap();
    }
    initialize();
  }, [])

  const menuData: { title: string; content: string; }[] | undefined = [];
  
  const restDetailInfo = async () => {
    const URL = `${SERVER_URL}/api/restaurant/${rNo}`;
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
        const { setRestaurantData, setFavorCount, setMenuList, setReviewCount } = restaurantDetailStore;
        console.log(response.data);
        setRestaurantData(response.data.restaurant);
        setFavorCount(response.data.favorCount);
        setMenuList(response.data.menus)
        setReviewCount(response.data.reviewCount);
        setLoading(false);
      })
  }

  const restLikeInfo = async () => {
    if (!localStorage.getItem('member')) return;
    const URL = `${SERVER_URL}/api/favor/check`;
    const params = {
      restaurantId: rNo,
      memberId: JSON.parse(localStorage.getItem('member')!).mNo,
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
        setIsFavor(response.data.isFavor);
      })
  }

  const fetchMap = async () => {
    var geocoder = new window.kakao.maps.services.Geocoder();

    if (!restaurantDetailStore.restaurantData) return;
    const geoAddress = restaurantDetailStore.restaurantData.rAddress.substr(6);
    geocoder.addressSearch(geoAddress, (result: any, status: any) => {

      if (status === window.kakao.maps.services.Status.OK) {
        var coords = new window.kakao.maps.LatLng(result[0].y, result[0].x);
        let options = { 
          center: coords,
          level: 3 
        };
        let container = document.getElementById('map'); 
        let map = new window.kakao.maps.Map(container, options);
        var marker = new window.kakao.maps.Marker({
          map: map,
          position: coords
        });

        var infowindow = new window.kakao.maps.InfoWindow({
          content: `<div style="width:150px;text-align:center;padding:6px 0;">${restaurantDetailStore.restaurantData?.rName}</div>`
        });
        infowindow.open(map, marker);

        map.setCenter(coords);
      }
    })
  }

  restaurantDetailStore.menuList?.map((data: Menu) => (
    menuData.push({
      title: data.menuName,
      content: data.menuPrice
    })
  ))

  const handleReviewWriteClick = () => {
    if (!authStore.isLoggedIn) {
      alert('로그인 후 이용해주세요.');
      return;
    }
    reviewAddModalStore.setVisible(true);
  }

  const handleLikeClick = async () => {
    if (!authStore.isLoggedIn) {
      alert('로그인 후 이용해주세요');
      return;
    }

    const URL = `${SERVER_URL}/api/favor`;
    const params = {
      restaurantId: rNo,
      memberId: JSON.parse(localStorage.getItem('member')!).mNo,
    }
    await axios
      .post(URL, {}, {
        headers: {
          'Content-Type': 'application/json'
        },
        params: {
          ...params
        }
      })
      .then((response: AxiosResponse) => {
        restLikeInfo();
      })
  }

  const handleUnlikeClick = async () => {
    if (!authStore.isLoggedIn) {
      alert('로그인 후 이용해주세요');
      return;
    }

    const URL = `${SERVER_URL}/api/unFavor`;
    const params = {
      restaurantId: rNo,
      memberId: JSON.parse(localStorage.getItem('member')!).mNo,
    }
    await axios
      .post(URL, {}, {
        headers: {
          'Content-Type': 'application/json'
        },
        params: {
          ...params
        }
      })
      .then((response: AxiosResponse) => {
        restLikeInfo();
      })
  }

  const handleShareClick = async () => {
    restaurantShareModalStore.setVisible(true);
  }

  return (
    <div>
      <Spin tip="Loading..." spinning={loading}>
        <CustomCarousel>
          { restaurantDetailStore.restaurantData?.fileIds.map((file: string) => {
            return (
              <div className="carousel-div">
                <img src={`${SERVER_URL}/api/file/restaurant/${restaurantDetailStore.restaurantData?.rNo}/${file}`} 
                style={{ width: '100%', height: '100%' }} />
              </div>
            )
          })}
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
              <div className="share" onClick={handleShareClick}>
                <ShareAltOutlined style={{ fontSize: '40px' }} />
                <p>공유하기</p>
              </div>
            </Col>
            <Col span={2}>
              <div className="review" onClick={handleReviewWriteClick}>
                <EditOutlined style={{ fontSize: '40px' }} />
                <p>리뷰쓰기</p>
              </div>
            </Col>
            <Col span={2}>
              {isFavor === false || !localStorage.getItem('member')
              ? (<div className="like" onClick={handleLikeClick}>
                <HeartOutlined style={{ fontSize: '40px' }} />
                <p>가고싶다</p>
              </div>)
              : (<div className="like" onClick={handleUnlikeClick}>
                <HeartFilled style={{ fontSize: '40px'}}/>
                <p>가고싶다</p>
              </div>)}
            </Col>
          </Row>

          <HeartFilled style={{ fontSize: '15px' }} />{restaurantDetailStore.favorCount}
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
                  {restaurantDetailStore.restaurantData?.rStartTime ?? ''} ~ {restaurantDetailStore.restaurantData?.rEndTime}
                </Descriptions.Item>
                <Descriptions.Item label="휴일" span={3}>
                  {restaurantDetailStore.restaurantData?.rRestDay}
                </Descriptions.Item>
                <Descriptions.Item label="메뉴" span={3}>
                  <Descriptions
                    labelStyle={{ width: '50%' }}
                    size="small"
                  >
                    {menuData.map((menu, idx) => (
                      <Descriptions.Item
                        className="menu-item"
                        label={menu.title}
                        span={3}
                        key={idx}
                      >
                        {menu.content}
                      </Descriptions.Item>
                    ))}
                  </Descriptions>
                </Descriptions.Item>
              </Descriptions>
            </Col>
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
          <RestaurantReview 
            rNo={rNo}
          />
        </div>
      </Spin>
      <ReviewAddModal modalStore={reviewAddModalStore} rNo={rNo} restaurantReviewStore={restaurantReviewStore}/>
      <RestaurantShareModal modalStore={restaurantShareModalStore} />
    </div>
  )
};

export default observer(RestaurantDetailPage);