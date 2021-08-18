import React, { createRef } from "react";
import { Button, Checkbox, Col, Form, FormInstance, Input, Radio, RadioChangeEvent, Row, Select, Tag, TimePicker } from "antd";
import { SERVER_URL } from "../../../config/config";
import axios, { AxiosResponse } from "axios";
import RestaurantMemberSignupStore from "./RestaurantMemberSignupStore";
import AddressModalStore from "../modal/AddressModalStore";
import { PlusOutlined } from '@ant-design/icons';
import { TweenOneGroup } from 'rc-tween-one';
import TextArea from "antd/lib/input/TextArea";
import AddressModal from "../modal/AddressModal";
import moment from "moment";
import { inject, observer } from "mobx-react";
import ModalStore from "../../../stores/ModalStore";
import RootStore from "../../../stores/RootStore";
import { AddressData } from "react-daum-postcode";

type Props = {
  modalStore: ModalStore
}

type State = {
  [x: string] : any;
  tags: string[];
}
@inject((rootStore: RootStore) => ({
  rootStore: rootStore.routing,
  modalStore: rootStore.modalStore,
}))
@observer
export default class RestaurantMemberSignup extends React.Component <Props, State> {
  addressModalStore: AddressModalStore = new AddressModalStore();
  restaurantMemberSignupStore: RestaurantMemberSignupStore = new RestaurantMemberSignupStore();
  input: React.RefObject<Input>;
  ref = React.createRef<FormInstance>();
  HEADERS = {
    'Content-Type': 'application/json'
  };

  constructor(props: Props){
    super(props);
    this.input = createRef();
  }

  showModal = () => {
    this.props.modalStore.setVisible(true, this.onOk);
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

  onOk = () => {   
    this.addressModalStore.setVisible(false);
  }
  
  onIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.restaurantMemberSignupStore.setId(e.target.value);
  }

  handleClose = (removedTag: any) => {
    // FIXME: removedTag 타입 잡기
    const { restaurantMemberSignupStore } = this;
    const { setTags } = restaurantMemberSignupStore;
    const tags = restaurantMemberSignupStore.tags.filter(tag => tag !== removedTag);
    console.log(tags);
    setTags(tags)
  };

  showInput = () => {
    const { restaurantMemberSignupStore, input } = this;
    restaurantMemberSignupStore.setInputVisible(true);
    input.current?.focus();
  }
  
  handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.restaurantMemberSignupStore.setInputValue(e.target.value);
  }

  handleInputConfirm = () => {
    // FIXME: 값이 1개씩 밀려서 저장됨
    const { restaurantMemberSignupStore } = this;
    const { inputValue, tags, setTags, setInputValue, setInputVisible } = restaurantMemberSignupStore;
    
    if (inputValue && tags.indexOf(inputValue) === -1) {
      setTags([...tags, inputValue]);
    }
    console.log(tags);

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

  onStartTimeChange = (time:moment.Moment | null, timeString: string) => {
    console.log(time, timeString);
    this.restaurantMemberSignupStore.setRestStartTime(timeString);
  }

  onEndTimeChange = (time:moment.Moment | null, timeString: string) => {
    console.log(time, timeString);
    this.restaurantMemberSignupStore.setRestEndTime(timeString);
  }

  setAddressData = (data: AddressData) => {
    let allAddress = data.address;
    let extraAddress = "";

    if (data.addressType === "R") {
      if (data.bname !== "") {
        extraAddress += data.bname;
      }
      if (data.buildingName !== "") {
        extraAddress += extraAddress !== "" ? `, ${data.buildingName}` : data.buildingName;
      }
      allAddress += extraAddress !== "" ? ` (${extraAddress})` : "";
    }

    this.ref.current?.setFieldsValue({
      rPostNumber: data.zonecode,
      rAddress: allAddress,
    })
  }

  onFormFinish = (values: any) => {
    this.onSignup(values);
  }

  onSignup = async (values:any) => {
    // FIXME: values type 선언
    console.log(values, "signup values");
    const { restaurantMemberSignupStore } = this;
    const { tags, restStartTime, restEndTime } = restaurantMemberSignupStore;
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
          rTag: tags, // FIXME: undefiend 해결하기
          rPrice: values.rPrice,
          rParking: values.rParking,
          rStartTime: restStartTime,
          rEndTime: restEndTime,
          rRestDay: values.rRestDay, // FIXME: 배열 형태 -> string 형태로 처리
          rIntro: values.rIntro,
          resveYn: values.resveYn,
        },
        {
          headers: this.HEADERS,
        }
      )
      .then((response: AxiosResponse) => {
      })
  } 


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
          ref={this.ref}
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
            <Radio.Group value={this.restaurantMemberSignupStore.restParkingYn}>
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
            <TimePicker format="hh:mm" onChange={this.onStartTimeChange} />
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
            <TimePicker format="hh:mm" onChange={this.onEndTimeChange} />
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
            <Radio.Group value={this.restaurantMemberSignupStore.restReserveYn}>
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
        <AddressModal modalStore={this.props.modalStore} handleAddressData={this.setAddressData} />
      </>
    )
  }
}