import { useRootStore } from "../../../hooks/StoreContextProvider";
import { observer } from "mobx-react";
import { Table } from 'antd';

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


const BoardPageTable: React.FC = () => {
  const { boardStore, routing } = useRootStore();  
  return (
    <Table
      loading={boardStore.loading}
      columns={columns}
      dataSource={boardStore.boardList}
      onRow={(record, rowIndex) => {
        return {
          onClick: event => {
            boardStore.setBoardDetailInfo(record);
            routing.push(`/board/${record.bNo}`)
          },
        };
      }}
    />
  );
}

export default observer(BoardPageTable);