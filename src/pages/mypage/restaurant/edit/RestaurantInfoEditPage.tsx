import { observer } from "mobx-react"
import { useEffect, useRef, useState } from "react"
import { useForm } from "antd/lib/form/Form";
import { Button, Checkbox, Col, Form, Input, Radio, Row, Select, Space, Tag, TimePicker } from "antd";
import TextArea from "antd/lib/input/TextArea";
import { PlusOutlined } from '@ant-design/icons';
import axios, { AxiosResponse } from "axios";
import { TweenOneGroup } from "rc-tween-one";
import { SERVER_URL } from "../../../../config/config";
import AddressModal, { AddressResponse } from "../../../signup/modal/AddressModal";
import { useRootStore } from "../../../../hooks/StoreContextProvider";
import RestaurantInfoEditStore from "./RestaurantInfoEditStore";
import AddressModalStore from "../../../signup/modal/AddressModalStore";
import moment, { Moment } from "moment";
import RestaurantData from "../../../../models/RestaurantData";

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

const timeFormat = 'hh:mm';

const RestaurantInfoEditPage: React.FC = () => {
  const [form] = useForm();
  const { authStore } = useRootStore();
  const [restaurantInfoEditStore] = useState(() => new RestaurantInfoEditStore());
  const input = useRef<Input | null>(null);
  const [isShowTagInput, setIsShowTagInput] = useState(false);
  const addressModalStore = new AddressModalStore();

  useEffect(() => {
    const init = async () => {
      console.log(authStore.restaurant);
      restaurantInfoEditStore.setTags(authStore.restaurant?.rTag.split(',') || []);

      if (!authStore.member) return;
      const URL = `${SERVER_URL}/api/restaurantByMember/${authStore.member?.mNo}`;
      const restaurant = await axios
        .get(URL,
          {
            headers: {
              'Content-Type': 'application/json'
            },
          }
        )
        .then((response: AxiosResponse) => {
          const restaurant = response.data.restaurant as RestaurantData;
          return restaurant;
        })
      const [strHour, strMin] = restaurant.rStartTime.split(':');
      const [endHour, endMin] = restaurant.rEndTime.split(':');
      const strMoment = moment().minute(Number(strMin)).hour(Number(strHour));
      const endMoment = moment().minute(Number(endMin)).hour(Number(endHour));
      const fullAddress = restaurant.rAddress;
      const splitAddress = fullAddress?.split(', ');
      console.log(splitAddress);
      form.setFieldsValue({
        ...restaurant,
        rStartTime: strMoment,
        rEndTime: endMoment,
        rPostNumber: splitAddress[0],
        rAddress: splitAddress[1]
      })
    }
    init();

    // form.setFieldsValue({
    //   ...authStore.restaurant,
    //   rStartTime: moment(authStore.restaurant?.rStartTime),
    //   rEndTime: moment(authStore.restaurant?.rEndTime)
    // })
  }, [])

  const showModal = () => {
    addressModalStore.setVisible(true);
  }

  const setAddressData = (data: AddressResponse) => {
    const { zoneCode, address } = data;
    form.setFieldsValue({
      rPostNumber: zoneCode,
      rAddress: address,
    })
  }

  const handleClose = (removedTag: any) => {
    // FIXME: removedTag 타입 잡기
    const { setTags } = restaurantInfoEditStore;
    const tags = restaurantInfoEditStore.tags.filter(tag => tag !== removedTag);
    console.log(tags);
    setTags(tags)
  };

  // FIXME: input ref 지정한게 null로 되는 이유 찾아봐야함
  const showTagInput = () => {
    setIsShowTagInput(true);
    input.current?.focus();
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    restaurantInfoEditStore.setInputValue(e.target.value);
  }

  const handleInputConfirm = () => {
    const { inputValue, tags, setTags, setInputValue } = restaurantInfoEditStore;

    if (inputValue && tags.indexOf(inputValue) === -1) {
      setTags([...tags, inputValue]);
    }
    setIsShowTagInput(false);
    setInputValue('');
  }

  const onComplete = (e: any) => {
    e.target.style = '';
  }

  const forMap = (tag: any) => {
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

  const onRestaurantInfoEdit = async (values: any) => {
    console.log(values);
    const URL = `${SERVER_URL}/api/restaurant/update`;
    // console.log((values.rRestDay));
    await axios
      .post(URL,
        {
          rName: values.rName,
          rTel: values.rTel,
          rType: values.rType,
          rTag: tags.join(', '),
          rPrice: values.rPrice,
          rParking: values.rParking,
          rStartTime: (values.rStartTime as Moment).format(timeFormat),
          rEndTime: (values.rEndTime as Moment).format(timeFormat),
          rAddress: `${values.rPostNumber}, ${values.rAddress}`,
          rOAddress: values.rOAddress,
          // rRestDay: (values.rRestDay).join(', '),
          rIntro: values.rIntro,
          resveYn: values.resveYn,
        },
        {
          headers: {
            'Content-Type': 'application/json'
          },
        }
      ).then((response: AxiosResponse) => {
        console.log(response);
      })
  }

  const { tags, inputValue } = restaurantInfoEditStore;
  const tagChild = tags.map(forMap);

  return (
    <>
      <Form
        name="restaurantInfoEditForm"
        {...formItemLayout}
        form={form}
        onFinish={onRestaurantInfoEdit}
      >
        <Form.Item
          name={['rName']}
          label="업체명"
        // rules={[
        //   {
        //     required: true,
        //     message: '업체명을 입력해주세요.'
        //   }
        // ]}
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
              // rules={[
              //   {
              //     required: true,
              //     message: '우편번호를 입력해주세요.'
              //   }
              // ]}
              style={{ margin: 0 }}
            >
              <Input readOnly />
            </Form.Item>
            <Button>
              주소 검색
            </Button>
          </Space>
        </Form.Item>
        <Form.Item
          name={['rAddress']}
          label="주소"
        // rules={[
        //   {
        //     required: true,
        //     message: '주소를 입력해주세요.'
        //   }
        // ]}
        >
          <Input readOnly />
        </Form.Item>
        <Form.Item
          name={['rOAddress']}
          label="상세주소"
        // rules={[
        //   {
        //     required: true,
        //     message: '상세주소를 입력해주세요.'
        //   }
        // ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name={['rTel']}
          label="전화번호"
        // rules={[
        //   {
        //     required: true,
        //     message: '전화번호를 입력해주세요.'
        //   },
        //   {
        //     pattern: /^[0-9]{3}[-]+[0-9]{4}[-]+[0-9]{4}$/,
        //     message: '("-")를 포함한 핸드폰 번호를 입력해 주세요.'
        //   }
        // ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name={['rType']}
          label="업종카테고리"
        // rules={[
        //   {
        //     required: true,
        //     message: '업종카테고리를 선택해주세요.'
        //   }
        // ]}
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
        // rules={[
        //   {
        //     required: true,
        //     message: '가격대를 선택해주세요.'
        //   }
        // ]}
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
        // rules={[
        //   {
        //     required: true,
        //     message: '주차가능여부를 선택해주세요.'
        //   }
        // ]}
        >
          <Radio.Group>
            <Radio value={'Y'}>주차가능</Radio>
            <Radio value={'N'}>주차불가</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          name={['rStartTime']}
          label="오픈시간"
        // rules={[
        //   {
        //     required: true,
        //     message: '오픈시간을 선택해주세요.'
        //   }
        // ]}
        >
          <TimePicker format="hh:mm" />
        </Form.Item>
        <Form.Item
          name={['rEndTime']}
          label="마감시간"
        // rules={[
        //   {
        //     required: true,
        //     message: '마감시간을 선택해주세요.'
        //   }
        // ]}
        >
          <TimePicker format="hh:mm" />
        </Form.Item>
        <Form.Item
          name={['rRestDay']}
          label="정기휴무"
        // rules={[
        //   {
        //     required: true,
        //     message: '정기휴무일을 선택해주세요.'
        //   }
        // ]}
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
        // rules={[
        //   {
        //     required: true,
        //     message: '업체소개를 입력해주세요.'
        //   }
        // ]}
        >
          <TextArea rows={4} />
        </Form.Item>
        <Form.Item
          label="예약가능여부"
          name={['resveYn']}
        // rules={[
        //   {
        //     required: true,
        //     message: '예약여부를 선택해주세요.'
        //   }
        // ]}
        >
          <Radio.Group>
            <Radio value={'Y'}>예약가능</Radio>
            <Radio value={'N'}>예약불가</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item wrapperCol={{ ...formItemLayout.wrapperCol, offset: 8 }}>
          <Button type="primary" htmlType="submit">
            정보수정
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

export default observer(RestaurantInfoEditPage)