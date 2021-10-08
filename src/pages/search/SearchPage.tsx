import React, { useEffect, useState } from "react";
import { Row } from 'antd';
import './SearchPage.scss';
import { observer } from "mobx-react";
import { RouteComponentProps, useParams } from "react-router-dom";
import { SERVER_URL } from "../../config/config";
import axios, { AxiosResponse } from "axios";
import CustomCard from "../../components/CustomCard";
import SearchStore from "./SearchStore";

type RouteProps = {
  keyword: string
}

interface Props extends RouteComponentProps<RouteProps> {

}

const SearchPage: React.FC<Props> = observer((props: Props) => {
  const { keyword } = useParams<RouteProps>();
  const [searchStore] = useState(() => new SearchStore());
  const [total, setTotal] = useState(0);


  useEffect(() => {
    fecthRestaurantSearchList();
  }, [])

  const fecthRestaurantSearchList = async () => {
    const URL = `${SERVER_URL}/api/searchRestaurants`;
    const params = {
      keyword: keyword
    }
    await axios
      .get(URL, {
        headers: {
          'Content-Type': 'application/json'
        },
        params: {
          ...params
        }
      }).then((response: AxiosResponse) => {
        console.log(response);
        searchStore.setRestaurantData(response.data.restaurants);
        setTotal(response.data.total);
      })
  }

  const handleClick = (rNo: number) => {
    props.history.push(`/detail/${rNo}`)
  }

  return (
    <>
      <div className="content-area">
      <h2 style={{textAlign: "left", color: "#1890ff", marginLeft: "23px"}}>{`"${keyword}" 로 검색한 결과(${total})`}</h2>
      <Row justify="space-around" align="top">
        {total !== 0 && searchStore.restaurantData?.length && searchStore.restaurantData?.reduce((total, data, idx) => {
          // TODO: map으로 변경
          // if (idx > 3) return total
          const el = (
            <CustomCard
              onClick={() => handleClick(data.rNo)}
              key={data.rNo}
              title={data.rName}
              description={data.rAddress}
            />
          )
          return [...total, el];
        }, [] as React.ReactNode[])}
      </Row>
    </div>
  </>  
  )
})

export default SearchPage