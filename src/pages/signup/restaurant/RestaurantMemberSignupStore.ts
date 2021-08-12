import { action, computed, observable } from "mobx";

export default class RestaurantMemberSignupStore {
  @observable private _id = '';
  @observable private _isDuplicated = false;

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