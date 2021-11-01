import { Col, Row } from "antd";
import axios, { AxiosResponse } from "axios";
import { observer } from "mobx-react";
import { useEffect, useState } from "react";
import { RouteComponentProps, useParams } from "react-router-dom";
import CustomCard from "../../components/CustomCard";
import { SERVER_URL } from "../../config/config";
import RestaurantMoreStore from "./RestaurantMoreStore";
import './RestaurantMorePage.scss';

type RouteProps = {
  type: string
}

interface Props extends RouteComponentProps<RouteProps> {

}

const RestaurantMorePage: React.FC<Props> = (props: Props) => {

  const { type } = useParams<RouteProps>();
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

  const handleClick = (rNo: number) => {
    props.history.push(`/detail/${rNo}`)
  }

  useEffect(() => {
    getRestaurantInfo();
  }, [])

  return (
    <div className="RestaurantMorePage">
      <h2 style={{textAlign: "left", color: "#1890ff", marginLeft: "23px"}}>{`"${type}" 카테고리 전체`}</h2>
      <Row justify="start" align="top" gutter={[ 24, 24 ]}>
        {restaurantMoreStore.restaurantData?.length && restaurantMoreStore.restaurantData?.reduce((total, data, idx) => {
          const el = (
            <Col span={8}>
              <CustomCard
                onClick={() => handleClick(data.rNo)}
                key={data.rNo}
                title={data.rName}
                description={data.rAddress}
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