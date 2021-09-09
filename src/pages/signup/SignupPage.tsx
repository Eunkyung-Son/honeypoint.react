import React from "react";
import { Tabs } from "antd";
import GeneralMemberSignup from "./general/GeneralMemberSignup";
import RestaurantMemberSignup from "./restaurant/RestaurantMemberSignup";
import { observer } from "mobx-react";

const { TabPane } = Tabs;

// FIXME: observer 제거
const SignupPage: React.FC = observer(() => {
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
})

export default SignupPage;




