import { action, observable } from "mobx";
import Member from "../models/Member";
import RootStore from "./RootStore";

export default class LoginStore {
  root: RootStore;
  @observable member?: Member;

  constructor(root: RootStore) {
    this.root = root;
  }

  @action.bound
  setMember = (member: Member) => {
    this.member = member;
  }
}