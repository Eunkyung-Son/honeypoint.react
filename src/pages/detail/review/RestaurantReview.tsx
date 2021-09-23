import React, { useState, useEffect } from "react";
import { observer } from "mobx-react";
import { Avatar, Button, Col, List, Row, Space } from "antd";
import { FrownOutlined, MehOutlined, SmileOutlined } from '@ant-design/icons';
import axios, { AxiosResponse } from "axios";
import { SERVER_URL } from "../../../config/config";
import Review from "../../../models/Review";
import RestaurantDetailStore from "../RestaurantDetailStore";
import RestaurantReviewStore from "./RestaurantReviewStore";
import './RestaurantReview.scss';

type Props = {
  restaurantDetailStore: RestaurantDetailStore,
  rNo: string
}

const RestaurantReview: React.FC<Props> = observer(({restaurantDetailStore, rNo}: Props) => {
  const [restaurantReviewStore] = useState(() => new RestaurantReviewStore());

  const handleReviewFilter = async (score: number) => {
    const URL = `${SERVER_URL}/api/reviews/${rNo}`;
    const params = {
      filterType: score,
    }

    await axios
      .get(URL, {
        headers: {
          'Content-Type': 'application/json'
        },
        params: {
          ...params
        }
      }).then((response: AxiosResponse) => {
        const { setReviewAllCount, setReviewList, setReviewGoodCount, setReviewSosoCount, setReviewBadCount } = restaurantReviewStore; 

        if (score === 0) {
          setReviewList(response.data.reviews);
          setReviewAllCount(response.data.total);
        }
        if (score === 1) {
          setReviewList(response.data.reviews);
          setReviewGoodCount(response.data.total);
        }
        if (score === 2) {
          setReviewList(response.data.reviews);
          setReviewSosoCount(response.data.total);
        }
        if (score === 3) {
          setReviewList(response.data.reviews);
          setReviewBadCount(response.data.total);
        }
      })
  }

  const handleReviewDelete = async (reviewId: number) => {
    const URL =`${SERVER_URL}/api/review/${reviewId}`
    await axios
      .delete(URL).then((response: AxiosResponse) => {
        console.log(response);
      })
    await handleReviewFilter(1);
    await handleReviewFilter(2);
    await handleReviewFilter(3);
    await handleReviewFilter(0);
  }

  useEffect(() => {
    async function initialize() {
      await handleReviewFilter(1);
      await handleReviewFilter(2);
      await handleReviewFilter(3);
      await handleReviewFilter(0);
    }
    initialize();
  }, [])

  return (
    <>
      <Row>
        <Col span={16}>
          <span className="restname">
            리뷰
          </span>
        </Col>
        <Col span={2}><div className="review-filter" onClick={() => handleReviewFilter(0)}>{`전체(${restaurantReviewStore.reviewAllCount})`}</div></Col>
        <Col span={2}><div className="review-filter" onClick={() => handleReviewFilter(1)}>{`맛있다(${restaurantReviewStore.reviewGoodCount})`}</div></Col>
        <Col span={2}><div className="review-filter" onClick={() => handleReviewFilter(2)}>{`보통(${restaurantReviewStore.reviewSosoCount})`}</div></Col>
        <Col span={2}><div className="review-filter" onClick={() => handleReviewFilter(3)}>{`별로(${restaurantReviewStore.reviewBadCount})`}</div></Col>
      </Row>
      <List<Review>
        className="demo-loadmore-list"
        itemLayout="horizontal"
        dataSource={restaurantReviewStore.reviewList}
        renderItem={item => (
          <List.Item
            className="review-list"
            style={{
              cursor: 'pointer'
            }}
          >
            <List.Item.Meta
              avatar={
                <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
              }
              title={(
                <Space>
                  {`${item.gnrlMember.mnickname} | ${item.revDate}`}
                  {JSON.parse(localStorage.getItem('member')!).mNo === item.mNo && (
                    <>
                      <Button>수정</Button>
                      <Button onClick={() => handleReviewDelete(item.revNo)}>삭제</Button>
                    </>
                  )}
                </Space>
              )}
              description={item.revCn}
              key={item.revNo}
            />
            <div>
              {item.score === 1
                ? (<div style={{ color: '#ff7100', textAlign: "center" }}>
                  <SmileOutlined style={{ fontSize: '40px' }} />
                  <p>맛있다</p>
                </div>)
                : (item.score === 2 ?
                  <div style={{ color: '#ff7100', textAlign: "center" }}>
                    <MehOutlined style={{ fontSize: '40px' }} />
                    <p>보통</p>
                  </div>
                  : <div style={{ color: '#ff7100', textAlign: "center" }}>
                    <FrownOutlined style={{ fontSize: '40px' }} />
                    <p>별로</p>
                  </div>
                )
              }
            </div>
          </List.Item>
        )}
      />
    </>
  )
});

export default RestaurantReview;