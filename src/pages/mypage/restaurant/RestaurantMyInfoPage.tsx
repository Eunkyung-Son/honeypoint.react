import { observer } from "mobx-react";
import { Card, Col, Row } from "antd";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useRootStore } from "../../../hooks/StoreContextProvider";
import './RestaurantMyInfoPage.scss';

const RestaurantMyInfoPage: React.FC = () => {

  const { authStore } = useRootStore();

  useEffect(() => {
    authStore.fetchRestaurantInfo();
  })

  return (
    <div className="content-area">
      <Row gutter={[24, 10]}>
        <Col span={3}></Col>
        <Col span={9}>
          <Card title="레스토랑 사진 등록" bordered={true}>
            <div>
              서비스 사용자에게 보여줄 레스토랑 사진을 등록하거나 수정할 수 있습니다.
            </div>
            <br />
            <Link to="/mypage/restaurant/file">
              <p>등록하기</p>
            </Link>
          </Card>
        </Col>
        <Col span={9}>
        <Card title="비밀번호 변경" bordered={true}>
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
        <Card title="레스토랑 정보 수정" bordered={true}>
          <p>나의 레스토랑 정보를 수정할 수 있습니다.</p>
          <Link to="/mypage/restaurant/edit"><p>수정하기</p></Link>
        </Card>
        </Col>
        <Col span={9}>
        <Card title="회원 탈퇴" bordered={true}>
          <p>HONEYPOINT 회원을 탈퇴합니다.</p>
          <Link to="/mypage/withdrawal"><p>탈퇴하기</p></Link>
        </Card>
        </Col>
        <Col span={3}></Col>
        <Col span={3}></Col>
        <Col span={9}>
        <Card title="레스토랑 메뉴 등록 및 수정" bordered={true}>
          <p>나의 레스토랑 메뉴를 등록하거나 수정할 수 있습니다.</p>
          <Link to="/mypage/restaurant/menu"><p>수정하기</p></Link>
        </Card>
        </Col>
      </Row>
    </div>
  )
}

export default observer(RestaurantMyInfoPage)