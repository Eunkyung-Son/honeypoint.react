import axios, { AxiosResponse } from "axios";
import { action, computed, makeObservable, observable } from "mobx";
import { Moment } from "moment";
import { SERVER_URL } from "../../../config/config";
import GeneralSignupData from "../../../models/GeneralSignupData";

export default class GerneralMemberSignupStore {
  @observable private _id = '';
  @observable private _isDuplicated = false;

  constructor() {
    makeObservable(this);
  }

  @action.bound
  onSignup = async (values: GeneralSignupData) => {
    console.log(values, "signup values");
    const URL = `${SERVER_URL}/memberInsert`;
    try {
      await axios
        .post(URL,
          {
            mId: values.mId,
            mName: values.mName,
            mEmail: values.mEmail,
            mNickname: values.mNickname,
            mBirthday: (values.mBirthday as Moment).format("YYYYMMDD"),
            mPhone: values.mPhone,
            mAddress: `${values.mPostNumber}, ${values.mRoadAddress}, ${values.mDetailAddress}`,
            mPwd: values.mPwd
          },
          {
            headers: {
              'Content-Type': 'application/json'
            },
          }
        )
        .then((response: AxiosResponse) => {
          // alert('회원가입이 완료되었습니다.');
          // return response;
          // routing.push('/login');
        })
    } catch (e) {
      throw e;
    } finally {

    }
  }

  @action.bound
  setId = (id: string) => {
    this._id = id;
  }

  @action.bound
  setIsDuplicated = (isDuplicated: boolean) => {
    this._isDuplicated = isDuplicated;
  }

  @computed
  get id() {
    return this._id;
  }

  @computed
  get isDuplicated() {
    return this._isDuplicated;
  }
}