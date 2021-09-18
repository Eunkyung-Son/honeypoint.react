import React from "react";
import { observer } from "mobx-react";
import { Button, Card, Col, Row } from "antd";
import { useRootStore } from "../../hooks/StoreContextProvider";
import './MyInfoPage.scss';


const MyInfoPage: React.FC = observer(() => {
  const { authStore } = useRootStore();
  console.log(authStore.member)

  return (
    <div className="content-area">
      {console.log(authStore.member?.mPhone)}
      <Row gutter={[24, 10]}>
        <Col span={3}></Col>
        <Col span={9}>
          <Card title="기본 정보 변경" bordered={false}>
            <p>{authStore.member?.mName}</p>
            <p>{authStore.member?.mEmail}</p>
            <p>{authStore.member?.mPhone}</p>
            <Button type="primary">수정</Button>
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
})

export default MyInfoPage