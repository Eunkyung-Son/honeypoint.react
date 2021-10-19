import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { observer } from "mobx-react";
import { Avatar, Button, Card, Form, Input, List, message, Space, Spin } from "antd";
import axios, { AxiosResponse } from "axios";
import InfiniteScroll from "react-infinite-scroller";
import { SERVER_URL } from "../../../config/config";
import Comment from "../../../models/Comment";
import BoardDetailStore from "./BoardDetailStore";
import CommentEditModalStore from "../edit/comment/CommentEditModalStore";
import { useRootStore } from "../../../hooks/StoreContextProvider";
import CommentEditModal from "../edit/comment/CommentEditModal";
import './BoardDetailPage.scss';


type RouteProps = {
  bNo: string;
}

const BoardDetailPage: React.FC = () => {
  const { bNo } = useParams<RouteProps>();
  const [form] = Form.useForm();
  const [boardDetailStore] = useState(() => new BoardDetailStore());
  const [commentEditModalStore] = useState(() => new CommentEditModalStore());
  const { authStore } = useRootStore();
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    // async function
    fetchBoard();
    fecthComments();
  }, [])

  const fetchBoard = async () => {
    const URL = `${SERVER_URL}/api/board/${bNo}`;
    await axios
      .get(URL, {
        headers: {
          'Content-Type': 'application/json'
        }
      }).then((response: AxiosResponse) => {
        console.log(response.data.board);
        boardDetailStore.setBoardDetailInfo(response.data.board);
      })
  }

  const fecthComments = async () => {
    boardDetailStore.fetchComments(Number(bNo));
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

  const handleCommentDelete = async (bNo: number) => {
    const URL = `${SERVER_URL}/api/comment/${bNo}`

    await axios
      .post(URL, {},
        {
          headers: {
            'Content-Type': 'application/json'
          },
        }).then((response: AxiosResponse) => {
          console.log(response);
          fecthComments();
          alert("댓글이 삭제되었습니다.");
        })
  }

  const handleBoardDelete = async (bNo: number) => {
    const URL = `${SERVER_URL}/api/board/${bNo}`

    await axios
      .post(URL, {},
        {
          headers: {
            'Content-Type': 'application/json'
          },
        }).then((response: AxiosResponse) => {
          console.log(response);
          alert("게시글이 삭제되었습니다.");
        })
  }

  const handleCommentEdit = async (comment: Comment) => {
    commentEditModalStore.setVisible(true);
    commentEditModalStore.setCommentData(comment);
  }

  const handleCommentWrite = async (values: {
    cmtContent: string
  }) => {
    if (!authStore.isLoggedIn || !authStore.member) {
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
    <div className="BoardDetailPage">
      <Card
        title={
          <>
            [{boardDetailStore.boardDetailInfo?.bCategory}] {boardDetailStore.boardDetailInfo?.bTitle}
            <br />
            {boardDetailStore.boardDetailInfo?.mNickname} | {boardDetailStore.boardDetailInfo?.bEnrollDate} | {boardDetailStore.boardDetailInfo?.bCount}
          </>
        }
        extra={authStore.member && authStore.member.mNo === boardDetailStore.boardDetailInfo?.mNo && (
          <>
            <Link to="/board">수정 </Link>
            <Link to="/board" onClick={() => handleBoardDelete(Number(bNo))}>삭제</Link>
          </>
        )}
        style={{ width: '100%' }}
        cover={[
          <>
            <p style={{ padding: '20px' }}>{boardDetailStore.boardDetailInfo?.bContent}</p>
            <hr style={{ border: "1px solid #f0f0f0" }} />
            <Form name="nest-messages" form={form} layout="inline" onFinish={handleCommentWrite}>
              <Form.Item name={['cmtContent']} style={{ width: '87%', margin: '0 8px' }}>
                <Input.TextArea placeholder="로그인 후 이용할 수 있습니다." />
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
                      {authStore.member && authStore.member.mNo === item.mNo && (
                        <>
                          <Button onClick={() => handleCommentEdit(item)}>수정</Button>
                          <Button onClick={() => handleCommentDelete(item.cmtNo)}>삭제</Button>
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
        <CommentEditModal modalStore={commentEditModalStore} boardDetailStore={boardDetailStore} />
    </div>

  )
}

export default observer(BoardDetailPage)