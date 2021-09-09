import { action, observable, computed, makeObservable } from "mobx";

export default class ModalStore {
  @observable private _isVisible = false;
  
  constructor() {
    makeObservable(this);
  }

  @action.bound
  setVisible = (visible: boolean) => {
    this._isVisible = visible;
  }

  @action.bound
  onCancel = () => {
    this._isVisible = false;
  }

  @computed
  get isVisible() {
    return this._isVisible;
  }

}