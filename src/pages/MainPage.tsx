import React from "react";
import { Breadcrumb, Col, Layout, Row } from 'antd';
import './MainPage.scss';
import { Link } from "react-router-dom";

type Props = {

}

export default class MainPage extends React.Component<Props> {
  
  render() {
    const { Header, Content, Footer } = Layout;
    return (
      <>
        <Layout className="layout">
          <Header>
            <div className="logo">
              <h2>HONEYPOINT</h2>
              </div>
              <Row justify="end">
                <Col span={2} className="menu">col-4</Col>
                <Col span={2} className="menu">col-4</Col>
                <Col span={2} className="menu"><Link to="/login">Login</Link></Col>
                <Col span={2} className="menu"><Link to="/signup">Signup</Link></Col>
              </Row>
            {/* </Menu> */}
          </Header>
          <Content style={{ padding: '0 50px' }}>
            <Breadcrumb style={{ margin: '16px 0' }}>
              <Breadcrumb.Item>Home</Breadcrumb.Item>
              <Breadcrumb.Item>List</Breadcrumb.Item>
              <Breadcrumb.Item>App</Breadcrumb.Item>
            </Breadcrumb>
            <div className="site-layout-content">Content</div>
          </Content>
          <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
        </Layout>
      </>
    )
  }
}