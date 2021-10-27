import React from "react";
import { Link, Route, Switch } from "react-router-dom";
import { observer } from "mobx-react";
import { CaretDownOutlined, SmileTwoTone } from '@ant-design/icons';
import { Col, Dropdown, Layout, Menu, Row } from 'antd';
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
import BoardAddPage from "./board/add/BoardAddPage";
import BoardEditPage from "./board/edit/board/BoardEditPage";
import './MainPage.scss';

const MainPage: React.FC = () => {
  const { authStore } = useRootStore();
  
  const logout = () => {
    authStore.setIsLoggedIn(false);
    localStorage.removeItem('memberId');
    localStorage.removeItem('member');
    authStore.setMember();
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
  
  const { Header, Content, Footer } = Layout;
  return (
    <Layout className="layout">
      
      <Header>
        <Row justify="start">
          <Col span={16}>
            <div className="logo">
              <h2><a href="/" className="main-title">HONEYPOINT</a></h2>
            </div>
          </Col>
          <Col span={1}>
            <Link to="/board" className="menu-a" style={{fontSize: "20px"}}>
              community
            </Link>
          </Col>
          {authStore.isLoggedIn === true
            ?
            <Col span={7}>  
              <Dropdown className="profileDropdown"  trigger={['click']} overlay={menu}>
                <div className="ant-dropdown-link" style={{ cursor: 'pointer' }}>
                  <SmileTwoTone style={{fontSize: "20px"}}/>
                  <span className="ant-dropdown-username">
                    {authStore.member?.mName}({authStore.member?.mId})님, 환영합니다.
                  </span>
                  <CaretDownOutlined style={{fontSize: "20px"}}/>
                </div>
              </Dropdown>
            </Col>
            : <>
                <Col span={2} offset={3} className="menu">
                  <Link to="/login" className="menu-a">
                    로그인
                  </Link>
                </Col>
                <Col span={2} className="menu">
                  <Link to="/signup" className="menu-a">
                    회원가입
                  </Link>
                </Col>
              </>
          }
        </Row>
      </Header>
      <Content>
        <Switch>
          <ProtectedRoute exact path='/mypage/general' component={MyInfoPage} />
          <ProtectedRoute exact path='/mypage/restaurant' component={RestaurantMyInfoPage} />
          <ProtectedRoute exact path="/mypage/password" component={PasswordChangePage} />
          <ProtectedRoute exact path="/mypage/general/edit" component={MyInfoEditPage} />
          <ProtectedRoute exact path="/mypage/general/withdrawal" component={WithdrawalPage} />
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