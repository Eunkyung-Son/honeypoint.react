import React, { useEffect, useState } from "react";
import { Route, Switch } from "react-router";
import { observer } from "mobx-react";
import { Col, Row, Select, Space, Tabs } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import Search from "antd/lib/input/Search";
import BoardDetailPage from "./detail/BoardDetailPage";
import BoardPageTable from "./components/BoardPageTable";
import { useRootStore } from "../../hooks/StoreContextProvider";

const { Option } = Select;
const { TabPane } = Tabs;

const BoardPage: React.FC = () => {
  const { routing, boardStore, authStore } = useRootStore();
  const [searchCondition, setSearchCondition] = useState('all');
  const [searchValue, setSearchValue] = useState('');

  useEffect(() => {
    const init = async () => {
      boardStore.setBoardType(1);
      await boardStore.fetchBoards();
    };
    init();
  }, [])

  const handleSearchValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setSearchValue(inputValue);
  }

  const handleKeyChange = async (key: string) => {
    if (routing.location.pathname !== '/board') {
      routing.push('/board');
    }
    boardStore.setBoardType(Number(key));
    await boardStore.fetchBoards();
  }

  const handleSearchConditionChange = (value: string) => {
    setSearchCondition(value);
  }

  const handleBoardClick = () => {
    if (!authStore.member) {
      alert('로그인 후 이용하실 수 있습니다.');
      return;
    }
    routing.push('/board/add');
  }

  const onSearch = async (values: string) => {
    await boardStore.searchBoards(searchCondition, values)
    .then((res) => {
      routing.push("/board");
    });
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
            onChange={handleSearchValueChange}
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
      <Row>
        <Col span={12}>
          <h1>커뮤니티 게시판</h1>
        </Col>
        <Col span={12}>
          <p 
            onClick={handleBoardClick} 
            style={{textAlign: "right"}}
          >
            게시물 등록 <EditOutlined />
          </p>
        </Col>
      </Row>
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