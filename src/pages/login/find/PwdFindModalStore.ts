import { action, computed, makeObservable, observable } from "mobx";

export default class PwdFindModalStore {
  @observable isVisible: boolean = false;

  constructor() {
    makeObservable(this);
  }

  @action.bound
  setVisible = (isVisible: boolean) => {
    this.isVisible = isVisible
  }

  @computed
  get visible() {
    return this.isVisible;
  }
}