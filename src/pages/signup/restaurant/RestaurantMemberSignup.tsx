import React, { createRef } from "react";
import { Button, Checkbox, Col, Form, Input, Radio, Row, Select, Tag, TimePicker } from "antd";
import { SERVER_URL } from "../../../config/config";
import axios, { AxiosResponse } from "axios";
import RestaurantMemberSignupStore from "./RestaurantMemberSignupStore";
import AddressModalStore from "../modal/AddressModalStore";
import { PlusOutlined } from '@ant-design/icons';
import { TweenOneGroup } from 'rc-tween-one';
import TextArea from "antd/lib/input/TextArea";
import AddressModal from "../modal/AddressModal";
import moment from "moment";

type Props = {
  onFormSubmit: (name: string, { values, forms }: any) => void;
}

type State = {
  [x: string] : any;
  tags: string[];
}

export default class RestaurantMemberSignup extends React.Component <Props, State> {
  addressModalStore: AddressModalStore = new AddressModalStore();
  restaurantMemberSignupStore: RestaurantMemberSignupStore = new RestaurantMemberSignupStore();
  input: React.RefObject<Input>;

  constructor(props: Props){
    super(props);
    this.state = {
      tags: [],
      inputVisible: false,
      inputValue: '',
      value: 1,
    }
    this.input = createRef();
  }

  showModal = () => {
    this.addressModalStore.setVisible(true, this.onOk);
  }
  
  onIdValidation = async () => {
    const { restaurantMemberSignupStore } = this;
    const URL = `${SERVER_URL}/idCheck`;
    const params = {
      id: this.restaurantMemberSignupStore.id,
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
          restaurantMemberSignupStore.setIsDuplicated(false);
          return;
        }
        alert('중복된 아이디가 존재합니다.')
        restaurantMemberSignupStore.setIsDuplicated(true);
      })
  }

  onOk = () => {   
    this.addressModalStore.setVisible(false);
  }
  
  onIdChange = (e: any) => {
    this.restaurantMemberSignupStore.setId(e.target.value);
  }

  handleClose = (removedTag: any) => {
    const tags = this.state.tags.filter(tag => tag !== removedTag);
    console.log(tags);
    this.setState({ tags });
  };

  showInput = () => {
    this.setState({ inputVisible: true }, () => this.input.current?.focus());
  }
  
  handleInputChange = (e: any) => {
    this.setState({ inputValue: e.target.value });
  };

  handleInputConfirm = () => {
    const { inputValue } = this.state;
    // tag = [], inputValue = ''
    let { tags } = this.state;
    if (inputValue && tags.indexOf(inputValue) === -1) {
      console.log("함수실행");
      tags = [...tags, inputValue];
      // tags.push(...tags)
    }
    console.log(tags);
    this.setState({
      tags,
      inputVisible: false,
      inputValue: '',
    });
  };

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

  onRadioChange = (e: any) => {
    console.log('radio checked', e.target.value);
    this.setState({
      value: e.target.value,
    });
  };

  onChange = (time:moment.Moment | null, timeString: string) => {
    console.log(time, timeString);
  }

  onCheckChange = (checkedValues: any) => {
    console.log('checked = ', checkedValues);
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

    const { tags, inputVisible, inputValue } = this.state;
    const tagChild = tags.map(this.forMap);
    const { onFormSubmit } = this.props;

    return (
      <Form.Provider onFormFinish={onFormSubmit}>
            <Form 
              name="restaurantSignupForm"
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
              <Button onClick={this.showModal}>
                주소 검색
              </Button>
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
                  <Select.Option value="demo">Demo</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item
                name={['rTag']}
                label="태그"
                rules={[
                  {
                    required: true,
                    message: '태그를 등록해주세요.'
                  }
                ]}
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
                      <PlusOutlined /> New Tag
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
                  <Select.Option value="demo">Demo</Select.Option>
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
                <Radio.Group onChange={this.onRadioChange} value={this.state.value}>
                  <Radio value={1}>주차가능</Radio>
                  <Radio value={2}>주차불가</Radio>
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
                <TimePicker onChange={this.onChange} defaultOpenValue={moment('00:00:00', 'HH:mm:ss')} />,
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
                <TimePicker onChange={this.onChange} defaultOpenValue={moment('00:00:00', 'HH:mm:ss')} />,
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
                <Checkbox.Group style={{ width: '100%' }} onChange={this.onCheckChange}>
                  <Row>
                    <Col span={8}>
                      <Checkbox value="A">월</Checkbox>
                    </Col>
                    <Col span={8}>
                      <Checkbox value="B">화</Checkbox>
                    </Col>
                    <Col span={8}>
                      <Checkbox value="C">수</Checkbox>
                    </Col>
                    <Col span={8}>
                      <Checkbox value="D">목</Checkbox>
                    </Col>
                    <Col span={8}>
                      <Checkbox value="E">금</Checkbox>
                    </Col>
                    <Col span={8}>
                      <Checkbox value="E">토</Checkbox>
                    </Col>
                    <Col span={8}>
                      <Checkbox value="E">일</Checkbox>
                    </Col>
                    <Col span={8}>
                      <Checkbox value="E">없음</Checkbox>
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
                <Radio.Group onChange={this.onRadioChange} value={this.state.value}>
                  <Radio value={1}>예약가능</Radio>
                  <Radio value={2}>예약불가</Radio>
                </Radio.Group>
              </Form.Item>
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