import React, { useState, useEffect } from "react";
import { observer } from "mobx-react";
import { Avatar, Button, Col, List, message, Row, Space, Spin } from "antd";
import { FrownOutlined, MehOutlined, SmileOutlined } from '@ant-design/icons';
import InfiniteScroll from 'react-infinite-scroller';
import Review from "../../../models/Review";
import ReviewEditModal from '../modal/ReviewEditModal';
import ReviewEditModalStore from '../modal/ReviewEditModalStore';
import RestaurantReviewStore from "./RestaurantReviewStore";
import './RestaurantReview.scss';

type Props = {
  rNo: string
}

const RestaurantReview: React.FC<Props> = ({rNo}: Props) => {
  const reviewEditModalStore = new ReviewEditModalStore();
  const [restaurantReviewStore] = useState(() => new RestaurantReviewStore());
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchReview();
  }, [])

  const fetchReview = async (score?: number) => {
    try {
      await restaurantReviewStore.fetchReviews(rNo, score);
    } catch (error) {
      alert(error);
    }
  }

  const handleReviewDelete = async (reviewId: number) => {
    const { deleteReview } = restaurantReviewStore;
    await deleteReview(reviewId);
    await restaurantReviewStore.fetchReviews(rNo);
  }

  const handleReviewEdit = async (review: Review) => {
    console.log(review);
    reviewEditModalStore.setReviewData(review);
    reviewEditModalStore.setVisible(true);
  }

  const handleInfiniteOnload = () => {
    const { setReviewList } = restaurantReviewStore;
    let { reviewList } = restaurantReviewStore;
    setLoading(true);
    if (reviewList.length > 14) {
      message.warning('Infinite List loaded all.')
      setLoading(false);
      setHasMore(false);
      return;
    }
    reviewList = reviewList.concat();
    setReviewList(reviewList);
    setLoading(false);
  }

  return (
    <>
      <Row>
        <Col span={16}>
          <span className="restname">
            리뷰
          </span>
        </Col>
        <Col span={2}><div className="review-filter" onClick={() => fetchReview(0)}>{`전체(${restaurantReviewStore.reviewAllCount})`}</div></Col>
        <Col span={2}><div className="review-filter" onClick={() => fetchReview(1)}>{`맛있다(${restaurantReviewStore.reviewGoodCount})`}</div></Col>
        <Col span={2}><div className="review-filter" onClick={() => fetchReview(2)}>{`보통(${restaurantReviewStore.reviewSosoCount})`}</div></Col>
        <Col span={2}><div className="review-filter" onClick={() => fetchReview(3)}>{`별로(${restaurantReviewStore.reviewBadCount})`}</div></Col>
      </Row>
      <div className="demo-infinite-container">
        <InfiniteScroll
          initialLoad={false}
          pageStart={0}
          loadMore={handleInfiniteOnload}
          hasMore={!loading && hasMore}
          useWindow={false}
        >
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
                          <Button onClick={() => handleReviewEdit(item)}>수정</Button>
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
          >
            {loading && hasMore && (
              <div className="demo-loading-container">
                <Spin />
              </div>
            )}
          </List>
        </InfiniteScroll>
      </div>
      <ReviewEditModal 
        modalStore={reviewEditModalStore}
        restaurantReviewStore={restaurantReviewStore}
        rNo={rNo} 
      />
    </>
  )
};

export default observer(RestaurantReview);