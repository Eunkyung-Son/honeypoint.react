import { action, computed, makeObservable, observable } from "mobx";
import Review from "../../../models/Review";
import ModalStore from '../../../stores/ModalStore'


export default class ReviewEditModalStore extends ModalStore {
  @observable private _reviewData?: Review;

  constructor() {
    super();
    makeObservable(this);
  }

  @action.bound
  setReviewData = (reviewData: Review) => {
    this._reviewData = reviewData;
  }

  @computed
  get reviewData() {
    return this._reviewData;
  }

}