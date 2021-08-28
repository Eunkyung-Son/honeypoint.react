import React from "react";
import { RouterStore } from "mobx-react-router";
import { Link, Switch } from "react-router-dom";
import { inject, observer } from "mobx-react";
import axios, { AxiosResponse } from "axios";
import { CaretDownOutlined, SmileTwoTone } from '@ant-design/icons';
import { Col, Dropdown, Layout, Menu, Row, Input, Divider } from 'antd';
import { SERVER_URL } from "../config/config";
import RootStore from "../stores/RootStore";
import AuthStore from "../stores/AuthStore";
import './MainPage.scss';
import CustomArrows from "../components/Carousel";

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
    const { Search } = Input;

    const { authStore } = this.props;
    const menu = (
      <Menu style={{ cursor: 'pointer' }}>
        <Menu.Item key="0">
          <Link to="/">마이페이지</Link>
        </Menu.Item>
        <Menu.Item key="1">
          <div><Link to="/" onClick={this.logout}>로그아웃</Link></div>
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
                  <Col span={2} className="menu"><Link to="/login">로그인</Link></Col>
                  <Col span={2} className="menu"><Link to="/signup">회원가입</Link></Col>
                </>
            }
          </Row>
        </Header>
        <Content>
          <Switch>
            { /** 추 후 메인 content routing 작업 */}
          </Switch>
          <Row justify="center" align="top">
            <Col span={24}>
              <div className="search-image-area">
                <div>
                  <Search placeholder="검색해서 맛집을 찾아보세요!" size="large" enterButton style={{ display: 'inline-flex', justifyContent: 'center', alignItems: 'center'}}/>
                </div>
              </div>
            </Col>
          </Row>
          <Divider orientation="left">#요즘 뜨는 카페</Divider>
          <CustomArrows/>
        </Content>
        <Footer style={{ textAlign: 'center' }}>HoneyPoint ©2021 Created by Eunkyung Son</Footer>
      </Layout>
    )
  }
}