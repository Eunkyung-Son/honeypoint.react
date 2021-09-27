import { makeObservable } from 'mobx';
import ModalStore from '../../../stores/ModalStore'

export default class RestaurantShareModalStore extends ModalStore {
  constructor() {
    super();
    makeObservable(this);
  }
}