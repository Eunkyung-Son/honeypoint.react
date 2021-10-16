import React, { useEffect } from 'react';
import { useRootStore } from "../../../hooks/StoreContextProvider";
import { observer } from "mobx-react";
import { Table } from 'antd';
import { autorun } from 'mobx';

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

interface BoardPageTableProps {

}

const BoardPageTable: React.FC<BoardPageTableProps> = () => {
  const { boardStore, routing } = useRootStore();
  useEffect(() => {
    const init = async () => {
      boardStore.setBoardType(1);
      await boardStore.fetchBoards();
    }
    init();
  }, [])

  useEffect(() => {
    autorun(() => {
      boardStore.fetchBoards();
    })
  }, [boardStore.boardType]);
  
  return (
    <Table
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