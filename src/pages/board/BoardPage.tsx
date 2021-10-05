import { observer } from "mobx-react";
import { Col, Row, Select, Space, Table, Tabs } from 'antd';
import Search from "antd/lib/input/Search";
import { useEffect, useState } from "react";
import { SERVER_URL } from "../../config/config";
import axios, { AxiosResponse } from "axios";
import BoardPageStore from "./BoardPageStore";

type Props = {

}

const BoardPage:React.FC<Props> = (props: Props) => {
  const [boardPageStore] = useState(() => new BoardPageStore());
  const [searchCondition, setSearchCondition] = useState('');
  const { TabPane } = Tabs;

  const handleKeyChange = (key: string) => {
    fetchBoards(Number(key));
  }

  const onSearch = async (values: any) => {
    console.log(values);
    console.log(searchCondition);
    const URL = `${SERVER_URL}/api/searchBoards/1`;
    const params = {
      searchOption: {
        condition: searchCondition,
        value: values
      }
    };

    console.log(params);
    await axios
      .get(URL, {
        headers: {
          'Content-Type': 'application/json'
        },
        params: {
          ...params
        }
      }).then((response: AxiosResponse) => {
        console.log(response);
      })
  }

  const fetchBoards = async (boardType?: number) => {
    const URL = `${SERVER_URL}/api/boards`;
    const params = {
      ...(boardType && { boardType: boardType })
    }
    await axios
      .get(URL, {
        headers: {
          'Content-Type': 'application/json'
        },
        params: {
          ...params
        }
      }).then((response: AxiosResponse) => {
        console.log(response);
        boardPageStore.setBoardList(response.data.boards);
        console.log(boardPageStore.boardList);
      })
  }

  useEffect(() => {
    fetchBoards(1);
  }, [])
  
  const columns = [
    {
      title: '카테고리',
      dataIndex: 'bCategory',
      key: 'bCategory',
    },
    {
      title: '제목',
      dataIndex: 'bTitle',
      key: 'bTitle',
    },
    {
      title: '작성자',
      dataIndex: 'mNickname',
      key: 'mNickname',
    },
    {
      title: '날짜',
      dataIndex: 'bEnrollDate',
      key: 'bEnrollDate'
    }
  ];

  const handleSearchConditionChange = (value: string) => {
    console.log(`selected ${value}`);
    setSearchCondition(value);
  }

  const { Option } = Select;

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
            onSearch={onSearch} 
            enterButton
            style={{width: "50px;"}}
          />
        </Space>
      </Col>
    </Row>
  );


  return (
    <div style={{margin: "2%"}}>
      <h1>커뮤니티 게시판</h1>

      <Tabs defaultActiveKey="1" onChange={handleKeyChange} tabBarExtraContent={operations}>
        <TabPane tab="지역별" key="1">
          <Table 
            columns={columns} 
            dataSource={boardPageStore.boardList} 
          />
        </TabPane>
        <TabPane tab="주제별" key="2">
          <Table 
            columns={columns} 
            dataSource={boardPageStore.boardList} 
          />
        </TabPane>
        <TabPane tab="자유게시판" key="3">
          <Table 
            columns={columns} 
            dataSource={boardPageStore.boardList} 
          />
        </TabPane>
      </Tabs>
    </div>
  )
}

export default observer(BoardPage)