import React from "react";
import { RouterStore } from "mobx-react-router";
import { inject, observer } from "mobx-react";
import axios, { AxiosResponse } from "axios";
import { Tabs } from "antd";
import { SERVER_URL } from "../../config/config";
import RootStore from "../../stores/RootStore";
import SignupStore from "./SignupStore";
import AddressModalStore from "./modal/AddressModalStore";
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
  signupStore: SignupStore = new SignupStore();
  addressModalStore: AddressModalStore = new AddressModalStore();

  HEADERS = {
    'Content-Type': 'application/json'
  };

  //FIXME: 함수명
  callback(key: number) {
    console.log(key);
  }

  //FIXME: FormFinishInfo 타입 선언하기
  onFormFinish = async (name: string, { values, forms }: any) => {
    if (name === 'addressForm') {
      const { basicForm, addressForm } = forms;
      const extra = addressForm.getFieldValue('extraAddress');
      basicForm.setFieldsValue({
        mAddress: `${this.addressModalStore.fullAddress}, ${extra}`
      })
    }
    if (name === 'basicForm') {
      this.onSignup(values);
    }
  };

  onSignup = async (values:any) => {
    const URL = `${SERVER_URL}/memberInsert`;
    await axios
      .post(URL,
        {
          mId: values.mId,
          mName: values.mName,
          mEmail: values.mEmail,
          mNickname: values.mNickname,
          mBirthday: this.signupStore.birthday,
          mPhone: values.mPhone,
          mAddress: values.mAddress,
          mPwd: values.mPwd
        },
        {
          headers: this.HEADERS,
        }
      )
      .then((response: AxiosResponse) => {
      })
  }  
  
  render() {

    //FIXME: onChange?, Tab 컴포넌트화 하기
    return (
      <Tabs defaultActiveKey="1" centered >
        <TabPane tab="일반 회원 가입" key="1">
          <GeneralMemberSignup onFormSubmit={this.onFormFinish} />
        </TabPane>
        <TabPane tab="레스토랑 업체용 회원 가입" key="2">
          <RestaurantMemberSignup onFormSubmit={this.onFormFinish} />
        </TabPane>
      </Tabs>
    )
  }
}
