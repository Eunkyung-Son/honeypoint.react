import { Card, Space } from "antd";
import React from "react";

type Props = {

}

export default class MyInfoPage extends React.Component<Props> {
  render() {
    return (
      <div className="content-area">
        <Space>
          <div className="site-card-border-less-wrapper">
            <Card title="기본 정보 변경" bordered={false} style={{ width: 500 }}>
              <p>Card content</p>
              <p>Card content</p>
              <p>Card content</p>
            </Card>
          </div>
          <div className="site-card-border-less-wrapper">
            <Card title="비밀번호 변경" bordered={false} style={{ width: 500 }}>
              <p>Card content</p>
              <p>Card content</p>
              <p>Card content</p>
            </Card>
          </div>
        </Space>
        <div></div>
        <Space>
          <div className="site-card-border-less-wrapper">
            <Card title="내 활동 내역" bordered={false} style={{ width: 500 }}>
              <p>Card content</p>
              <p>Card content</p>
              <p>Card content</p>
            </Card>
          </div>
          <div className="site-card-border-less-wrapper">
            <Card title="회원 탈퇴" bordered={false} style={{ width: 500 }}>
              <p>Card content</p>
              <p>Card content</p>
              <p>Card content</p>
            </Card>
          </div>
        </Space>
      </div>
    )
  }
}