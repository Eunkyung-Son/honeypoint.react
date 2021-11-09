import { Card, Form, Input, message, Popconfirm } from "antd";
import axios, { AxiosResponse } from "axios";
import { observer } from "mobx-react";
import React, { useState } from "react";
import { SERVER_URL } from "../../../../config/config";
import { useRootStore } from "../../../../hooks/StoreContextProvider";

const formItemLayout = {
  labelCol: {
    xs: { span: 16 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
};

const WithdrawalPage: React.FC = () => {
  const { authStore, routing } = useRootStore();
  const [mPwd, setmPwd] = useState('');

  const onLogin = async () => {
    const params = {
      mId: authStore.member?.mId,
      mPwd: mPwd
    }
    const URL = `${SERVER_URL}/api/login`;
    await axios
      .post(URL,
        {
          ...params
        },
        {
          headers: {
            'Content-Type': 'application/json'
          },
        }
      )
      .then((response: AxiosResponse) => {
        if (!response.data.member) {
          alert('비밀번호가 틀렸습니다');
          return;
        }
        deleteMember();
      })
  }

  const deleteMember = async () => {
    const URL = `${SERVER_URL}/api/member/delete/${authStore.member?.mId}`;
    await axios
      .post(URL, {},
        {
          headers: {
            'Content-Type': 'application/json'
          },
        }
      )
      .then((response: AxiosResponse) => {
        if(!response.data.error) {
          authStore.setIsLoggedIn(false);
          localStorage.removeItem('memberId');
          localStorage.removeItem('member');
          authStore.setMember();
          if ((localStorage.getItem('restaurant'))) {
            localStorage.removeItem('restaurant');
          }
          routing.push("/login")
        }
      })
  }

  const onPasswordChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    setmPwd(e.target.value);
  }

  const cancel = () => {
    message.error('취소하셨습니다.');
  }

  return (
    <Card style={{ width: '50%', marginRight: '25%', marginLeft: '25%', marginTop: "3%"}}>
    <h2>회원 탈퇴</h2>
    <p style={{color: "gray"}}>회원탈퇴를 하시려면 비밀번호를 입력해주세요.</p>
      <Form
        {...formItemLayout}
        name="register"
        scrollToFirstError
      >
        <Form.Item
          name="mPwd"
          label="비밀번호"
          rules={[
            {
              required: true,
              message: '비밀번호를 입력해주세요.',
            },
          ]}
          hasFeedback
        >
          <Input.Password onChange={onPasswordChange}/>
        </Form.Item>
        <Form.Item {...tailFormItemLayout}>
          {/* <Button type="primary" htmlType="submit">
            확인
          </Button> */}
            <Popconfirm
              title="정말 탈퇴하시겠습니까?"
              onConfirm={onLogin}
              onCancel={cancel}
              okText="Yes"
              cancelText="No"
            >
              <a href="#">회원탈퇴</a>
            </Popconfirm>
        </Form.Item>
      </Form>
    </Card>
  )
}

export default observer(WithdrawalPage);