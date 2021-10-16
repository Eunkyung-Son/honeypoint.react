import React, { useEffect, useState } from "react";
import { observer } from "mobx-react";
import axios, { AxiosResponse } from "axios";
import { Col, Row, Select, Space, Table, Tabs } from 'antd';
import Search from "antd/lib/input/Search";
import { SERVER_URL } from "../../config/config";
import { useRootStore } from "../../hooks/StoreContextProvider";
import BoardPageStore from "./BoardPageStore";
import BoardDetailPage from "./detail/BoardDetailPage";
import { Route, Switch } from "react-router";
import BoardPageTable from "./components/BoardPageTable";
import { autorun } from "mobx";

const { Option } = Select;
const { TabPane } = Tabs;

const BoardPage: React.FC = () => {
  const { routing, boardStore } = useRootStore();
  const [searchCondition, setSearchCondition] = useState('all');
  const [searchValue, setSearchValue] = useState('');
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setSearchValue(inputValue);
  }
  useEffect(() => {
    autorun(() => {
      setSearchValue('');
    })
  }, [boardStore.boardType]);

  const handleKeyChange = (key: string) => {
    routing.push('/board');
    boardStore.setBoardType(Number(key));
  }

  const handleSearchConditionChange = (value: string) => {
    setSearchCondition(value);
  }

  const onSearch = async (values: any) => {
    await boardStore.searchBoards(searchCondition, values);
  }

  const operations = (
    <Row>
      <Col span={24}>
        <Space>
          <Select defaultValue="all" style={{ width: 120 }} onChange={handleSearchConditionChange}>
            <Option value="all">전체</Option>
            <Option value="writer">작성자</Option>
            <Option value="title">제목</Option>
            <Option value="content">내용</Option>
          </Select>
          <Search
            placeholder="검색할 내용을 입력하세요"
            value={searchValue}
            onChange={handleChange}
            onSearch={(values, e) => onSearch(values)}
            enterButton
            style={{ width: "50px;" }}
          />
        </Space>
      </Col>
    </Row>
  );

  return (
    <div style={{ margin: "2%" }}>
      <h1>커뮤니티 게시판</h1>
      <Tabs defaultActiveKey="1" onChange={handleKeyChange} tabBarExtraContent={operations}>
        <TabPane key="1" tab="지역별"/>
        <TabPane key="2" tab="주제별"/>
        <TabPane key="3" tab="자유게시판"/>
      </Tabs>
      <Switch>
        <Route exact path="/board" component={BoardPageTable}/>
        <Route exact path="/board/:bNo" component={BoardDetailPage} />
      </Switch>
    </div>
  )
}

export default observer(BoardPage)