import { computed, observable } from "mobx";

export default class ProtectedRouteStore {
  @observable private _isAuthenticated = false;

  @computed
  get isAuthenticated() {
    return this._isAuthenticated;
  }
}