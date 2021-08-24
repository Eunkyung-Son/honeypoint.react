import { action, computed, observable } from "mobx";

export default class IdFindModalStore {
  @observable isVisible: boolean = false;

  @action.bound
  setVisible = (isVisible: boolean) => {
    this.isVisible = isVisible
  }

  @computed
  get visible() {
    return this.isVisible;
  }
}