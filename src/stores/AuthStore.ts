import { action, observable } from "mobx";
import RootStore from "./RootStore";

export default class AuthStore {
  root: RootStore;
  @observable isLoggedIn = false;
  
  constructor(root: RootStore) {
    this.root = root;
    this.init();
  }

  @action.bound
  init = () => {
    if (localStorage.getItem('memberId')) {
      this.isLoggedIn = true;
    }
  }

  @action.bound
  setIsLoggedIn = (isLoggedIn: boolean) => {
    this.isLoggedIn = isLoggedIn;
  }

}