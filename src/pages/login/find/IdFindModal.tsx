import { Button, Form, Input, Modal } from "antd";
import axios, { AxiosResponse } from "axios";
import { observer } from "mobx-react";
import React from "react";
import { SERVER_URL } from "../../../config/config";
import IdFindModalStore from "./IdFindModalStore";

type Props = {
  idFindModalStore: IdFindModalStore,
}

@observer
export default class IdFindModal extends React.Component<Props> {

  handleOk = () => {
    this.props.idFindModalStore.setVisible(false);
  }

  handleCancel = () => {
    this.props.idFindModalStore.setVisible(false);
  }

  onFinish = async (values: {
    email: string
  }) => {
    // FIXME: 같은 이메일이 여러개 있는 경우를 처리 하거나,
    // 회원 가입 할 때 막기.
    const { email } = values;
    const URL = `${SERVER_URL}/findId`;
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

  render() {
    // FIXME: onOK에서 비밀번호 찾는 함수를 호출할 지,
    // 버튼을 따로 만들어서 그 버튼에서 호출할 지 고민
    return (
      <Modal
        title="아이디 찾기"
        visible={this.props.idFindModalStore.visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
      >
        <Form
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          initialValues={{ remember: true }}
          onFinish={this.onFinish}
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
}