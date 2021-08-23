import React, { createRef } from "react";
import axios, { AxiosResponse } from "axios";
import { inject, observer } from "mobx-react";
import { Button, Checkbox, Col, Form, FormInstance, Input, Radio, Row, Select, Tag, TimePicker } from "antd";
import { PlusOutlined } from '@ant-design/icons';
import { TweenOneGroup } from 'rc-tween-one';
import TextArea from "antd/lib/input/TextArea";
import { Moment } from "moment";
import { SERVER_URL } from "../../../config/config";
import AddressModal, { AddressResponse } from "../modal/AddressModal";
import RootStore from "../../../stores/RootStore";
import AddressModalStore from "../modal/AddressModalStore";
import RestaurantMemberSignupStore from "./RestaurantMemberSignupStore";
import RestaurantSignupData from "../../../models/RestaurantSignupData";

type Props = {
  
}
@inject((rootStore: RootStore) => ({
  rootStore: rootStore.routing,
}))
@observer
export default class RestaurantMemberSignup extends React.Component<Props> {
  addressModalStore: AddressModalStore = new AddressModalStore();
  restaurantMemberSignupStore: RestaurantMemberSignupStore = new RestaurantMemberSignupStore();
  input: React.RefObject<Input>;
  formRef = React.createRef<FormInstance>();
  timeFormat = 'hh:mm';

  constructor(props: Props){
    super(props);
    this.input = createRef();
  }
  
  onIdValidation = async () => {
    const { restaurantMemberSignupStore } = this;
    const { setIsDuplicated, id } = restaurantMemberSignupStore;
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

  onIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.restaurantMemberSignupStore.setId(e.target.value);
  }

  showModal = () => {
    this.addressModalStore.setVisible(true);
  }
  
  setAddressData = (data: AddressResponse) => {
    const { zoneCode, address } = data;
    this.formRef.current?.setFieldsValue({
      rPostNumber: zoneCode,
      rAddress: address,
    })
  }

  onSignup = async (values:RestaurantSignupData) => {
    // FIXME: rNo => 0으로 넘어오는 것 수정
    console.log(values, "signup values");
    const { restaurantMemberSignupStore } = this;
    const { tags } = restaurantMemberSignupStore;
    const URL = `${SERVER_URL}/restaurantInsert`;
    await axios
      .post(URL,
        {
          mId: values.mId,
          mPwd: values.mPwd,
          mEmail: values.mEmail,
          rName: values.rName,
          rAddress: `${values.rPostNumber}, ${values.rAddress}`,
          rOAddress: values.rOAddress,
          rTel: values.rTel,
          rType: values.rType,
          rTag: tags.join(', '),
          rPrice: values.rPrice,
          rParking: values.rParking,
          rStartTime: (values.rStartTime as Moment).format(this.timeFormat),
          rEndTime: (values.rEndTime as Moment).format(this.timeFormat),
          rRestDay: (values.rRestDay as string[]).join(', '),
          rIntro: values.rIntro,
          resveYn: values.resveYn,
        },
        {
          headers: {
            'Content-Type': 'application/json'
          },
        }
      )
      .then((response: AxiosResponse) => {
      })
  } 

  handleClose = (removedTag: any) => {
    // FIXME: removedTag 타입 잡기
    const { restaurantMemberSignupStore } = this;
    const { setTags } = restaurantMemberSignupStore;
    const tags = restaurantMemberSignupStore.tags.filter(tag => tag !== removedTag);
    console.log(tags);
    setTags(tags)
  };

  // FIXME: input ref 지정한게 null로 되는 이유 찾아봐야함
  showInput = () => {
    const { restaurantMemberSignupStore, input } = this;
    restaurantMemberSignupStore.setInputVisible(true);
    console.log(input);
    (input.current as any)?.focus();
  }
  
  handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.restaurantMemberSignupStore.setInputValue(e.target.value);
  }

  handleInputConfirm = () => {
    const { restaurantMemberSignupStore } = this;
    const { inputValue, tags, setTags, setInputValue, setInputVisible } = restaurantMemberSignupStore;

    if (inputValue && tags.indexOf(inputValue) === -1) {
      setTags([...tags, inputValue]);
    }
    setInputVisible(false);
    setInputValue('');
  }

  onComplete = (e: any) => {
    e.target.style = '';
  }

  forMap = (tag: any) => {
    const tagElem = (
      <Tag
        closable
        onClose={e => {
          e.preventDefault();
          this.handleClose(tag);
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

  render () {
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

    const { tags, inputVisible, inputValue } = this.restaurantMemberSignupStore;
    const tagChild = tags.map(this.forMap);

    return (
      <>
        <Form 
          name="restaurantSignupForm"
          {...formItemLayout}
          validateMessages={validateMessages}
          ref={this.formRef}
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
                  if (!this.restaurantMemberSignupStore.isDuplicated) {
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
            name={['rPostNumber']}
            label="우편번호"
            rules={[
              {
                required: true,
                message: '우편번호를 입력해주세요.'
              }
            ]}
          >
            <Input />
          </Form.Item>
          <Button onClick={this.showModal}>
            주소 검색
          </Button>
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
            <Input />
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
              {
                pattern: /^[0-9]{3}[-]+[0-9]{4}[-]+[0-9]{4}$/,
                message: '("-")를 포함한 핸드폰 번호를 입력해 주세요.'
              }
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
                    onComplete: this.onComplete
                  }}
                  leave={{ opacity: 0, width: 0, scale: 0, duration: 200 }}
                  appear={false}
                >
                  {tagChild}
                </TweenOneGroup>
              </div>
              {inputVisible && (
                <Input
                  ref={this.input}
                  type="text"
                  size="small"
                  style={{ width: 78 }}
                  value={inputValue}
                  onChange={this.handleInputChange}
                  onBlur={this.handleInputConfirm}
                  onPressEnter={this.handleInputConfirm}
                />
              )}
              {!inputVisible && (
                <Tag onClick={this.showInput} className="site-tag-plus">
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
          modalStore={this.addressModalStore}
          handleAddressData={this.setAddressData}
        />
      </>
    )
  }
}