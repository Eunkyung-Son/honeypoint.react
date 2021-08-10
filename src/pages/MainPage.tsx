import React from "react";
import { Breadcrumb, Col, Layout, Row } from 'antd';
import './MainPage.scss';
import { Link, Switch } from "react-router-dom";
import RootStore from "../stores/RootStore";
import { inject, observer } from "mobx-react";
import AuthStore from "../stores/AuthStore";
import { RouterStore } from "mobx-react-router";

type Props = {
  routing: RouterStore,
  authStore: AuthStore,
}
@inject((rootStore: RootStore) => ({
  routing: rootStore.routing,
  authStore: rootStore.authStore
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
    return (
      <Layout className="layout">
        <Header>
          <div className="logo">
            <h2><a href="/" className="main-title">HONEYPOINT</a></h2>
          </div>
          <Row justify="end">
            <Col span={2} className="menu">col-4</Col>
            <Col span={2} className="menu">col-4</Col>
            {
              authStore.isLoggedIn === true
                ? <Col span={2} className="menu"><Link to="/" onClick={this.logout}>Logout</Link></Col>
                : <Col span={2} className="menu"><Link to="/login">Login</Link></Col>
            }
            {/* TODO: 로그인했는데 사인업 필요한가? */}
            <Col span={2} className="menu"><Link to="/signup">Signup</Link></Col>
          </Row>
        </Header>
        <Content style={{ padding: '0 50px' }}>
          <Breadcrumb style={{ margin: '16px 0' }}>
            <Breadcrumb.Item>Home</Breadcrumb.Item>
            <Breadcrumb.Item>List</Breadcrumb.Item>
            <Breadcrumb.Item>App</Breadcrumb.Item>
          </Breadcrumb>
          <Switch>
            { /** 추 후 메인 content routing 작업 */}
          </Switch>
        </Content>
        <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
      </Layout>
    )
  }
}