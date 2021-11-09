import React from "react";
import { Link } from "react-router-dom";
import { observer } from "mobx-react";
import { Button, Col, Form, Input, Layout, Modal, Row } from "antd";
import IdFindModal from "./find/IdFindModal";
import PwdFindModal from "./find/PwdFindModal";
import IdFindModalStore from "./find/IdFindModalStore";
import PwdFindModalStore from "./find/PwdFindModalStore";
import { useRootStore } from '../../hooks/StoreContextProvider';
import './LoginPage.scss'
import Member from "../../models/Member";

const LoginPage: React.FC = observer(() => {
  const { authStore, routing } = useRootStore();
  const idFindModalStore = new IdFindModalStore();
  const pwdFindModalStore = new PwdFindModalStore();

  const showIdSearchModal = () => {
    idFindModalStore.setVisible(true);
  }
  
  const showPwdSearchModal = () => {
    pwdFindModalStore.setVisible(true);
  }

  const handleLogin = async ({ mId, mPwd }: Member) => {
    const values = { mId, mPwd };
    try {
      const response = await authStore.onLogin(values);
      if (response.data.error) {
        Modal.error({
          title: '비밀번호가 틀렸습니다.'
        })
        return;
      }
      routing.history.push('/');
    } catch (error) {
      console.log(error);
      Modal.error({
        title: '가입된 아이디가 없습니다.'
      })
    }
  }


  return (
    <Layout className="LoginPage">
      <div className="backgroundBg">
        <Row justify="space-around" align="middle" style={{ height: '100vh' }}>
          <Col flex="true">
            <div className="cover">
              <div className="title">
                HONEYPOINT
              </div>
              <div className="form-cover">
                <Form className="login-form" onFinish={handleLogin}>
                  <Form.Item name="mId" rules={[{ required: true }]}>
                    <Input />
                  </Form.Item>
                  <Form.Item name="mPwd" rules={[{ required: true }]}>
                    <Input type="password" />
                  </Form.Item>
                  <Form.Item>
                    <Button type="primary" htmlType="submit" className="login-form-button">로그인</Button>
                    <Link to="/signup"><Button type="primary" className="login-form-button">회원가입</Button></Link>
                    <p className="search-info" onClick={showIdSearchModal}>아이디찾기</p>
                    <p className="search-info" onClick={showPwdSearchModal}>비밀번호찾기</p>
                  </Form.Item>
                </Form>
                <IdFindModal idFindModalStore={idFindModalStore} />
                <PwdFindModal pwdFindModalStore={pwdFindModalStore} />
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
});

export default LoginPage