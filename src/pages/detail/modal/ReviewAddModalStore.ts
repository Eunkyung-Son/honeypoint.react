import { action, computed, makeObservable, observable } from "mobx";
import ModalStore from '../../../stores/ModalStore'


export default class ReviewAddModalStore extends ModalStore{
  constructor() {
    super();
    makeObservable(this);
  }
}