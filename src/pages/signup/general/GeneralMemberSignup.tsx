import React from "react";
import { Button, DatePicker, Form, FormInstance, Input } from "antd";
import { SERVER_URL } from "../../../config/config";
import axios, { AxiosResponse } from "axios";
import GeneralMemberSignupStore from "./GeneralMemberSignupStore";
import AddressModal from "../modal/AddressModal";
import { Moment } from "moment";
import { inject, observer } from "mobx-react";
import RootStore from "../../../stores/RootStore";
import ModalStore from "../../../stores/ModalStore";
import { AddressData } from "react-daum-postcode";

type Props = {
  modalStore: ModalStore,
}
@observer
@inject((rootStore: RootStore) => ({
  rootStore: rootStore.routing,
  modalStore: rootStore.modalStore,
}))
export default class GeneralMemberSignup extends React.Component<Props> {
  generalMemberSignupStore: GeneralMemberSignupStore = new GeneralMemberSignupStore();
  ref = React.createRef<FormInstance>();
  HEADERS = {
    'Content-Type': 'application/json'
  };

  onIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.generalMemberSignupStore.setId(e.target.value);
  }

  onDateChange = (momentDate: Moment | null, dateString: string) => {
    if (momentDate === null) return;
    this.generalMemberSignupStore.setBirthday(Number(momentDate.format('YYYYMMDD')));
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
          mBirthday: this.generalMemberSignupStore.birthday,
          mPhone: values.mPhone,
          mAddress: `${values.mPostNumber}, ${values.mRoadAddress}, ${values.mDetailAddress}`,
          mPwd: values.mPwd
        },
        {
          headers: this.HEADERS,
        }
      )
      .then((response: AxiosResponse) => {
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

    const dateFormat = 'YYYY/MM/DD';

    const { generalMemberSignupStore } = this;
    
    return (      
      <>
        <Form
          ref={this.ref}
          name="basicForm"
          {...formItemLayout}
          validateMessages={validateMessages}
          onFinish={this.onFormFinish}
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
            name={['mPostNumber']}
            label="우편번호"
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
        <AddressModal modalStore={this.props.modalStore} handleAddressData={this.setAddressData}/>
      </>
    )
  }
}