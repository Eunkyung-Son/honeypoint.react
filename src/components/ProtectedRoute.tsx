import { observer } from "mobx-react";
import { RouterStore } from "mobx-react-router";
import React, { useState } from "react";
import { Redirect, Route, RouteComponentProps, RouteProps } from "react-router-dom";
import { useRootStore } from "../hooks/StoreContextProvider";
import ProtectedRouteStore from "./ProtectedRouteStore";

interface ProtectedRouteProps extends RouteProps {
  routing?: RouterStore;
  protectedRouteStore?: ProtectedRouteStore;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = observer(({ component, render }: RouteProps) => {
  const { authStore } = useRootStore();
  const [protectedRouteStore] = useState(() => new ProtectedRouteStore());

  console.log(protectedRouteStore)
  return (
    <Route render={(props: RouteComponentProps) => {
        if(!authStore.isLoggedIn) {
            return <Redirect to='/login' />
        } 

        if(component) {
            return React.createElement(component);
        } 

        if(render) {
            return render(props);
        }
      }} 
    />
  )
})

export default ProtectedRoute