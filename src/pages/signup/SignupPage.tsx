import React from "react";
import { RouterStore } from "mobx-react-router";
import { inject, observer } from "mobx-react";
import { Tabs } from "antd";
import RootStore from "../../stores/RootStore";
import GeneralMemberSignup from "./general/GeneralMemberSignup";
import RestaurantMemberSignup from "./restaurant/RestaurantMemberSignup";

const { TabPane } = Tabs;

type Props = {
  routing: RouterStore,
}
@inject((rootStore: RootStore) => ({
  rootStore: rootStore.routing,
}))
@observer
export default class SignupPage extends React.Component<Props> {

  render() {
    return (
      <Tabs defaultActiveKey="1" centered >
        <TabPane tab="일반 회원 가입" key="1">
          <GeneralMemberSignup/>
        </TabPane>
        <TabPane tab="레스토랑 업체용 회원 가입" key="2">
          <RestaurantMemberSignup/>
        </TabPane>
      </Tabs>
    )
  }
}
