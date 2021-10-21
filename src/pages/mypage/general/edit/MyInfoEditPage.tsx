import React, { useEffect, useState } from "react";
import moment, { Moment } from "moment";
import { observer } from "mobx-react";
import { Button, Card, DatePicker, Form, FormInstance, Input, Space } from "antd";
import AddressModal, { AddressResponse } from "../../../signup/modal/AddressModal";
import { useRootStore } from "../../../../hooks/StoreContextProvider";
import AddressModalStore from "../../../signup/modal/AddressModalStore";
import { SERVER_URL } from "../../../../config/config";
import axios, { AxiosResponse } from "axios";
import { useForm } from "antd/lib/form/Form";

const MyInfoEditPage:React.FC = () => {
  const [form] = useForm();
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
  // const formRef = React.createRef<FormInstance>();
  const { authStore } = useRootStore();
  const [addressModalStore] = useState(() => new AddressModalStore());

  useEffect(() => {
    authStore.setAddressData();
    console.log(authStore.member);
    const { mPostNumber, mDetailAddress, mRoadAddress } = authStore;
    form.setFieldsValue({
      ...authStore.member,
      mPostNumber: mPostNumber,
      mDetailAddress: mDetailAddress,
      mRoadAddress: mRoadAddress,
      mBirthday: moment(authStore.member?.mBirthday)
    });
    console.log(form.getFieldsValue());

  }, []);
  // FIXME: 주소 
  const onFinish = async (values: {
    mName: string,
    mNickname: string,
    mBirthday: any,
    mPostNumber: string,
    mRoadAddress: string,
    mDetailAddress: string,
    mAddress: string,
    mPhone: string,
    mEmail: string
  }) => {
    const { mName, mNickname, mBirthday, mPostNumber, mRoadAddress, mDetailAddress, mPhone, mEmail } = values;
    console.log(values);
    console.log(mBirthday);
    console.log(form.getFieldsValue());
    const URL = `${SERVER_URL}/api/member/general/update/${authStore.member?.mNo}`;
    console.log(moment(mBirthday).format("YYYYMMDD"));
    await axios
      .post(URL,
        {
          ...authStore.member,
          mName: mName,
          mNickname: mNickname,
          mBirthday: moment(mBirthday).format('YYYYMMDD'),
          mAddress: `${mPostNumber}, ${mRoadAddress}, ${mDetailAddress}`,
          mPhone: mPhone,
          mEmail: mEmail,
          // mNo: authStore.member?.mNo
        },
        {
          headers: {
            'Content-Type': 'application/json'
          },
        })
        .then((response: AxiosResponse) => {
          console.log(response.data.member);
          if (!response.data.error) {
            localStorage.setItem('member', JSON.stringify(response.data.member));
            authStore.setMember(response.data.member);
          }
        })

  }

  const showModal = () => {
    addressModalStore.setVisible(true);
  }

  const setAddressData = (data: AddressResponse) => {
    console.log(data);
    const { zoneCode, address } = data;
    form.setFieldsValue({
      mPostNumber: zoneCode,
      mRoadAddress: address,
    })
    console.log(form.getFieldValue(['mPostNumber']))

  }

  return (
    
    <Card style={{ width: '50%', marginRight: '25%', marginLeft: '25%', marginTop: "3%"}}>
      <h2>회원정보 변경</h2>
      <p style={{color: "gray"}}>회원정보를 변경할 수 있습니다.</p>
      <Form
        {...formItemLayout}
        name="update"
        onFinish={onFinish}
        // ref={formRef}
        form={form}
      >
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
          // rules={[
          //   {
          //     required: true,
          //     message: '생년월일을 입력해주세요.'
          //   }
          // ]}
        >
          {/* {console.log(moment(authStore.member?.mBirthday, dateFormat))} */}
          <DatePicker
            format={dateFormat}
            // defaultValue={moment(authStore.member?.mBirthday, dateFormat)}
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
              // initialValue={authStore.mPostNumber}
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
          // initialValue={authStore.mRoadAddress}
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
          // initialValue={authStore.mDetailAddress}
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