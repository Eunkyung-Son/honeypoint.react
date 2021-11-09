import { Col, Row } from "antd";
import axios, { AxiosResponse } from "axios";
import { observer } from "mobx-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { SERVER_URL } from "../../config/config";
import CustomCard from "../../components/CustomCard";
import RestaurantMoreStore from "./RestaurantMoreStore";
import { useRootStore } from "../../hooks/StoreContextProvider";
import './RestaurantMorePage.scss';

type RouteProps = {
  type: string
}

const RestaurantMorePage: React.FC = () => {
  const { type } = useParams<RouteProps>();
  const { routing } = useRootStore();
  const [restaurantMoreStore] = useState(() => new RestaurantMoreStore());

  const getRestaurantInfo = async () => {
    const URL = `${SERVER_URL}/api/restaurants`;
    const params = {
      restaurantType: type
    }
    return await axios
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
        restaurantMoreStore.setRestaurantData(response.data.restaurants);
      })
  };

  useEffect(() => {
    getRestaurantInfo();
  }, [])

  const handleClick = (rNo: number) => {
    routing.history.push(`/detail/${rNo}`)
  }

  return (
    <div className="RestaurantMorePage">
      <h2 className="rest-type-text">{`"${type}" 카테고리 전체`}</h2>
      <Row justify="start" align="top" gutter={[ 24, 24 ]}>
        {restaurantMoreStore.restaurantData?.length && restaurantMoreStore.restaurantData?.reduce((total, data, idx) => {
          const el = (
            <Col span={8}>
              <CustomCard
                onClick={() => handleClick(data.rNo)}
                key={data.rNo}
                title={data.rName}
                description={data.rAddress}
                src={`${SERVER_URL}/api/file/restaurant/${data.rNo}/${data.fileIds[0]}`}
              />
            </Col>
          )
          return [...total, el];
        }, [] as React.ReactNode[])}
      </Row>
    </div>
  )
}

export default observer(RestaurantMorePage);