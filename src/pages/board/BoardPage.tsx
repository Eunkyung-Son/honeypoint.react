import { observer } from "mobx-react";
import { Table, Tabs } from 'antd';
import Search from "antd/lib/input/Search";


type Props = {

}

const BoardPage:React.FC<Props> = (props: Props) => {

  const { TabPane } = Tabs;

  const callback = (key: any) => {
    console.log(key);
  }

  const onSearch = () => {

  }

  const dataSource = [
    {
      key: '1',
      category: 'Mike',
      title: 32,
      author: '10 Downing Street',
      date: '10/10'
    },
    {
      key: '2',
      category: 'John',
      title: 42,
      author: '10 Downing Street',
      date: '10/20'
    },
  ];
  
  const columns = [
    {
      title: '카테고리',
      dataIndex: 'category',
      key: 'category',
    },
    {
      title: '제목',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: '작성자',
      dataIndex: 'author',
      key: 'author',
    },
    {
      title: '날짜',
      dataIndex: 'date',
      key: 'date'
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
            dataSource={dataSource} 
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