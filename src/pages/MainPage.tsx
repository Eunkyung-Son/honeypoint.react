import React from "react";
import { RouterStore } from "mobx-react-router";
import { Link, Route, Switch } from "react-router-dom";
import { inject, observer } from "mobx-react";
import axios, { AxiosResponse } from "axios";
import { CaretDownOutlined, SmileTwoTone } from '@ant-design/icons';
import { Col, Dropdown, Layout, Menu, Row } from 'antd';
import { SERVER_URL } from "../config/config";
import MyInfoPage from "./mypage/MyInfoPage";
import SearchPage from "./search/SearchPage";
import MainContentPage from "./main/MainContentPage";
import AuthStore from "../stores/AuthStore";
import RootStore from "../stores/RootStore";
import './MainPage.scss';
import ProtectedRoute from "../components/ProtectedRoute";

type Props = {
  routing: RouterStore,
  authStore: AuthStore,
}
@inject((rootStore: RootStore) => ({
  routing: rootStore.routing,
  authStore: rootStore.authStore,
}))
@observer
export default class MainPage extends React.Component<Props> {

  componentDidMount() {
    this.getRestaurantInfo();
  }

  logout = () => {
    const { authStore } = this.props;
    authStore.setIsLoggedIn(false);
    localStorage.removeItem('memberId');
  }

  getRestaurantInfo = async () => {
    const URL = `${SERVER_URL}/api/restaurant/185`;

    await axios
      .get(URL, {
        
      })
      .then((response: AxiosResponse) => {
        console.log(response);
      })
  }

  render() {
    const { Header, Content, Footer } = Layout;

    const { authStore } = this.props;
    const menu = (
      <Menu style={{ cursor: 'pointer' }}>
        <Menu.Item key="0">
          <Link to="/mypage">마이페이지</Link>
        </Menu.Item>
        <Menu.Item key="1">
          <Link to="/" onClick={this.logout}>로그아웃</Link>
        </Menu.Item>
      </Menu>
    );

    return (
      <Layout className="layout">
        <Header>
          <div className="logo">
            <h2><a href="/" className="main-title">HONEYPOINT</a></h2>
          </div>
          <Row justify="end">
            {authStore.isLoggedIn === true
              ? <Dropdown className="profileDropdown"  trigger={['click']} overlay={menu}>
                  <div className="ant-dropdown-link" style={{ cursor: 'pointer' }}>
                    <SmileTwoTone style={{fontSize: "20px"}}/>
                    <span className="ant-dropdown-username">
                      {authStore.member?.mName}({authStore.member?.mId})님, 환영합니다.
                    </span>
                    <CaretDownOutlined style={{fontSize: "20px"}}/>
                  </div>
                </Dropdown>
              : <>
                  <Col span={12}></Col>
                  <Col span={2} className="menu"><Link to="/login" className="menu-a">로그인</Link></Col>
                  <Col span={2} className="menu"><Link to="/signup" className="menu-a">회원가입</Link></Col>
                </>
            }
          </Row>
        </Header>
        <Content>
          {/* { FIXME: routing 수정하기} */}
            <Route path='/' exact component={MainContentPage} />
          <Switch>
            <ProtectedRoute path='/mypage' component={MyInfoPage} />
            <Route path='/search' component={SearchPage} />
          </Switch>          
        </Content>
        <Footer style={{ textAlign: 'center' }}>HoneyPoint ©2021 Created by Eunkyung Son</Footer>
      </Layout>
    )
  }
}