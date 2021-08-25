import React from "react";
import { Breadcrumb, Col, Dropdown, Layout, Menu, Row } from 'antd';
import './MainPage.scss';
import { RouterStore } from "mobx-react-router";
import { Link, Switch } from "react-router-dom";
import RootStore from "../stores/RootStore";
import { inject, observer } from "mobx-react";
import AuthStore from "../stores/AuthStore";
import { RouterStore } from "mobx-react-router";
import axios, { AxiosResponse } from "axios";
import Search from "antd/lib/transfer/search";
import { CaretDownOutlined, SmileTwoTone } from '@ant-design/icons';

import { Col, Divider, Dropdown, Layout, Menu, Row } from 'antd';
import { SERVER_URL } from "../config/config";
import RootStore from "../stores/RootStore";
import AuthStore from "../stores/AuthStore";
import './MainPage.scss';

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

  logout = () => {
    const { authStore } = this.props;
    authStore.setIsLoggedIn(false);
    localStorage.removeItem('memberId');
  }

  render() {
    const { Header, Content, Footer } = Layout;
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
            {
              authStore.isLoggedIn === true
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
        <Content style={{ padding: '0 50px' }}>
          <Breadcrumb style={{ margin: '16px 0' }}>
            <Breadcrumb.Item>Home</Breadcrumb.Item>
            <Breadcrumb.Item>List</Breadcrumb.Item>
            <Breadcrumb.Item>App</Breadcrumb.Item>
          </Breadcrumb>
        <Content>
          <Switch>
            { /** 추 후 메인 content routing 작업 */}
          </Switch>
          <Row justify="center" align="top">
            <Col span={24}>
              <div className="search-image-area">
                <Search placeholder="input search text" />
              </div>
            </Col>
            
          </Row>
        </Content>
        <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
        <Footer style={{ textAlign: 'center' }}>HoneyPoint ©2021 Created by Eunkyung Son</Footer>
      </Layout>
    )
  }
}