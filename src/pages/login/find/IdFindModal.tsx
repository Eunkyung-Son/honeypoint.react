import React from "react";
import { observer } from "mobx-react";
import axios, { AxiosResponse } from "axios";
import { Button, Form, Input, Modal } from "antd";
import { SERVER_URL } from "../../../config/config";
import IdFindModalStore from "./IdFindModalStore";

type Props = {
  idFindModalStore: IdFindModalStore,
}

const IdFindModal: React.FC<Props> = ({ idFindModalStore }: Props) => {

  const handleOk = () => {
    idFindModalStore.setVisible(false);
  }

  const handleCancel = () => {
    idFindModalStore.setVisible(false);
  }

  const onFinish = async (values: {
    email: string
  }) => {
    const { email } = values;
    const URL = `${SERVER_URL}/api/findId`;
    const params = {
      email: email
    }
    await axios
      .post(URL, {}, {
        headers: {
          'Content-Type': 'application/json'
        },
        params: {
          ...params
        }
      })
      .then((response: AxiosResponse) => {
        if (response.data) {
          alert(`등록된 아이디는 ${response.data} 입니다.`);
          return
        }
        alert('등록된 아이디가 없습니다.');
      })
  }


  return (
    <Modal
      title="아이디 찾기"
      visible={idFindModalStore.visible}
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
          label="이메일"
          name="email"
          rules={[{ required: true, message: '등록하신 이메일을 입력해주세요.' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit">
            아이디찾기
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default observer(IdFindModal)