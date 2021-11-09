import React, { useState } from "react";
import { observer } from "mobx-react";
import { Link } from "react-router-dom";
import axios, { AxiosResponse } from "axios";
import { Button, Col, Form, Input, Row, Radio, Select, RadioChangeEvent } from "antd";
import { SERVER_URL } from "../../../config/config";
import { useRootStore } from "../../../hooks/StoreContextProvider";

const layout = {
  wrapperCol: { span: 18 },
};

const { Option } = Select;

const selectOptions = [
  ['서울', '경기', '인천', '강원', '경상', '전라', '충청', '제주', '해외'],
  ['데이트', '먹방', '골목식당'],
  ['잡담', '맛집공유', '일상', '만남']
];

const BoardAddPage: React.FC = () => {
  const [form] = Form.useForm();
  const { authStore, routing } = useRootStore();
  const [radioValue, setRadioValue] = useState<string>('1');
  const onBoardWrite = async (values: {
    bType: string,
    bCategory: string,
    bTitle: string,
    bContent: string,
  }) => {
    console.log(values);
    const { bType, bCategory, bContent, bTitle } = values;
    const URL = `${SERVER_URL}/api/board/insert`;
    await axios
      .post(URL,
        {
          mNo: authStore.member?.mNo,
          bType: bType,
          bCategory: bCategory || '',
          bTitle: bTitle,
          bContent: bContent
        },
        {
          headers: {
            'Content-Type': 'application/json'
          },
        })
      .then((response: AxiosResponse) => {
        routing.push("/board");
      })
  }

  const onRadioChange = (e: RadioChangeEvent) => {
    setRadioValue(e.target.value);
  }

  return (
    <div style={{ margin: "2%" }}>
      <Row>
        <Col span={24}>
          <Link to="/board"><h1>커뮤니티 게시판</h1></Link>
        </Col>
      </Row>
      <Form
        {...layout}
        form={form}
        name="nest-messages"
        onFinish={onBoardWrite}
      >
        <Form.Item
          initialValue="1"
          name={["bType"]}
        >
          <Radio.Group onChange={onRadioChange}>
            <Radio.Button value="1">지역별</Radio.Button>
            <Radio.Button value="2">주제별</Radio.Button>
            <Radio.Button value="3">자유게시판</Radio.Button>
          </Radio.Group>
        </Form.Item>
        {['1', '2', '3'].includes(radioValue) && (
          <Form.Item
            name={["bCategory"]}
          >
            <Select placeholder="카테고리">
              {selectOptions[Number(radioValue) - 1] && selectOptions[Number(radioValue) - 1].map(option => (
                <Option value={option}>{option}</Option>
              ))}
            </Select>
          </Form.Item>
        )}
        <Form.Item name="bTitle">
          <Input placeholder={"제목을 입력해주세요."} />
        </Form.Item>
        <Form.Item name="bContent">
          <Input.TextArea style={{ height: "330px"}}/>
        </Form.Item>
        <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
          <Button type="primary" htmlType="submit">
            게시물 등록
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}

export default observer(BoardAddPage);