import axios, { AxiosResponse } from "axios";
import { action, computed, makeObservable, observable } from "mobx";
import { Moment } from "moment";
import { SERVER_URL } from "../../../config/config";
import GeneralSignupData from "../../../models/GeneralSignupData";

export default class GerneralMemberSignupStore {
  @observable private _id = '';
  @observable private _email = '';
  @observable private _isIdDuplicated = false;
  @observable private _isEmailDuplicated = false;

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
          alert('회원가입이 완료되었습니다.');
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
  setIsIdDuplicated = (isDuplicated: boolean) => {
    this._isIdDuplicated = isDuplicated;
  }

  @action.bound
  setEmail = (email: string) => {
    this._email = email;
  }

  @action.bound
  setEmailDuplicated = (isDuplicated: boolean) => {
    this._isEmailDuplicated = isDuplicated;
  }

  @computed
  get id() {
    return this._id;
  }

  @computed
  get isIdDuplicated() {
    return this._isIdDuplicated;
  }

  @computed
  get email() {
    return this._email;
  }

  @computed
  get isEmailDuplicated() {
    return this._isEmailDuplicated;
  }
}