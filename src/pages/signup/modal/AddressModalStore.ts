import { makeObservable } from "mobx";
import ModalStore from "../../../stores/ModalStore";
export default class AddressModalStore extends ModalStore {
  constructor(){
    super();
    makeObservable(this);
  }
}