import axios, { AxiosResponse } from "axios";
import { action, makeObservable, observable } from "mobx";
import { SERVER_URL } from "../config/config";
import Member from "../models/Member";
import RootStore from "./RootStore";

export default class AuthStore {
  root: RootStore;
  @observable isLoggedIn = false;
  @observable member?: Member = JSON.parse(localStorage.getItem('member')!);
  @observable mPostNumber = '';
  @observable mRoadAddress = '';
  @observable mDetailAddress = '';

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
        console.log("login response", response);
        if (response.data.error) {
          console.log(response.data.error);
          alert("비밀번호가 틀립니다.");
          return;
        }
        return response.data.member as Member;
      })
      .catch((error) => {
      });
      
    if (memberInfo) {
      localStorage.setItem('memberId', memberInfo.mId);
      localStorage.setItem('member', JSON.stringify(memberInfo))
      this.setIsLoggedIn(true);
      this.setMember(memberInfo);
      this.setAddressData();
      this.root.routing.history.push('/');
    }
  };

  @action.bound
  setMember = (member?: Member) => {
    this.member = member;
  }

  @action.bound
  setIsLoggedIn = (isLoggedIn: boolean) => {
    this.isLoggedIn = isLoggedIn;
  }

  @action.bound
  setAddressData = () => {
    var fullAddress = this.member?.mAddress;
    var splitAddress = fullAddress?.split(', ');
    if (!splitAddress) return;
    var mergeAddress = (`${splitAddress[1]}` + `, ${splitAddress[2]}`);
    if (!splitAddress) return;
    this.setPostNumber(splitAddress[0]);
    this.setRoadAddress(mergeAddress);
    this.setDetailAddress(splitAddress[3]);
  }

  @action.bound
  setPostNumber = (mPostNumber: string) => {
    this.mPostNumber = mPostNumber;
  }

  @action.bound
  setRoadAddress = (mRoadAddress: string) => {
    this.mRoadAddress = mRoadAddress;
  }

  @action.bound
  setDetailAddress = (mDetailAddress: string) => {
    this.mDetailAddress = mDetailAddress;
  }

}