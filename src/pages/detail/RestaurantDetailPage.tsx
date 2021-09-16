import axios, { AxiosResponse } from "axios";
import { observer } from "mobx-react";
import { useEffect, useState } from "react";
import { RouteComponentProps, useParams } from "react-router-dom";
import { HeartOutlined, EditOutlined, ShareAltOutlined, HeartFilled, EditFilled } from '@ant-design/icons';
import { Avatar, Col, List, Row, Skeleton, Spin } from "antd";
import { SERVER_URL } from "../../config/config";
import food from '../../images/food1.jpg';
import Menu from "../../models/Menu";
import CustomCarousel from "../../components/CustomCarousel";
import RestaurantDetailStore from "./RestaurantDetailStore";
import './RestaurantDetailPage.scss';
import Review from "../../models/Review";

declare global {
  interface Window {
    kakao: any;
  }
}

type RouteProps = {
  rNo: string
}

interface Props extends RouteComponentProps<RouteProps> {

}

const RestaurantDetailPage: React.FC<Props> = observer((props: Props) => {
  const [restaurantDetailStore] = useState(() => new RestaurantDetailStore());
  const [loading, setLoading] = useState(false);
  const [restAddress, setRestAddress] = useState('');
  const { rNo } = useParams<RouteProps>();

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

    const address = restaurantDetailStore.restaurantData?.rAddress.substr(6);

    console.log(address);

    if(!address) return;
    setRestAddress(address);

    
    geocoder.addressSearch(address, (result: any, status: any) => {
      console.log(address);
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

  const menuData: any[] | undefined = [];

  restaurantDetailStore.menuList?.map((data: Menu) => (
    menuData.push({
      title: data.menuName,
      content: data.menuPrice
    })
  ))

  const data = [
    {
      title: '주소',
      content: `${restaurantDetailStore.restaurantData?.rAddress ?? ''}`
    },
    {
      title: '전화번호',
      content: `${restaurantDetailStore.restaurantData?.rTel ?? ''}`
    },
    {
      title: '가격대',
      content: `${restaurantDetailStore.restaurantData?.rPrice.toLocaleString() ?? ''} 원대`
    },
    {
      title: '영업시간',
      content: `${restaurantDetailStore.restaurantData?.rStartTime ?? ''} ~ ${restaurantDetailStore.restaurantData?.rEndTime ?? ''}`
    },
    {
      title: '휴일',
      content: `${restaurantDetailStore.restaurantData?.rRestDay ?? ''}`
    },
    { title: '메뉴',
      content: <List
        className="demo-loadmore-list"
        itemLayout="horizontal"
        dataSource={menuData}
        renderItem={(item: any) => (
          <List.Item>
            <List.Item.Meta
              title={item.title}
            />
            <div>{item.content}</div>
          </List.Item>
        )}
      />
    }
  ]

  const reviewData: any[] | undefined = [];

  restaurantDetailStore.reviewList?.map((data: Review) => (
    reviewData.push({
      mNo: data.mNo,
      revDate: data.revDate,
      revCn: data.revCn,
      score: data.score
    })
  ))




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
        <div style={{margin: "100px"}}>
          <Row>
            <Col span={10}>
              <span className="restname-span">
                {restaurantDetailStore.restaurantData?.rName ?? ''}
              </span>&nbsp;
              <span className="restrating-span">
                {restaurantDetailStore.restaurantData?.rRating ?? 0}★
              </span>
            </Col>
            <Col span={8}></Col>
            <Col span={2}><ShareAltOutlined /><p>공유하기</p></Col>
            <Col span={2}><EditOutlined /><p>리뷰쓰기</p></Col>
            <Col span={2}><HeartOutlined /><p>가고싶다</p></Col>
          </Row>
          
          <HeartFilled />{restaurantDetailStore.favorCount}
          <EditFilled />{restaurantDetailStore.reviewCount}
          <hr className="detail-hr" />
          <List
            className="demo-loadmore-list"
            itemLayout="horizontal"
            dataSource={data}
            renderItem={(item: any) => (
              <List.Item>
                <List.Item.Meta
                  title={item.title}
                />
                <div style={{marginRight: "900px", textAlign: "right"}}>{item.content}</div>
              </List.Item>
            )}
          />
          <hr className="detail-hr" />
          <div style={{marginBottom: "20px"}} />
          <div>
            <span className="restname-span">
              지도
            </span>
            <div style={{marginBottom: "10px"}} />
            <div id="map" style={{ width: "100%", height: "400px"}} />
          </div>
          <div style={{marginBottom: "10px"}} />
          <hr className="detail-hr" />
          <div style={{marginBottom: "20px"}} />
          <Row>
            <Col span={16}>
              <span className="restname-span">
                리뷰
              </span>
            </Col>
            <Col span={2}>{`전체${''}`}</Col>
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
                    title={<a href="https://ant.design">{`${item.mNo} | ${item.revDate}`}</a>}
                    description={item.revCn}
                  />
                  <div>{item.score}</div>
              </List.Item>
            )}
          />
        </div>
      </Spin>
    </>
  )
})

export default RestaurantDetailPage;