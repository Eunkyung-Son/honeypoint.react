import { action, computed, makeObservable, observable } from "mobx";
export default class IdFindModalStore {
  @observable private _isVisible: boolean = false;

  constructor() {
    makeObservable(this);
  }

  @action.bound
  setVisible = (isVisible: boolean) => {
    this._isVisible = isVisible
  }

  @computed
  get visible() {
    return this._isVisible;
  }
}