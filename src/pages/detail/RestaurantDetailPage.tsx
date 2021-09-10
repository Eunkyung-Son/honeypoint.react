import axios, { AxiosResponse } from "axios";
import { observer } from "mobx-react";
import { useEffect, useState } from "react";
import { RouteComponentProps } from "react-router-dom";
import { SERVER_URL } from "../../config/config";
import RestaurantDetailStore from "./RestaurantDetailStore";

type RouteProps = {
  rNo: string
}

interface Props extends RouteComponentProps<RouteProps> {

}

const RestaurantDetailPage: React.FC<Props> = observer((props: Props) => {
  const [restaurantDetailStore] = useState(() => new RestaurantDetailStore());

  const restDetailInfo = async () => {
    const URL = `${SERVER_URL}/api/restaurant/${props.match.params.rNo}`;
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
        console.log(response);
        console.log(response.data.restaurant);
        // const { restaurantData, setRestaurantData } = restaurantDetailStore;
        restaurantDetailStore.setRestaurantData(response.data.restaurant);
        console.log(restaurantDetailStore.restaurantData);

    })
  }

  useEffect(() => {
    restDetailInfo();
  }, [])

  return (
    <div style={{color: "black"}}>
      {restaurantDetailStore.restaurantData?.rRating}
      dff
    </div>
  )
})

export default RestaurantDetailPage;