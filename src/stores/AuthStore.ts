import axios, { AxiosResponse } from "axios";
import { action, makeObservable, observable } from "mobx";
import { SERVER_URL } from "../config/config";
import Member from "../models/Member";
import RootStore from "./RootStore";

export default class AuthStore {
  root: RootStore;
  @observable isLoggedIn = false;
  @observable member?: Member;
  
  constructor(root: RootStore) {
    makeObservable(this);
    this.root = root;
    this.init();
  }

  // FIXME: JWT 완료 후 accesstoken으로 로그인 정보 받아오기
  @action.bound
  init = () => {
    if (localStorage.getItem('memberId')) {
      this.isLoggedIn = true;
    }
  }

  @action.bound
  onLogin = async (values: {
    mId: string,
    mPwd: string,
  }) => {
    const { mId, mPwd } = values;
    const URL = `${SERVER_URL}/login`;
    const memberInfo = await axios
      .post(URL,
        {
          mId,
          mPwd
        },
        {
          headers: {
            'Content-Type': 'application/json'
          },
        }
      )
      .then((response: AxiosResponse) => {
        // TODO:아이디나 비밀번호가 틀릴 때 처리하기
        console.log(response)
        return response.data as Member;
      })
      .catch((error) => {
      });
      
    if (memberInfo) {
      localStorage.setItem('memberId', memberInfo.mId);

      this.setIsLoggedIn(true);
      this.setMember(memberInfo);
      this.root.routing.history.push('/');
    }
  };

  @action.bound
  setMember = (member: Member) => {
    this.member = member;
  }

  @action.bound
  setIsLoggedIn = (isLoggedIn: boolean) => {
    this.isLoggedIn = isLoggedIn;
  }

}