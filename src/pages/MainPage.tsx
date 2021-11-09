import React from "react";
import { Link, Route, Switch } from "react-router-dom";
import { observer } from "mobx-react";
import { CaretDownOutlined, SmileTwoTone } from '@ant-design/icons';
import { Col, Dropdown, Layout, Menu, Row, Space } from 'antd';
import { useRootStore } from "../hooks/StoreContextProvider";
import ProtectedRoute from "../components/ProtectedRoute";
import MyInfoPage from "./mypage/general/MyInfoPage";
import MyInfoEditPage from "./mypage/general/edit/MyInfoEditPage";
import RestaurantMyInfoPage from "./mypage/restaurant/RestaurantMyInfoPage";
import MainContentPage from "./content/MainContentPage";
import RestaurantMorePage from "./more/RestaurantMorePage";
import RestaurantDetailPage from "./detail/RestaurantDetailPage";
import PasswordChangePage from "./mypage/password/PasswordChangePage";
import SearchPage from "./search/SearchPage";
import BoardPage from "./board/BoardPage";
import WithdrawalPage from "./mypage/general/withdrawal/WithdrawalPage";
import MyActivityPage from "./mypage/general/activities/MyActivityPage";
import BoardAddPage from "./board/add/BoardAddPage";
import BoardEditPage from "./board/edit/board/BoardEditPage";
import RestaurantFileAddPage from "./mypage/restaurant/file/RestaurantFileAddPage";
import RestaurantInfoEditPage from "./mypage/restaurant/edit/RestaurantInfoEditPage";
import RestaurantMenuEditPage from "./mypage/restaurant/menu/RestaurantMenuEditPage";
import './MainPage.scss';

const { Header, Content, Footer } = Layout;

const MainPage: React.FC = () => {
  const { authStore } = useRootStore();

  const logout = () => {
    authStore.setIsLoggedIn(false);
    localStorage.removeItem('memberId');
    localStorage.removeItem('member');
    authStore.setMember();
    if ((localStorage.getItem('restaurant'))) {
      localStorage.removeItem('restaurant');
    }
  }

  const menu = (
    <Menu style={{ cursor: 'pointer' }}>
      <Menu.Item key="0">
        {authStore.member?.mSortNo === 1 ? <Link to="/mypage/general">마이페이지</Link> : <Link to="/mypage/restaurant">마이페이지</Link>}
      </Menu.Item>
      <Menu.Item key="1">
        <Link to="/" onClick={logout}>로그아웃</Link>
      </Menu.Item>
    </Menu>
  );

  
  return (
    <Layout className="MainPage">
      <Header>
        <Row justify="space-between">
          <Col>
            <div className="logo">
              <Link to="/" className="main-title">HONEYPOINT</Link>
            </div>
          </Col>
          <Col>
            <Space size={50}>
              <Link to="/board" className="menu" style={{ fontSize: "20px" }}>
                community
              </Link>
              {authStore.isLoggedIn === true
                ?
                <Dropdown className="profileDropdown" trigger={['click']} overlay={menu}>
                  <div className="dropdown-link" style={{ cursor: 'pointer' }}>
                    <SmileTwoTone style={{ fontSize: "20px" }} />
                    <span className="dropdown-username">
                      {authStore.member?.mName}({authStore.member?.mId})님, 환영합니다.
                    </span>
                    <CaretDownOutlined style={{ fontSize: "20px" }} />
                  </div>
                </Dropdown>
                : <>
                  <Link to="/login" className="menu">
                    로그인
                  </Link>
                  <Link to="/signup" className="menu">
                    회원가입
                  </Link>
                </>
              }
            </Space>
          </Col>
        </Row>
      </Header>
      <Content>
        <Switch>
          <ProtectedRoute exact path='/mypage/general' component={MyInfoPage} />
          <ProtectedRoute exact path='/mypage/restaurant' component={RestaurantMyInfoPage} />
          <ProtectedRoute exact path="/mypage/password" component={PasswordChangePage} />
          <ProtectedRoute exact path="/mypage/general/edit" component={MyInfoEditPage} />
          <ProtectedRoute exact path="/mypage/withdrawal" component={WithdrawalPage} />
          <ProtectedRoute exact path="/mypage/general/activities" component={MyActivityPage} />
          <ProtectedRoute exact path="/mypage/restaurant/file" component={RestaurantFileAddPage} />
          <ProtectedRoute exact path="/mypage/restaurant/edit" component={RestaurantInfoEditPage} />
          <ProtectedRoute exact path="/mypage/restaurant/menu" component={RestaurantMenuEditPage} />
          <Route exact path='/' component={MainContentPage} />
          <Route exact path="/board/add" component={BoardAddPage} />
          <Route exact path="/board/edit/:bNo" component={BoardEditPage} />
          <Route path='/board' component={BoardPage} />
          <Route exact path='/more/:type' component={RestaurantMorePage} />
          <Route exact path='/detail/:rNo' component={RestaurantDetailPage} />
          <Route exact path='/search/:keyword' component={SearchPage} />
        </Switch>
      </Content>
      <Footer style={{ textAlign: 'center' }}>HoneyPoint ©2021 Created by Eunkyung Son</Footer>
    </Layout>
  )
};

export default observer(MainPage)