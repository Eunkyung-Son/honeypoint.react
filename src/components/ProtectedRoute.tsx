import { inject, observer } from "mobx-react";
import { RouterStore } from "mobx-react-router";
import React from "react";
import { Redirect, Route, RouteComponentProps, RouteProps } from "react-router-dom";
import AuthStore from "../stores/AuthStore";
import RootStore from "../stores/RootStore";
import ProtectedRouteStore from "./ProtectedRouteStore";

interface ProtectedRouteProps extends RouteProps {
  routing?: RouterStore;
  protectedRouteStore?: ProtectedRouteStore;
  authStore?: AuthStore;
}

@inject((root: RootStore) => ({
  authStore: root.authStore,
}))
@observer
// FIXME: 추 후에 store에 있는 isAuthenticated 변수를 사용하여 로그인 상태 확인하기
export default class ProtectedRoute extends React.Component<ProtectedRouteProps> {
  render() {
    return (
      <Route render={(props: RouteComponentProps) => {
          if(!this.props.authStore?.isLoggedIn) {
              return <Redirect to='/login' />
          } 

          if(this.props.component) {
              return React.createElement(this.props.component);
          } 

          if(this.props.render) {
              return this.props.render(props);
          }
      }} 
    />
  );
  }
}