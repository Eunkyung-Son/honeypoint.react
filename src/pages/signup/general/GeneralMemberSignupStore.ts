import { action, computed, observable } from "mobx";

export default class GerneralMemberSignupStore {
  @observable private _id = '';
  @observable private _birthday?: number;
  @observable private _isDuplicated = false;

  @action.bound
  setId = (id: string) => {
    this._id = id;
  }

  @action.bound
  setBirthday = (birthday: number) => {
    this._birthday = birthday;
  }

  @action.bound
  setIsDuplicated = (isDuplicated: boolean) => {
    this._isDuplicated = isDuplicated;
  }

  @computed
  get birthday() {
    return this._birthday;
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