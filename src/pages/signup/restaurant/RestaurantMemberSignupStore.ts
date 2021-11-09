import axios, { AxiosResponse } from "axios";
import { action, computed, makeObservable, observable } from "mobx";
import { Moment } from "moment";
import { SERVER_URL } from "../../../config/config";
import RestaurantSignupData from "../../../models/RestaurantSignupData";
export default class RestaurantMemberSignupStore {
  @observable private _id = '';
  @observable private _email = '';
  @observable private _isDuplicated = false;
  @observable private _isEmailDuplicated = false;
  @observable private _tags: string[] = [];
  @observable private _inputValue = '';

  constructor() {
    makeObservable(this);
  }

  @action.bound
  onSignup = async (values: RestaurantSignupData) => {
    const URL = `${SERVER_URL}/api/restaurantInsert`;
    const timeFormat = 'hh:mm';
    try {
      await axios
        .post(URL,
          {
            mId: values.mId,
            mPwd: values.mPwd,
            mEmail: values.mEmail,
            rName: values.rName,
            rAddress: `${values.rPostNumber}, ${values.rAddress}`,
            rOAddress: values.rOAddress,
            rTel: values.rTel,
            rType: values.rType,
            rTag: this.tags.join(', '),
            rPrice: values.rPrice,
            rParking: values.rParking,
            rStartTime: (values.rStartTime as Moment).format(timeFormat),
            rEndTime: (values.rEndTime as Moment).format(timeFormat),
            rRestDay: (values.rRestDay as string[]).join(', '),
            rIntro: values.rIntro,
            resveYn: values.resveYn,
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
  setIsDuplicated = (isDuplicated: boolean) => {
    this._isDuplicated = isDuplicated;
  }

  @action.bound
  setTags = (tags: string[]) => {
    this._tags = tags;
  }

  @action.bound
  setInputValue = (inputValue: string) => {
    this._inputValue = inputValue;
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
  get tags() {
    return this._tags;
  }

  @computed
  get inputValue() {
    return this._inputValue;
  }

  @computed
  get id() {
    return this._id;
  }

  @computed
  get isDuplicated() {
    return this._isDuplicated;
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