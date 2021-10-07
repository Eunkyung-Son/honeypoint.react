import React from "react";
import { Link, Route, Switch } from "react-router-dom";
import { observer } from "mobx-react";
import { CaretDownOutlined, SmileTwoTone } from '@ant-design/icons';
import { Col, Dropdown, Layout, Menu, Row } from 'antd';
import MyInfoPage from "./mypage/general/MyInfoPage";
import RestaurantMyInfoPage from "./mypage/restaurant/RestaurantMyInfoPage";
import ProtectedRoute from "../components/ProtectedRoute";
import { useRootStore } from "../hooks/StoreContextProvider";
import MainContentPage from "./content/MainContentPage";
import RestaurantMorePage from "./more/RestaurantMorePage";
import RestaurantDetailPage from "./detail/RestaurantDetailPage";
import PasswordChangePage from "./mypage/password/PasswordChangePage";
import SearchPage from "./search/SearchPage";
import BoardPage from "./board/BoardPage";
import BoardDetailPage from "./board/detail/BoardDetailPage";
import './MainPage.scss';

type Props = {

}

const MainPage: React.FC<Props> = observer((props: Props) => {
  const { authStore } = useRootStore();
  
  const logout = () => {
    authStore.setIsLoggedIn(false);
    localStorage.removeItem('memberId');
    localStorage.removeItem('member');
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
        <div className="logo">
          <h2><a href="/" className="main-title">HONEYPOINT</a></h2>
        </div>
        <Row justify="end">
          <Col span={3}>
            <Link to="/board" className="menu-a" style={{fontSize: "20px"}}>
              community
            </Link>
          </Col>
          {authStore.isLoggedIn === true
            ?
            <Col>  
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
                <Col span={2} offset={12} className="menu">
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
          <Route exact path='/' component={MainContentPage} />
          <Route exact path='/board' component={BoardPage} />
          <Route exact path='/board/:bNo' component={BoardDetailPage} />
          <Route exact path='/more/:type' component={RestaurantMorePage} />
          <Route exact path='/detail/:rNo' component={RestaurantDetailPage} />
          <Route exact path='/search/:keyword' component={SearchPage} />
        </Switch>
      </Content>
      <Footer style={{ textAlign: 'center' }}>HoneyPoint ©2021 Created by Eunkyung Son</Footer>
    </Layout>
  )
});

export default MainPage