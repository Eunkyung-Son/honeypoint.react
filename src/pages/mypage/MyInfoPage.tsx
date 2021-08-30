import React from "react";
import { Card, Col, Row } from "antd";
import './MyInfoPage.scss';

type Props = {

}

export default class MyInfoPage extends React.Component<Props> {
  render() {
    return (
      <div className="content-area">
        <Row gutter={[24, 10]}>
          <Col span={3}></Col>
          <Col span={9}>
            <Card title="기본 정보 변경" bordered={false}>
              <p>Card content</p>
              <p>Card content</p>
              <p>Card content</p>
            </Card>
          </Col>
          <Col span={9}>
          <Card title="비밀번호 변경" bordered={false}>
            <p>Card content</p>
            <p>Card content</p>
            <p>Card content</p>
          </Card>
          </Col>
          <Col span={3}></Col>
          <Col span={3}></Col>
          <Col span={9}>
          <Card title="내 활동 내역" bordered={false}>
            <p>Card content</p>
            <p>Card content</p>
            <p>Card content</p>
          </Card>
          </Col>

          <Col span={9}>
          <Card title="회원 탈퇴" bordered={false}>
            <p>Card content</p>
            <p>Card content</p>
            <p>Card content</p>
          </Card>
          </Col>
          <Col span={3}></Col>
        </Row>
      </div>
    )
  }
}