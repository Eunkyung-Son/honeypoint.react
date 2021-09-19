import React from "react";
import { observer } from "mobx-react";
import { Avatar, Button, Col, List, Row, Space } from "antd";
import { FrownOutlined, MehOutlined, SmileOutlined } from '@ant-design/icons';
import Review from "../../../models/Review";
import RestaurantDetailStore from "../RestaurantDetailStore";

type Props = {
  restaurantDetailStore: RestaurantDetailStore
}

const RestaurantReview: React.FC<Props> = ({restaurantDetailStore}: Props) => {
  return (
    <>
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
      <List<Review>
        className="demo-loadmore-list"
        itemLayout="horizontal"
        dataSource={restaurantDetailStore.reviewList}
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
                      <Button >수정</Button>
                      <Button>삭제</Button>
                    </>
                  )}
                </Space>
              )}
              description={item.revCn}
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
}

export default observer(RestaurantReview);