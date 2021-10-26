import { Button, Col, Form, Input, Row, Radio, Select } from "antd";
import axios, { AxiosResponse } from "axios";
import { observer } from "mobx-react";
import React, { useState } from "react";
import { SERVER_URL } from "../../../../config/config";
import { useRootStore } from "../../../../hooks/StoreContextProvider";

const layout = {
  wrapperCol: { span: 18 },
};

const { Option } = Select;

const BoardEditPage: React.FC = () => {
  const [form] = Form.useForm();
  const { authStore, routing } = useRootStore();
  const [radioValue, setRadioValue] = useState<number | null>(1);
  const [bCategory, setCategory] = useState<string | null>();
  const onBoardWrite = async (values: any) => {
    console.log(values);
    const URL = `${SERVER_URL}/api/board/insert`;
    await axios
    .post(URL, 
      {
        mNo: authStore.member?.mNo,
        bType: "1",
        bCategory: "경상",
        bTitle: values.bTitle,
        bContent: values.bContent
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

  const onSelectClick = (e: any) => {
    console.log(e.target.value);
    setCategory(e.target.value);
  }

  const select = (
    <Select placeholder="카테고리" onClick={onSelectClick}>
      <Option value="서울">서울</Option>
      <Option value="경기">경기</Option>
      <Option value="인천">인천</Option>
      <Option value="강원">강원</Option>
      <Option value="경상">경상</Option>
      <Option value="전라">전라</Option>
      <Option value="충청">충청</Option>
      <Option value="제주">제주</Option>
      <Option value="해외">해외</Option>
    </Select>
  );

  const select1 = (
    <Select placeholder="카테고리" onClick={onSelectClick}>
      <Option value="데이트">데이트</Option>
      <Option value="먹방">먹방</Option>
      <Option value="골목식당">골목식당</Option>
    </Select>
  );

  const select2 = (
    <>
    </>
  )

  const onRadioChange = (e: any) => {
    console.log(radioValue, "@@");
    setRadioValue(e.target.value);
    console.log(radioValue, "##");
  }

  return ( 
    <div style={{ margin: "2%" }}>
      <Row>
        <Col span={24}>
          <h1>커뮤니티 게시판</h1>
          게시물 수정
        </Col>
      </Row>
      <Form 
        {...layout} 
        form={form} 
        name="nest-messages" 
        onFinish={onBoardWrite}
      >
        <Form.Item
          name="bType"
        >
          <Radio.Group onChange={onRadioChange} defaultValue={"1"}>
            <Radio.Button value="1">지역별</Radio.Button>
            <Radio.Button value="2">주제별</Radio.Button>
            <Radio.Button value="3">자유게시판</Radio.Button>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          name="bCategory"
        >
          {console.log(radioValue)}
          {radioValue === 1 ?
            select
            : (radioValue === 2 ? select1 : select2)
          }
        </Form.Item>
        <Form.Item name="bTitle">
          <Input placeholder={"제목을 입력해주세요."}/>
        </Form.Item>
        <Form.Item name="bContent">
          <Input.TextArea />
        </Form.Item>
        <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
          <Button type="primary" htmlType="submit">
            글쓰기
          </Button>
        </Form.Item>
      </Form> 
    </div> 
  )
}

export default observer(BoardEditPage);