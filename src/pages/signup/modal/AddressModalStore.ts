import { action, computed, observable } from "mobx";
export default class addressModalStore {
  @observable private _isVisible = false;
  @observable private _onOk?: () => void;

  @action.bound
  setVisible(visible: boolean, onOk?: () => void) {
    this._isVisible = visible;
    this._onOk = onOk;
  }

  @action.bound
  onCancel() {
    this._isVisible = false;
  }

  @computed
  get visible() {
    return this._isVisible;
  }

  @computed
  get onOk(){
    return this._onOk;
  }

}