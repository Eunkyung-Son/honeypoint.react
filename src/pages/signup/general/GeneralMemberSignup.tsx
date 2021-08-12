import React from "react";
import { Button, DatePicker, Form, Input, Tabs } from "antd";
import { SERVER_URL } from "../../../config/config";
import axios, { AxiosResponse } from "axios";
import GeneralMemberSignupStore from "./GeneralMemberSignupStore";
import AddressModal from "../modal/AddressModal";
import AddressModalStore from "../modal/AddressModalStore";
import { Moment } from "moment";

type Props = {
  onFormSubmit: (name: string, { values, forms }: any) => void;
}

export default class GeneralMemberSignup extends React.Component<Props> {
  generalMemberSignupStore: GeneralMemberSignupStore = new GeneralMemberSignupStore();
  addressModalStore: AddressModalStore = new AddressModalStore();

  onIdChange = (e: any) => {
    this.generalMemberSignupStore.setId(e.target.value);
  }

  onIdValidation = async () => {
    const { generalMemberSignupStore } = this;
    const URL = `${SERVER_URL}/idCheck`;
    const params = {
      id: generalMemberSignupStore.id,
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
          generalMemberSignupStore.setIsDuplicated(false);
          return;
        }
        alert('중복된 아이디가 존재합니다.')
        generalMemberSignupStore.setIsDuplicated(true);
      })
  }

  onOk = () => {   
    this.addressModalStore.setVisible(false);
  }

  showModal = () => {
    this.addressModalStore.setVisible(true, this.onOk);
  }

  onDateChange = (momentDate: Moment | null, dateString: string) => {
    if (momentDate === null) return;
    this.generalMemberSignupStore.setBirthday(Number(momentDate.format('YYYYMMDD')));
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

    const dateFormat = 'YYYY/MM/DD';

    const { generalMemberSignupStore } = this;
    
    const { onFormSubmit } = this.props;

    return (      
      <Form.Provider onFormFinish={onFormSubmit}>
        <Form 
          name="basicForm"
          {...formItemLayout}
          validateMessages={validateMessages}
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
            <Input onChange={this.onIdChange} />
          </Form.Item>
          <Button onClick={this.onIdValidation}>중복확인</Button>
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
              format={dateFormat}
              onChange={this.onDateChange}
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
            name={['mAddress']}
            label="주소"
            rules={[
              {
                required: true,
                message: '주소를 입력해주세요.'
              }
            ]}
          >
            <Input readOnly/>
          </Form.Item>
          <Button onClick={this.showModal}>
            주소 검색
          </Button>
          <Form.Item wrapperCol={{ ...formItemLayout.wrapperCol, offset: 8 }}>
            <Button type="primary" htmlType="submit">
              회원가입
            </Button>
          </Form.Item>
        </Form>
        <AddressModal addressModalStore={this.addressModalStore} />
      </Form.Provider>
    )
  }
}