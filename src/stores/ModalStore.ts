import { action, observable } from "mobx";
import RootStore from "./RootStore";

export default class ModalStore {
  root: RootStore;

  constructor(root: RootStore) {
    this.root = root;
  }
  @observable isVisible = false;
  @observable onOk?: () => void;

  @action.bound
  setVisible(visible: boolean, onOk?: () => void) {
    this.isVisible = visible;
    this.onOk = onOk;
  }

  @action.bound
  onCancel() {
    this.isVisible = false;
  }

}