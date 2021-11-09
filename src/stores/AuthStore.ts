import axios, { AxiosResponse } from "axios";
import { action, makeObservable, observable } from "mobx";
import { SERVER_URL } from "../config/config";
import Member from "../models/Member";
import RestaurantData from "../models/RestaurantData";
import RootStore from "./RootStore";

export default class AuthStore {
  root: RootStore;
  @observable isLoggedIn = false;
  @observable member?: Member = JSON.parse(localStorage.getItem('member')!);
  @observable mPostNumber = '';
  @observable mRoadAddress = '';
  @observable mDetailAddress = '';
  @observable restaurant?: RestaurantData = JSON.parse(localStorage.getItem('restaurant')!) ?? '';


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
    const URL = `${SERVER_URL}/api/login`;
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
        console.log("login response", response);

        if (response.data.error) {
          console.log(response.data.error);
          alert("비밀번호가 틀립니다.");
          return;
        }
        return response.data.member;
      })
      .catch((error) => {
        if (error) {
          alert('가입된 아이디가 없습니다.');
        }
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
  fetchRestaurantInfo = async () => {
    if (!this.member) return;
    const URL = `${SERVER_URL}/api/restaurantByMember/${this.member?.mNo}`;
    return await axios
      .get(URL,
        {
          headers: {
            'Content-Type': 'application/json'
          },
        }
      )
      .then((response: AxiosResponse) => {
        console.log(response);
        localStorage.setItem('restaurant', JSON.stringify(response.data.restaurant))
        this.setRestaurant(response.data.restaurant);
      })
  }

  @action.bound
  setMember = (member?: Member) => {
    this.member = member;
  }

  @action.bound
  setRestaurant = (restaurant?: RestaurantData) => {
    this.restaurant = restaurant;
  }

  @action.bound
  setIsLoggedIn = (isLoggedIn: boolean) => {
    this.isLoggedIn = isLoggedIn;
  }

  @action.bound
  setAddressData = () => {
    const fullAddress = this.member?.mAddress;
    const splitAddress = fullAddress?.split(', ');
    if (!splitAddress) return;
    this.setPostNumber(splitAddress[0]);
    var mergeAddress = (`${splitAddress[1]}, ${splitAddress[2]}`);
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