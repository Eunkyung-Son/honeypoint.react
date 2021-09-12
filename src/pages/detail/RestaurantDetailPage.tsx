import axios, { AxiosResponse } from "axios";
import { observer } from "mobx-react";
import { useEffect, useState } from "react";
import { RouteComponentProps, useParams } from "react-router-dom";
import { SERVER_URL } from "../../config/config";
import RestaurantDetailStore from "./RestaurantDetailStore";

type RouteProps = {
  rNo: string
}

interface Props extends RouteComponentProps<RouteProps> {

}

const RestaurantDetailPage: React.FC<Props> = observer((props: Props) => {
  const [restaurantDetailStore] = useState(() => new RestaurantDetailStore());
  const { rNo } = useParams<RouteProps>();

  const URL = `${SERVER_URL}/api/restaurant/${rNo}`;

  const restDetailInfo = async () => {
    console.log(rNo);
    // const params = {
    //   restaurantType: "한식"
    // }

    await axios
      .get(URL, {
        headers: {
          'Content-Type': 'application/json'
        },
        // params: {
        //   ...params
        // }
      })
      .then((response: AxiosResponse) => {
        restaurantDetailStore.setRestaurantData(response.data.restaurant);
    })
  }

  useEffect(() => {
    restDetailInfo();
  }, [])

  return (
    <>
      {restaurantDetailStore.restaurantData?.rNo}
    </>
  )
})

export default RestaurantDetailPage;