import React from "react";
import { RouterStore } from "mobx-react-router";
import { inject, observer } from "mobx-react";
import { Tabs } from "antd";
import RootStore from "../../stores/RootStore";
import GeneralMemberSignup from "./general/GeneralMemberSignup";
import ModalStore from "../../stores/ModalStore";
import RestaurantMemberSignup from "./restaurant/RestaurantMemberSignup";

const { TabPane } = Tabs;

type Props = {
  routing: RouterStore,
  modalStore: ModalStore,
}
@inject((rootStore: RootStore) => ({
  rootStore: rootStore.routing,
  modalStore: rootStore.modalStore,
}))
@observer
export default class SignupPage extends React.Component<Props> {

  render() {
    //FIXME: onChange?, Tab 컴포넌트화 하기
    return (
      <Tabs defaultActiveKey="1" centered >
        <TabPane tab="일반 회원 가입" key="1">
          <GeneralMemberSignup modalStore={this.props.modalStore}/>
        </TabPane>
        <TabPane tab="레스토랑 업체용 회원 가입" key="2">
          <RestaurantMemberSignup modalStore={this.props.modalStore} />
        </TabPane>
      </Tabs>
    )
  }
}
