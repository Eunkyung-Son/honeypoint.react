import React from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Button, Col, Form, Input, Layout, Row, Spin } from "antd";
import { SERVER_URL } from "../../config/config";
import './LoginPage.scss'

type Props = {

}

export default class LoginPage extends React.Component<Props> {
  HEADERS = {
    'Content-Type': 'application/json'
  };

  onLogin = async (values: {
    mId: string,
    mPwd: string,
  }) => {
    console.log(values);
    const { mId, mPwd } = values;
    const URL = `${SERVER_URL}/login`;
    return await axios
      .post(URL, {
        mId,
        mPwd
      },
        {
          headers: this.HEADERS,
        })
      .then()
  };

  render() {
    const spinner = <Spin />;

    return (
      <Layout className="LoginPage" style={{ minHeight: '100vh' }}>
        <div className="backgroundBg">
          <Row justify="space-around" align="middle" style={{ height: '100vh' }}>
            <Col flex="true">
              <div className="cover">
                <div className="title">
                  HoneyPoint
                </div>
                <div className="form-cover">
                  <Form className="login-form" onFinish={this.onLogin}>
                    <Form.Item name="mId" rules={[{ required: true }]}>
                      <Input />
                    </Form.Item>
                    <Form.Item name="mPwd" rules={[{ required: true }]}>
                      <Input type="password" />
                    </Form.Item>
                    <Form.Item>
                      <Button type="primary" htmlType="submit" className="login-form-button">로그인</Button>
                      <Link to="/signup"><Button type="primary" className="login-form-button">회원가입</Button></Link>
                    </Form.Item>
                  </Form>
                </div>
                <footer>
                  <p>copyright &copy; HoneyPoint 2021 </p>
                </footer>
              </div>
            </Col>
          </Row>
        </div>
      </Layout>
    )
  }
}
