import { observer } from "mobx-react";
import { Form, Input, Button, Card } from 'antd';
import { SERVER_URL } from "../../../config/config";
import axios, { AxiosResponse } from "axios";
import { useRootStore } from "../../../hooks/StoreContextProvider";

type Props = {

}

const PasswordChangePage: React.FC<Props> = (props: Props) => {
  const [form] = Form.useForm();
  const { authStore } = useRootStore();

  const onPasswordChange = async (values: any) => {

    // FIXME: undefined check!!
    console.log('Received values of form: ', values);
    const params = {
      oldPassword: values.oldpassword,
      newPassword: values.password,
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
          alert('asd')
        } else {
          alert("비밀번호 변경 성공!");
        }
      })
  };

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
  return (
    <Card style={{ width: '50%', marginRight: '25%', marginLeft: '25%', marginTop: "3%"}}>
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
              message: 'Please input your password!',
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
              message: 'Please input your password!',
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
              message: 'Please confirm your password!',
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
  )
}

export default observer(PasswordChangePage);