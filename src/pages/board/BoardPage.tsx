import { observer } from "mobx-react";
import { Table, Tabs } from 'antd';
import Search from "antd/lib/input/Search";
import { useEffect, useState } from "react";
import { SERVER_URL } from "../../config/config";
import axios, { AxiosResponse } from "axios";
import BoardPageStore from "./BoardPageStore";

type Props = {

}

const BoardPage:React.FC<Props> = (props: Props) => {

  const [boardPageStore] = useState(() => new BoardPageStore());
  const { TabPane } = Tabs;

  const callback = (key: any) => {
    console.log(key);
  }

  const onSearch = () => {

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

  return (
    <>
      게시판 페이지 입니다.

      <Tabs defaultActiveKey="1" onChange={callback}>
        <TabPane tab="지역별" key="1">
          <Search placeholder="input search text" onSearch={onSearch} enterButton />
          <Table 
            columns={columns} 
            dataSource={boardPageStore.boardList} 
          />
    
        </TabPane>
        <TabPane tab="주제별" key="2">
          Content of Tab Pane 2
        </TabPane>
        <TabPane tab="자유게시판" key="3">
          Content of Tab Pane 3
        </TabPane>
      </Tabs>
    </>
  )
}

export default observer(BoardPage)