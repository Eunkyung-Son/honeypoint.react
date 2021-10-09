import React from "react";
import { observer } from "mobx-react";
import { Button, Card, Col, Row } from "antd";
import { useRootStore } from "../../../hooks/StoreContextProvider";
import './MyInfoPage.scss';
import { Link } from "react-router-dom";


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
            <Link to="/mypage/general/edit">
              <Button type="primary">수정</Button>
            </Link>
            
          </Card>
        </Col>
        <Col span={9}>
        <Card title="비밀번호 변경" bordered={false}>
          <div>
            HONEYPOINT 로그인 시 사용하는 비밀번호를 변경할 수 있습니다.<br />
            주기적인 비밀번호 변경을 통해 개인정보를 안전하게 보호하세요.
          </div>
          <br />
          <Link to="/mypage/password"><p>비밀번호 변경</p></Link>
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