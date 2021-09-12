import React, { useState } from "react";
import axios, { AxiosResponse } from "axios";
import { Moment } from "moment";
import { Button, DatePicker, Form, FormInstance, Input, Space } from "antd";
import { observer } from "mobx-react";
import { SERVER_URL } from "../../../config/config";
import AddressModal, { AddressResponse } from "../modal/AddressModal";
import GeneralMemberSignupStore from "./GeneralMemberSignupStore";
import AddressModalStore from "../modal/AddressModalStore";
import GeneralSignupData from "../../../models/GeneralSignupData";
import { useRootStore } from "../../../hooks/StoreContextProvider";


const GeneralMemberSignup: React.FC = observer(() => {
  const { routing } = useRootStore();
  // const addressModalStore = new AddressModalStore();

  const [addressModalStore] = useState(() => new AddressModalStore()) // 위의 타이머 정의를 참고하세요.
  const generalMemberSignupStore = new GeneralMemberSignupStore();
  const formRef = React.createRef<FormInstance>();
  const dateFormat = 'YYYY/MM/DD';

  const onIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    generalMemberSignupStore.setId(e.target.value);
  }

  const onIdValidation = async () => {
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

  const onSignup = async (values: GeneralSignupData) => {
    // FIXME: 회원가입 시 아이디 / 비밀번호 오류 에러코드로 에러 캐치하기
    console.log(values, "signup values");
    const URL = `${SERVER_URL}/memberInsert`;
    console.log(`${values.mPostNumber}, ${values.mRoadAddress}, ${values.mDetailAddress}`);
    console.log((values.mBirthday as Moment).format(dateFormat));
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
        routing.push('/login');
      })
  }

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

  
  return (      
    <>
      <Form
        ref={formRef}
        name="basicForm"
        {...formItemLayout}
        validateMessages={validateMessages}
        onFinish={onSignup}
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
            <Input onChange={onIdChange} />
            <Button onClick={onIdValidation}>중복확인</Button>
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
            format={dateFormat}
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
        modalStore={addressModalStore}
        handleAddressData={setAddressData}
      />
    </>
  )
})

export default GeneralMemberSignup