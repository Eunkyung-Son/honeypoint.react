import axios, { AxiosResponse } from "axios";
import { observer } from "mobx-react";
import { useEffect } from "react";
import { SERVER_URL } from "../../../../config/config";
import { useRootStore } from "../../../../hooks/StoreContextProvider";

const MyActivityPage: React.FC = () => {

  const { authStore } = useRootStore();

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
        console.log(response);
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
        console.log(response);
      })
  }


  return (
    <> 
      내 활동 내역 페이지 입니다.
    </>
  )
}

export default observer(MyActivityPage)