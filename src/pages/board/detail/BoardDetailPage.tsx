import { Avatar, Button, Card, Form, Input, List, message, Space, Spin } from "antd";
import axios, { AxiosResponse } from "axios";
import { observer } from "mobx-react";
import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroller";
import { SERVER_URL } from "../../../config/config";
import Board from "../../../models/Board";
import Comment from "../../../models/Comment";
import BoardDetailStore from "./BoardDetailStore";
import './BoardDetailPage.scss';
import { Link } from "react-router-dom";
import { useRootStore } from "../../../hooks/StoreContextProvider";

type Props = {
  bNo: string
  boardDetailInfo: Board;
}

const BoardDetailPage:React.FC<Props> = ({bNo, boardDetailInfo}: Props) => {
  const [form] = Form.useForm();
  const [boardDetailStore] = useState(() => new BoardDetailStore());
  const { authStore } = useRootStore();
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  
  useEffect(() => {
    fecthComments();
  }, [])

  const fecthComments = async () => {
    const URL = `${SERVER_URL}/api/comment/${bNo}`
    await axios
      .get(URL, {
        headers: {
          'Content-Type': 'application/json'
        }
      }).then((response: AxiosResponse) => {
        console.log(response.data.comments);
        boardDetailStore.setCommentList(response.data.comments);
      })
  }

  const handleInfiniteOnload = () => {
    const { setCommentList } = boardDetailStore;
    let { commentList } = boardDetailStore;
    setLoading(true);
    if (commentList.length > 14) {
      message.warning('Infinite List loaded all.')
      setLoading(false);
      setHasMore(false);
      return;
    }
    commentList = commentList.concat();
    setCommentList(commentList);
    setLoading(false);
  }

  const handleReviewDelete = async (bNo: number) => {

  }

  const handleReviewEdit = async (comment: Comment) => {

  }

  const handleCommentWrite = async (values: {
    cmtContent: string
  }) => {
    if (!authStore.isLoggedIn) {
      alert('로그인 후 이용해주세요.');
      return;
    }

    const URL = `${SERVER_URL}/api/comment/insert`;

    await axios
      .post(URL,
        {
          mNo: authStore.member.mNo,
          bNo: bNo,
          cmtContent: values.cmtContent,
        },
        {
          headers: {
            'Content-Type': 'application/json'
          },
        }
      )
      .then((response: AxiosResponse) => {
        fecthComments();
      })
    form.resetFields();
  }

  return (
    <>
      <Card 
        title={
          <>
            [{boardDetailInfo.bCategory}] {boardDetailInfo.bTitle}
            <br />
            {boardDetailInfo.mNickname} | {boardDetailInfo.bEnrollDate} | {boardDetailInfo.bCount}
          </>
        }
        extra={JSON.parse(localStorage.getItem('member')!).mNo === boardDetailInfo.mNo && (
          <>
            <Link to="/board">수정 </Link>
            <Link to="/board">삭제</Link>
          </>
        )}
        style={{ width: '100%' }}
        cover={[
          <>
            <p style={{padding: '20px'}}>{boardDetailInfo.bContent}</p>
            <hr style={{border: "1px solid #f0f0f0" }}/>
            <Form name="nest-messages" form={form} layout="inline" onFinish={handleCommentWrite}>
              <Form.Item name={['cmtContent']} style={{ width: '87%', margin: '0 8px' }}>
                <Input.TextArea placeholder="로그인 후 이용할 수 있습니다."/>
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  댓글 등록
                </Button>
              </Form.Item>
            </Form>
          </>
        ]}
      >
      </Card>
      <div className="demo-infinite-container">
        <InfiniteScroll
          initialLoad={false}
          pageStart={0}
          loadMore={handleInfiniteOnload}
          hasMore={!loading && hasMore}
          useWindow={false}
        >
          <List<Comment>
            className="demo-loadmore-list"
            itemLayout="horizontal"
            dataSource={boardDetailStore.commentList}
            renderItem={item => (
              <List.Item
                className="review-list"
                style={{
                  textAlign: "left"
                }}
              >
                <List.Item.Meta
                  style={{
                    cursor: 'pointer',
                  }}
                  avatar={
                    <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
                  }
                  title={(
                    <Space>
                      {`${item.mNickname} | ${item.cmtEnrollDate}`}
                      {JSON.parse(localStorage.getItem('member')!).mNo === item.mNo && (
                        <>
                          <Button onClick={() => handleReviewEdit(item)}>수정</Button>
                          <Button onClick={() => handleReviewDelete(item.cmtNo)}>삭제</Button>
                        </>
                      )}
                    </Space>
                  )}
                  description={item.cmtContent}
                  key={item.cmtNo}
                />
              </List.Item>
            )}
          >
            {loading && hasMore && (
              <div className="demo-loading-container">
                <Spin />
              </div>
            )}
          </List>
        </InfiniteScroll>
      </div>
    </>
  )
}

export default observer(BoardDetailPage)