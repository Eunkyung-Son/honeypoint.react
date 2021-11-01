import { Table, Tabs } from "antd";
import axios, { AxiosResponse } from "axios";
import { observer } from "mobx-react";
import { useEffect, useState } from "react";
import { SERVER_URL } from "../../../../config/config";
import { useRootStore } from "../../../../hooks/StoreContextProvider";
import MyActivityStore from "./MyActivityStore";

const { TabPane } = Tabs;

const MyActivityPage: React.FC = () => {
  // FIXME: 내가 쓴 리뷰의 레스토랑, 내가 쓴 댓글의 게시글, 내가 쓴 게시글
  const { authStore } = useRootStore();
  const [myActivityStore] = useState(() => new MyActivityStore());
  const columns = [
    {
      title: '닉네임',
      dataIndex: ["gnrlMember", 'mNickname'],
      key: 'mNickname' 
    },
    {
      title: '내용',
      dataIndex: 'revCn',
      key: 'revCn'
    },
    {
      title: '작성일',
      dataIndex: 'revDate',
      key: 'revDate'
    },
    {
      title: '평점',
      dataIndex: 'score',
      key: 'score'
    }
  ];

  const boardColumns = [
    {
      title: '카테고리',
      dataIndex: 'bCategory',
      key: 'bCategory'
    },
    {
      title: '내용',
      dataIndex: 'bContent',
      key: 'bContent'
    },
    {
      title: '작성일',
      dataIndex: 'bEnrollDate',
      key: 'bEnrollDate'
    },
    {
      title: '제목',
      dataIndex: 'bTitle',
      key: 'bTitle'
    },
    {
      title: '닉네임',
      dataIndex: 'mNickname',
      key: 'mNickname'
    }
  ]

  const commentColumns = [
    {
      title: '내용',
      dataIndex: 'cmtContent',
      key: 'cmtContent'
    },
    {
      title: '닉네임',
      dataIndex: 'mNickname',
      key: 'mNickname'
    },
    {
      title: '작성일',
      dataIndex: 'cmtEnrollDate',
      key: 'cmtEnrollDate'
    }
  ]

  const favorRestaurantColumns = [
    {
      title: '가게이름',
      dataIndex: 'rName',
      key: 'rName'
    }
  ]

  useEffect(() => {
    fetchMyActivities();
    fetchMyFavorRestaurant();
  }, [])

  const fetchMyActivities = async () => {
    const URL = `${SERVER_URL}/api/member/activities/${authStore.member?.mNo}`;
    const params = {
      fetchMyComment: true,
      fetchMyReview: true,
      fetchMyBoard: true
    }

    await axios
      .get(URL, {
        headers: {
          'Content-Type': 'application/json'
        },
        params: {
          ...params
        }
      })
      .then((response: AxiosResponse) => {
        const { setReviewList, setBoardList, setCommentList } = myActivityStore;
        console.log(response);
        // FIXME: 페치받은 데이터에서 rNo를 뽑아서 새로 페치받고 테이블에 뿌려야 할지...?
        setReviewList(response.data.reviewList);
        setBoardList(response.data.boardList);
        setCommentList(response.data.commentList);
      })
  }

  const fetchMyFavorRestaurant = async () => {
    const URL = `${SERVER_URL}/api/favors/${authStore.member?.mNo}`
    const params = {
      fetchRestaurants: true
    }

    await axios
      .get(URL, {
        headers: {
          'Content-Type': 'application/json'
        },
        params: {
          ...params
        }
      })
      .then((response: AxiosResponse) => {
        myActivityStore.setFavorRestaurantList(response.data.restaurants);
      })
  }


  return (
    <div className="card-container">
      <Tabs type="card">
        <TabPane tab="내가 작성한 게시글" key="1">
          <Table
            columns={boardColumns} 
            dataSource={myActivityStore.boardList} 
          />
        </TabPane>
        <TabPane tab="내가 작성한 댓글" key="2">
          <Table
            columns={commentColumns} 
            dataSource={myActivityStore.commentList} 
          />
        </TabPane>
        <TabPane tab="내가 작성한 리뷰" key="3">
          <Table
            columns={columns} 
            dataSource={myActivityStore.reviewList} 
          />
        </TabPane>
        <TabPane tab="내가 찜한 레스토랑" key="4">
          <Table
            columns={favorRestaurantColumns}
            dataSource={myActivityStore.favorRestaurantList}
          />
        </TabPane>
      </Tabs>
    </div>
  )
}

export default observer(MyActivityPage)