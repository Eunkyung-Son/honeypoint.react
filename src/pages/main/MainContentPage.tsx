import React from "react";
import { Col, Row, Divider, Input } from 'antd';
import CustomCarousel from "../../components/CustomCarousel";
type Props = {

}
export default class MainContentPage extends React.Component<Props> {
  render() {
    const { Search } = Input;
    return (
      <>
        <Row justify="center" align="top">
          <Col span={24}>
            <div className="search-image-area">
              <div>
                <Search placeholder="검색해서 맛집을 찾아보세요!" size="large" enterButton style={{ display: 'inline-flex', justifyContent: 'center', alignItems: 'center'}}/>
              </div>
            </div>
          </Col>
        </Row>
        <Divider orientation="left">#요즘 뜨는 카페</Divider>
        <CustomCarousel/>
      </>
    )
  }
}