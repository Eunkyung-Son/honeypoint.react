import React from "react";
import { observer } from "mobx-react";
import { Card, Col, Row } from "antd";
import { Link } from "react-router-dom";
import { useRootStore } from "../../../hooks/StoreContextProvider";
import './MyInfoPage.scss';


const MyInfoPage: React.FC = () => {
  const { authStore } = useRootStore();

  return (
    <div className="MyInfoPage">
      <Row gutter={[24, 10]}>
        <Col span={3}></Col>
        <Col span={9}>
          <Card 
            className="card-row" 
            title="기본 정보 변경" 
            bordered={true}
          >
            <p>이름 : {authStore.member?.mName}</p>
            <p>이메일 : {authStore.member?.mEmail}</p>
            <p>핸드폰번호: {authStore.member?.mPhone}</p>
            <Link to="/mypage/general/edit">
              <p className="card-text">수정하기</p>
            </Link>
          </Card>
        </Col>
        <Col span={9}>
        <Card
          className="card-row" 
          title="비밀번호 변경" 
          bordered={true}
        >
          <div>
            HONEYPOINT 로그인 시 사용하는 비밀번호를 변경할 수 있습니다.<br />
            주기적인 비밀번호 변경을 통해 개인정보를 안전하게 보호하세요.
          </div>
          <br />
          <Link to="/mypage/password">
            <p className="card-text">비밀번호 변경</p>
          </Link>
        </Card>
        </Col>
        <Col span={3}></Col>
        <Col span={3}></Col>
        <Col span={9}>
        <Card 
          className="card-row" 
          title="내 활동 내역" 
          bordered={true}
        >
          <p>HONEYPOINT 내에서 중요한 활동 기록을 확인할 수 있습니다.</p>
          <Link to="/mypage/general/activities">
            <p className="card-text">확인하기</p>
          </Link>
        </Card>
        </Col>

        <Col span={9}>
        <Card 
          className="card-row" 
          title="회원 탈퇴" 
          bordered={true}
        >
          <p>HONEYPOINT 회원을 탈퇴합니다.</p>
          <Link to="/mypage/withdrawal">
            <p className="card-text">탈퇴하기</p>
          </Link>
        </Card>
        </Col>
        <Col span={3}></Col>
      </Row>
    </div>
  )
}

export default observer(MyInfoPage)