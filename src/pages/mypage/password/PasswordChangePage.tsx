import { observer } from "mobx-react";
import { Form, Input, Button, Card, Modal } from 'antd';
import { SERVER_URL } from "../../../config/config";
import axios, { AxiosResponse } from "axios";
import { useRootStore } from "../../../hooks/StoreContextProvider";
import './PasswordChangePage.scss';

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

const PasswordChangePage: React.FC = () => {
  const [form] = Form.useForm();
  const { authStore } = useRootStore();

  const onPasswordChange = async (values: {
    oldpassword: string,
    password: string,
    confirm: string
  }) => {
    const { oldpassword, password } = values;
    console.log('Received values of form: ', values);
    const params = {
      oldPassword: oldpassword,
      newPassword: password,
      mId: authStore.member?.mId
    }
    console.log(params);
    const URL =`${SERVER_URL}/api/resetPwd`;
    await axios
      .post(URL,{
        ...params
      },
      {
        headers: {
          'Content-Type': 'application/json'
        },
      }).then((response: AxiosResponse) => {
        if (response.data.error) {
          Modal.error({
            title: '비밀번호 변경에 실패하였습니다.'
          })
        } else {
          Modal.success({
            title: '비밀번호 변경에 성공하였습니다.'
          })
        }
      })
  };

  return (
    <div className="PasswordChangePage">
      <Card className="card-body">
        <h2>비밀번호 변경</h2>
        <p style={{color: "gray"}}>안전한 비밀번호로 내정보를 보호하세요.</p>
        <Form
          {...formItemLayout}
          form={form}
          name="register"
          onFinish={onPasswordChange}
          scrollToFirstError
        >
          <Form.Item
            name="oldpassword"
            label="기존 비밀번호"
            rules={[
              {
                required: true,
                message: '기존 비밀번호를 입력해주세요.',
              },
            ]}
            hasFeedback
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            name="password"
            label="새 비밀번호"
            rules={[
              {
                required: true,
                message: '변경할 비밀번호를 입력해주세요.',
              },
            ]}
            hasFeedback
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            name="confirm"
            label="새 비밀번호 확인"
            dependencies={['password']}
            hasFeedback
            rules={[
              {
                required: true,
                message: '변경할 비밀번호 확인을 입력해주세요.',
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('입력하신 비밀번호와 일치하지 않습니다.'));
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item {...tailFormItemLayout}>
            <Button type="primary" htmlType="submit">
              확인
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}

export default observer(PasswordChangePage);