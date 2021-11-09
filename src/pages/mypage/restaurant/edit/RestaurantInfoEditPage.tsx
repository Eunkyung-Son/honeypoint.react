import { useEffect, useRef, useState } from "react"
import { observer } from "mobx-react"
import moment, { Moment } from "moment";
import axios, { AxiosResponse } from "axios";
import { useForm } from "antd/lib/form/Form";
import TextArea from "antd/lib/input/TextArea";
import { PlusOutlined } from '@ant-design/icons';
import { Button, Checkbox, Col, Form, Input, Radio, Row, Select, Space, Tag, TimePicker } from "antd";
import { TweenOneGroup } from "rc-tween-one";
import { SERVER_URL } from "../../../../config/config";
import AddressModal, { AddressResponse } from "../../../signup/modal/AddressModal";
import RestaurantData from "../../../../models/RestaurantData";
import { useRootStore } from "../../../../hooks/StoreContextProvider";
import RestaurantInfoEditStore from "./RestaurantInfoEditStore";
import AddressModalStore from "../../../signup/modal/AddressModalStore";

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

  const fetchRestaurantInfo = async () => {
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
    form.setFieldsValue({
      ...restaurant,
      rStartTime: strMoment,
      rEndTime: endMoment,
      rPostNumber: splitAddress[0],
      rAddress: splitAddress[1]
    })
  }

  useEffect(() => {
    const init = async () => {
      restaurantInfoEditStore.setTags(authStore.restaurant?.rTag.split(',') || []);
      await fetchRestaurantInfo();
    }
    init();
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

  const handleClose = (removedTag: string) => {
    const { setTags } = restaurantInfoEditStore;
    const tags = restaurantInfoEditStore.tags.filter(tag => tag !== removedTag);
    console.log(tags);
    setTags(tags)
  };

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

  const onRestaurantInfoEdit = async (values: {
    rName: string,
    rTel: string,
    rType: string,
    rTag: string | string[],
    rPrice: string,
    rParking: string,
    rStartTime: Moment,
    rEndTime: Moment,
    rPostNumber: string,
    rAddress: string,
    rOAddress: string,
    rRestDay: string | string[],
    rIntro: string,
    resveYn: string,
  }) => {
    console.log(values);
    const { rName, rTel, rType, rPrice, rParking, rStartTime, rEndTime,
            rPostNumber ,rAddress, rOAddress, rRestDay, rIntro, resveYn } = values;
    const URL = `${SERVER_URL}/api/restaurant/update`;
    await axios
      .post(URL,
        {
          ...authStore.restaurant,
          rName: rName,
          rTel: rTel,
          rType: rType,
          rTag: tags.join(', '),
          rPrice: rPrice,
          rParking: rParking,
          rStartTime: (rStartTime as Moment).format(timeFormat),
          rEndTime: (rEndTime as Moment).format(timeFormat),
          rAddress: `${rPostNumber}, ${rAddress}`,
          rOAddress: rOAddress,
          rRestDay: Array.isArray(rRestDay) ? (rRestDay).join(', ') : rRestDay,
          rIntro: rIntro,
          resveYn: resveYn,
        },
        {
          headers: {
            'Content-Type': 'application/json'
          },
        }
      ).then((response: AxiosResponse) => {
        if (!response.data.error) {
          alert('정보 변경에 성공하였습니다.');
          localStorage.setItem('restaurant', JSON.stringify(response.data.restaurant))
          fetchRestaurantInfo();
        }
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
        >
          <Input readOnly />
        </Form.Item>
        <Form.Item
          name={['rOAddress']}
          label="상세주소"
        >
          <Input />
        </Form.Item>
        <Form.Item
          name={['rTel']}
          label="전화번호"
        >
          <Input />
        </Form.Item>
        <Form.Item
          name={['rType']}
          label="업종카테고리"
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
        >
          <Radio.Group>
            <Radio value={'Y'}>주차가능</Radio>
            <Radio value={'N'}>주차불가</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          name={['rStartTime']}
          label="오픈시간"
        >
          <TimePicker format="hh:mm" />
        </Form.Item>
        <Form.Item
          name={['rEndTime']}
          label="마감시간"
        >
          <TimePicker format="hh:mm" />
        </Form.Item>
        <Form.Item
          name={['rRestDay']}
          label="정기휴무"
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
        >
          <TextArea rows={4} />
        </Form.Item>
        <Form.Item
          label="예약가능여부"
          name={['resveYn']}
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