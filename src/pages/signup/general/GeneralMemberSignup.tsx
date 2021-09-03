import React from "react";
import axios, { AxiosResponse } from "axios";
import { Moment } from "moment";
import { Button, DatePicker, Form, FormInstance, Input, Space } from "antd";
import { inject, observer } from "mobx-react";
import { SERVER_URL } from "../../../config/config";
import AddressModal, { AddressResponse } from "../modal/AddressModal";
import RootStore from "../../../stores/RootStore";
import GeneralMemberSignupStore from "./GeneralMemberSignupStore";
import AddressModalStore from "../modal/AddressModalStore";
import GeneralSignupData from "../../../models/GeneralSignupData";
import { RouterStore } from "mobx-react-router";

type Props = {
  routing?: RouterStore
}
@observer
@inject((rootStore: RootStore) => ({
  routing: rootStore.routing,
}))
export default class GeneralMemberSignup extends React.Component<Props> {
  addressModalStore = new AddressModalStore();
  generalMemberSignupStore = new GeneralMemberSignupStore();

  formRef = React.createRef<FormInstance>();

  dateFormat = 'YYYY/MM/DD';

  onIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.generalMemberSignupStore.setId(e.target.value);
  }

  onIdValidation = async () => {
    const { generalMemberSignupStore } = this;
    const { id, setIsDuplicated } = generalMemberSignupStore;
    const URL = `${SERVER_URL}/idCheck`;
    const params = {
      id: id,
    }
    await axios
      .get(URL, {
        params: {
          ...params
        }
      })
      .then((response: AxiosResponse) => {
        if (response.data) {
          alert('사용 가능한 아이디 입니다.')
          setIsDuplicated(false);
          return;
        }
        alert('중복된 아이디가 존재합니다.')
        setIsDuplicated(true);
      })
  }

  showModal = () => {
    this.addressModalStore.setVisible(true);
  }

  setAddressData = (data: AddressResponse) => {
    const { zoneCode, address } = data;
    this.formRef.current?.setFieldsValue({
      mPostNumber: zoneCode,
      mRoadAddress: address,
    })
  }

  onSignup = async (values: GeneralSignupData) => {
    // FIXME: 회원가입 시 아이디 / 비밀번호 오류 에러코드로 에러 캐치하기
    console.log(values, "signup values");
    const URL = `${SERVER_URL}/memberInsert`;
    console.log(`${values.mPostNumber}, ${values.mRoadAddress}, ${values.mDetailAddress}`);
    console.log((values.mBirthday as Moment).format(this.dateFormat));
    await axios
      .post(URL,
        {
          mId: values.mId,
          mName: values.mName,
          mEmail: values.mEmail,
          mNickname: values.mNickname,
          mBirthday: (values.mBirthday as Moment).format("YYYYMMDD"),
          mPhone: values.mPhone,
          mAddress: `${values.mPostNumber}, ${values.mRoadAddress}, ${values.mDetailAddress}`,
          mPwd: values.mPwd
        },
        {
          headers: {
            'Content-Type': 'application/json'
          },
        }
      )
      .then((response: AxiosResponse) => {
        // FIXME: 회원 가입 완료 후 모달이나 alert 창 띄워 준 후
        // 라우팅 변경하도록 하기
        this.props.routing?.push('/login');
      })
  } 

  render () {
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
      },
    };

    const validateMessages = {
      required: '${label} is required!',
      types: {
        email: '${label} is not a valid email!',
        number: '${label} is not a valid number!',
      },
      number: {
        range: '${label} must be between ${min} and ${max}',
      },
    };

    const { generalMemberSignupStore } = this;
    
    return (      
      <>
        <Form
          ref={this.formRef}
          name="basicForm"
          {...formItemLayout}
          validateMessages={validateMessages}
          onFinish={this.onSignup}
        >
          <Form.Item
            name={['mId']}
            label="아이디"
            rules={[
              {
                required: true,
                message: '아이디를 입력해주세요.',
                
              },
              () => ({
                validator: (_, value) => {
                  if (!generalMemberSignupStore.isDuplicated) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('중복된 아이디가 존재합니다.'));
                },
              }),
            ]}
          >
            <Space>
              <Input onChange={this.onIdChange} />
              <Button onClick={this.onIdValidation}>중복확인</Button>
            </Space>
          </Form.Item>
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
            <Input.Password />
          </Form.Item>
          <Form.Item
            name="confirm"
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
              format={this.dateFormat}
            />
          </Form.Item>
          <Form.Item
            name={['mEmail']}
            label="이메일"
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
            name={['mPostNumber']}
            label="우편번호"
            rules={[
              {
                required: true,
                message: '주소를 입력해주세요.'
              }
            ]}
          >
            <Space>
              <Input readOnly/>
              <Button onClick={this.showModal}>
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
          >
            <Input />
          </Form.Item>
          <Form.Item wrapperCol={{ ...formItemLayout.wrapperCol, offset: 8 }}>
            <Button type="primary" htmlType="submit">
              회원가입
            </Button>
          </Form.Item>
        </Form>
        <AddressModal
          modalStore={this.addressModalStore}
          handleAddressData={this.setAddressData}
        />
      </>
    )
  }
}