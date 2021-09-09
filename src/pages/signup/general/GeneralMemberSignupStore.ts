import { action, computed, makeObservable, observable } from "mobx";

export default class GerneralMemberSignupStore {
  @observable private _id = '';
  @observable private _isDuplicated = false;

  constructor() {
    makeObservable(this);
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