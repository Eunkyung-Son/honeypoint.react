import React from "react";
import { observer } from "mobx-react";
import axios, { AxiosResponse } from "axios";
import { Button, Form, Input, Modal } from "antd";
import { SERVER_URL } from "../../../config/config";
import PwdFindModalStore from "./PwdFindModalStore";

type Props = {
  pwdFindModalStore: PwdFindModalStore
}

const PwdFindModal: React.FC<Props> = ({pwdFindModalStore}: Props) => {

  const handleOk = () => {
    pwdFindModalStore.setVisible(false);
  }

  const handleCancel = () => {
    pwdFindModalStore.setVisible(false);
  }

  const onFinish = async (values: {
    id: string,
    email: string
  }) => {
    const { id, email } = values;
    const URL = `${SERVER_URL}/api/findPwd`;
    const params = {
      id: id,
      email: email
    };
    await axios
      .post(URL, {}, {
        params: {
          ...params
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      })
      .then((response: AxiosResponse) => {
        alert("등록하신 이메일로 임시 비밀번호가 발송되었습니다.");
      })
  }

  return (
    <Modal
      title="비밀번호 찾기"
      visible={pwdFindModalStore.visible}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <Form
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
      >
        <Form.Item
          label="아이디"
          name="id"
          rules={[{ required: true, message: '등록하신 아이디를 입력해주세요.' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="이메일"
          name="email"
          rules={[{ required: true, message: '등록하신 이메일을 입력해주세요.' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit">
            비밀번호찾기
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default observer(PwdFindModal)