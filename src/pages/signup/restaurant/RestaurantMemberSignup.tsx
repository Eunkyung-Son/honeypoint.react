import React, { useRef, useState } from "react";
import axios, { AxiosResponse } from "axios";
import { observer } from "mobx-react";
import { Button, Checkbox, Col, Form, FormInstance, Input, Modal, Radio, Row, Select, Space, Tag, TimePicker } from "antd";
import { PlusOutlined } from '@ant-design/icons';
import TextArea from "antd/lib/input/TextArea";
import { TweenOneGroup } from 'rc-tween-one';
import { SERVER_URL } from "../../../config/config";
import RestaurantSignupData from "../../../models/RestaurantSignupData";
import AddressModal, { AddressResponse } from "../modal/AddressModal";
import AddressModalStore from "../modal/AddressModalStore";
import RestaurantMemberSignupStore from "./RestaurantMemberSignupStore";
import { useRootStore } from "../../../hooks/StoreContextProvider";

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

const RestaurantMemberSignup: React.FC = () => {
  const addressModalStore = new AddressModalStore();
  const { routing } = useRootStore();
  const [restaurantMemberSignupStore] = useState(() => new RestaurantMemberSignupStore());
  const [isShowTagInput, setIsShowTagInput] = useState(false);

  const input = useRef<Input | null>(null);
  const formRef = React.createRef<FormInstance>();
  
  const onIdValidation = async () => {
    const { setIsDuplicated, id } = restaurantMemberSignupStore;
    const URL = `${SERVER_URL}/api/idCheck`;
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
          Modal.success({
            title: '사용 가능한 아이디 입니다.'
          })
          setIsDuplicated(false);
          return;
        }
        Modal.error({
          title: '중복된 아이디가 존재합니다.'
        })
        setIsDuplicated(true);
      })
  }

  const onEmailValidation = async () => {
    const { email, setEmailDuplicated } = restaurantMemberSignupStore;
    const URL = `${SERVER_URL}/api/emailCheck`;
    const params = {
      email: email,
    }
    await axios
      .get(URL, {
        params: {
          ...params
        }
      })
      .then((response: AxiosResponse) => {
        if (response.data) {
          Modal.success({
            title: '사용 가능한 이메일 입니다.'
          })
          setEmailDuplicated(false);
          return;
        }
        Modal.error({
          title: '중복된 이메일이 존재합니다.'
        })
        setEmailDuplicated(true);
      })
  }

  const onIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    restaurantMemberSignupStore.setId(e.target.value);
  }

  const onEmailChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    restaurantMemberSignupStore.setEmail(e.target.value);
  }

  const showModal = () => {
    addressModalStore.setVisible(true);
  }
  
  const setAddressData = (data: AddressResponse) => {
    const { zoneCode, address } = data;
    formRef.current?.setFieldsValue({
      rPostNumber: zoneCode,
      rAddress: address,
    })
  }

  const handleSignup = async (values:RestaurantSignupData) => {
    try {
      await restaurantMemberSignupStore.onSignup(values).then((res) => {
        routing.push('/login');
      })
    } catch (e) {

    }
  } 

  const handleClose = (removedTag: string) => {
    const { setTags } = restaurantMemberSignupStore;
    const tags = restaurantMemberSignupStore.tags.filter(tag => tag !== removedTag);
    console.log(tags);
    setTags(tags)
  };

  const showTagInput = () => {
    setIsShowTagInput(true);
    input.current?.focus();
  }
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    restaurantMemberSignupStore.setInputValue(e.target.value);
  }

  const handleInputConfirm = () => {
    const { inputValue, tags, setTags, setInputValue } = restaurantMemberSignupStore;

    if (inputValue && tags.indexOf(inputValue) === -1) {
      setTags([...tags, inputValue]);
    }
    setIsShowTagInput(false);
    setInputValue('');
  }

  const onComplete = (e: { index: number, target: HTMLElement | any }) => {
    e.target.style = '';
  }

  const forMap = (tag: string) => {
    const tagElem = (
      <Tag
        closable
        onClose={e => {
          e.preventDefault();
          handleClose(tag);
        }}
      >
        {tag}
      </Tag>
    );
    return (
      <span key={tag} style={{ display: 'inline-block' }}>
        {tagElem}
      </span>
    );
  };

  const { tags, inputValue } = restaurantMemberSignupStore;
  const tagChild = tags.map(forMap);
  
  return (
    <>
      <Form 
        name="restaurantSignupForm"
        {...formItemLayout}
        validateMessages={validateMessages}
        ref={formRef}
        onFinish={handleSignup}
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
                if (!restaurantMemberSignupStore.isDuplicated) {
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
            },
            () => ({
              validator: (_, value) => {
                if (!restaurantMemberSignupStore.isEmailDuplicated) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('중복된 이메일이 존재합니다.'));
              },
            }),
          ]}>
          <Space>
            <Input onChange={onEmailChange} />
            <Button onClick={onEmailValidation}>중복확인</Button>
          </Space>        
        </Form.Item>
        <Form.Item
          name={['rName']}
          label="업체명"
          rules={[
            {
              required: true,
              message: '업체명을 입력해주세요.'
            }
          ]}
        >
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
              name={['rPostNumber']}
              rules={[
                {
                  required: true,
                  message: '우편번호를 입력해주세요.'
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
          name={['rAddress']}
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
        <Form.Item
          name={['rOAddress']}
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
        <Form.Item
          name={['rTel']}
          label="전화번호"
          rules={[
            {
              required: true,
              message: '전화번호를 입력해주세요.'
            },
          ]}>
          <Input />
        </Form.Item>
        <Form.Item
          name={['rType']}
          label="업종카테고리"
          rules={[
            {
              required: true,
              message: '업종카테고리를 선택해주세요.'
            }
          ]}
        >
          <Select placeholder={"선택하기"}>
            <Select.Option value="한식">한식</Select.Option>
            <Select.Option value="일식">일식</Select.Option>
            <Select.Option value="중식">중식</Select.Option>
            <Select.Option value="양식">양식</Select.Option>
            <Select.Option value="세계음식">세계음식</Select.Option>
            <Select.Option value="술집">술집</Select.Option>
            <Select.Option value="카페">카페</Select.Option>
            <Select.Option value="패스트푸드">패스트푸드</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item
          name={['rTag']}
          label="태그"
        >
          <>
            <div style={{ marginBottom: 16 }}>
              <TweenOneGroup
                enter={{
                  scale: 0.8,
                  opacity: 0,
                  type: 'from',
                  duration: 100,
                  onComplete: onComplete
                }}
                leave={{ opacity: 0, width: 0, scale: 0, duration: 200 }}
                appear={false}
              >
                {tagChild}
              </TweenOneGroup>
            </div>
            {isShowTagInput ? (
              <Input
                ref={input}
                type="text"
                size="small"
                style={{ width: 78 }}
                value={inputValue}
                onChange={handleInputChange}
                onBlur={handleInputConfirm}
                onPressEnter={handleInputConfirm}
              />
            ) : (
              <Tag onClick={showTagInput} className="site-tag-plus">
                <PlusOutlined /> 태그 추가
              </Tag>
            )}
          </>
        </Form.Item>
        <Form.Item
          name={['rPrice']}
          label="가격대"
          rules={[
            {
              required: true,
              message: '가격대를 선택해주세요.'
            }
          ]}
        >
          <Select placeholder={"선택하기"}>
            <Select.Option value="10000">만원미만</Select.Option>
            <Select.Option value="20000">1-2만원대</Select.Option>
            <Select.Option value="30000">3-4만원대</Select.Option>
            <Select.Option value="50000">5만원이상</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item
          name={['rParking']}
          label="주차가능여부"
          rules={[
            {
              required: true,
              message: '주차가능여부를 선택해주세요.'
            }
          ]}
        >
          <Radio.Group>
            <Radio value={'Y'}>주차가능</Radio>
            <Radio value={'N'}>주차불가</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          name={['rStartTime']}
          label="오픈시간"
          rules={[
            {
              required: true,
              message: '오픈시간을 선택해주세요.'
            }
          ]}
        >
          <TimePicker format="hh:mm" />
        </Form.Item>
        <Form.Item
          name={['rEndTime']}
          label="마감시간"
          rules={[
            {
              required: true,
              message: '마감시간을 선택해주세요.'
            }
          ]}
        >
          <TimePicker format="hh:mm" />
        </Form.Item>
        <Form.Item 
          name={['rRestDay']}
          label="정기휴무"
          rules={[
            {
              required: true,
              message: '정기휴무일을 선택해주세요.'
            }
          ]}
        >
          <Checkbox.Group style={{ width: '100%' }}>
            <Row>
              <Col span={8}>
                <Checkbox value="월">월</Checkbox>
              </Col>
              <Col span={8}>
                <Checkbox value="화">화</Checkbox>
              </Col>
              <Col span={8}>
                <Checkbox value="수">수</Checkbox>
              </Col>
              <Col span={8}>
                <Checkbox value="목">목</Checkbox>
              </Col>
              <Col span={8}>
                <Checkbox value="금">금</Checkbox>
              </Col>
              <Col span={8}>
                <Checkbox value="토">토</Checkbox>
              </Col>
              <Col span={8}>
                <Checkbox value="일">일</Checkbox>
              </Col>
              <Col span={8}>
                <Checkbox value="없음">없음</Checkbox>
              </Col>
            </Row>
          </Checkbox.Group>
        </Form.Item>
        <Form.Item
          name={['rIntro']}
          label="업체소개"
          rules={[
            {
              required: true,
              message: '업체소개를 입력해주세요.'
            }
          ]}
        >
          <TextArea rows={4} />
        </Form.Item>
        <Form.Item 
          label="예약가능여부"
          name={['resveYn']}
          rules={[
            {
              required: true,
              message: '예약여부를 선택해주세요.'
            }
          ]}
        >
          <Radio.Group>
            <Radio value={'Y'}>예약가능</Radio>
            <Radio value={'N'}>예약불가</Radio>
          </Radio.Group>
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
}

export default observer(RestaurantMemberSignup);
