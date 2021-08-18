import React from "react";
import axios, { AxiosResponse } from "axios";
import { Link } from "react-router-dom";
import { Button, Col, Form, Input, Layout, Row } from "antd";
import { SERVER_URL } from "../../config/config";
import { inject, observer } from "mobx-react";
import { RouterStore } from "mobx-react-router";
import './LoginPage.scss'
import Member from "../../models/Member";
import RootStore from "../../stores/RootStore";
import AuthStore from "../../stores/AuthStore";
import IdFindModal from "./find/IdFindModal";
import PwdFindModalStore from "./find/PwdFindModalStore";
import { IdFindModalStore } from "./find/IdFindModalStore";
import PwdFindModal from "./find/PwdFindModal";
import LoginStore from "../../stores/LoginStore";

type Props = {
  routing: RouterStore,
  authStore: AuthStore,
  loginStore: LoginStore,
}
@inject((rootStore: RootStore) => ({
  routing: rootStore.routing,
  authStore: rootStore.authStore,
  loginStore: rootStore.loginStore,
}))
@observer
export default class LoginPage extends React.Component<Props> {
  idFindModalStore: IdFindModalStore = new IdFindModalStore();
  pwdFindModalStore: PwdFindModalStore = new PwdFindModalStore();

  HEADERS = {
    'Content-Type': 'application/json'
  };

  onLogin = async (values: {
    mId: string,
    mPwd: string,
  }) => {
    const { mId, mPwd } = values;
    const URL = `${SERVER_URL}/login`;
    const memberInfo = await axios
      .post(URL,
        {
          mId,
          mPwd
        },
        {
          headers: this.HEADERS,
        }
      )
      .then((response: AxiosResponse) => {
        // TODO:아이디나 비밀번호가 틀릴 때 처리하기
        return response.data as Member;
      })
      .catch((error) => {
      });
      
    if (memberInfo) {
      const { routing, authStore, loginStore } = this.props;
      localStorage.setItem('memberId', memberInfo.mId);
      authStore.setIsLoggedIn(true);
      loginStore.setMember(memberInfo);
      routing.history.push('/');
    }
  };

  showIdSearchModal = () => {
    this.idFindModalStore.setVisible(true);
  }

  showPwdSearchModal = () => {
    this.pwdFindModalStore.setVisible(true);
  }

  render() {
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
                      <p className="search-info" onClick={this.showIdSearchModal}>아이디찾기</p>
                      <p className="search-info" onClick={this.showPwdSearchModal}>비밀번호찾기</p>
                    </Form.Item>
                  </Form>
                  {/* TODO: REACT PORTAL 알아보기 */}
                  <IdFindModal idFindModalStore={this.idFindModalStore} />
                  <PwdFindModal pwdFindModalStore={this.pwdFindModalStore} />
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
