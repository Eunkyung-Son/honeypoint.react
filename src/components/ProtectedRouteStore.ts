import { computed, makeObservable, observable } from "mobx";

export default class ProtectedRouteStore {
  @observable private _isAuthenticated = false;

  constructor() {
    makeObservable(this);
  }

  @computed
  get isAuthenticated() {
    return this._isAuthenticated;
  }
}