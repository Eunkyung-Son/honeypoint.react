import React, { useState } from "react";
import moment from "moment";
import { observer } from "mobx-react";
import { Button, Card, DatePicker, Form, FormInstance, Input, Space } from "antd";
import AddressModal, { AddressResponse } from "../../../signup/modal/AddressModal";
import { useRootStore } from "../../../../hooks/StoreContextProvider";
import AddressModalStore from "../../../signup/modal/AddressModalStore";

const MyInfoEditPage:React.FC = () => {

  const dateFormat = 'YYYY/MM/DD';
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
  const formRef = React.createRef<FormInstance>();
  const { authStore } = useRootStore();
  const [addressModalStore] = useState(() => new AddressModalStore());

  const onFinish = (values: any) => {
    console.log(values);
  }

  const showModal = () => {
    addressModalStore.setVisible(true);
  }

  const setAddressData = (data: AddressResponse) => {
    console.log(data);
    const { zoneCode, address } = data;
    formRef.current?.setFieldsValue({
      mPostNumber: zoneCode,
      mRoadAddress: address,
    })
    console.log(formRef.current?.getFieldValue(['mPostNumber']))

  }

  return (
    
    <Card style={{ width: '50%', marginRight: '25%', marginLeft: '25%', marginTop: "3%"}}>
      <h2>회원정보 변경</h2>
      <p style={{color: "gray"}}>회원정보를 변경할 수 있습니다.</p>
      <Form
        {...formItemLayout}
        name="register"
        onFinish={onFinish}
        scrollToFirstError
      >
        <Form.Item
          name={['mId']}
          label="아이디"
          initialValue={authStore.member?.mId}
        >
          <Input disabled/>
        </Form.Item>
        <Form.Item
          name={["mPwd"]}
          label="비밀번호"
          rules={[
            {
              required: true,
              message: '비밀번호를 입력해주세요.',
            },
          ]}
          hasFeedback
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          name={["confirm"]}
          label="비밀번호 확인"
          dependencies={['mPwd']}
          hasFeedback
          rules={[
            {
              required: true,
              message: '비밀번호 확인을 입력해주세요.',
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('mPwd') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('비밀번호와 일치하지 않습니다.'));
              },
            }),
          ]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          name={['mName']}
          label="이름"
          initialValue={authStore.member?.mName}
          rules={[
            {
              required: true,
              message: '이름을 입력해주세요.'
            }
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name={['mNickname']}
          label="닉네임"
          initialValue={authStore.member?.mNickname}
          rules={[
            {
              required: true,
              message: '닉네임을 입력해주세요.'
            }
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name={['mBirthday']}
          label="생년월일"
          rules={[
            {
              required: true,
              message: '생년월일을 입력해주세요.'
            }
          ]}
        >
          <DatePicker
            format={dateFormat}
            defaultValue={moment(authStore.member?.mBirthday, dateFormat)}
          />
        </Form.Item>
        <Form.Item
          name={['mEmail']}
          label="이메일"
          initialValue={authStore.member?.mEmail}
          rules={[
            {
              type: 'email',
              message: '올바른 이메일 형식을 입력해주세요.'
            },
            {
              required: true,
              message: '이메일을 입력해주세요.'
            }
          ]}>
          <Input />
        </Form.Item>
        <Form.Item
          name={['mPhone']}
          label="전화번호"
          initialValue={authStore.member?.mPhone}
          rules={[
            {
              required: true,
              message: '전화번호를 입력해주세요.'
            },
            {
              pattern: /^[0-9]{3}[-]+[0-9]{4}[-]+[0-9]{4}$/,
              message: '("-")를 포함한 핸드폰 번호를 입력해 주세요.'
            }
          ]}>
          <Input />
        </Form.Item>
        <Form.Item
          label="우편번호"
        >
          <Space 
            align="baseline"
            onClick={showModal}
          >
            <Form.Item
              name={['mPostNumber']}
              rules={[
                {
                  required: true,
                  message: '주소를 입력해주세요.'
                }
              ]}
              style={{margin: 0}}
              initialValue={authStore.mPostNumber}
            >
              <Input readOnly/>
            </Form.Item>
            <Button>
              주소 검색
            </Button>
          </Space>
        </Form.Item>
        <Form.Item
          name={['mRoadAddress']}
          label="도로명주소"
          rules={[
            {
              required: true,
              message: '도로명주소를 입력해주세요.'
            }
          ]}
          initialValue={authStore.mRoadAddress}
        >
          <Input readOnly/>
        </Form.Item>
        <Form.Item
          name={['mDetailAddress']}
          label="상세주소"
          rules={[
            {
              required: true,
              message: '상세주소를 입력해주세요.'
            }
          ]}
          initialValue={authStore.mDetailAddress}
        >
          <Input />
        </Form.Item>
        <Form.Item {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit">
            변경
          </Button>
        </Form.Item>
      </Form>
      <AddressModal
        modalStore={addressModalStore}
        handleAddressData={setAddressData}
      />
    </Card>
  )
}

export default observer(MyInfoEditPage);