import { action, computed, makeObservable, observable } from "mobx";
import Review from "../../../models/Review";

export default class RestaurantReviewStore {
  @observable private _reviewList?: Array<Review>;
  @observable private _reviewAllCount = 0;
  @observable private _reviewGoodCount = 0;
  @observable private _reviewSosoCount = 0;
  @observable private _reviewBadCount = 0;

  constructor() {
    makeObservable(this);
  }

  @action.bound
  setReviewList = (reviewList: Array<Review>) => {
    this._reviewList = reviewList;
  }

  @action.bound
  setReviewAllCount = (reviewAllCount: number) => {
    this._reviewAllCount = reviewAllCount;
  }

  @action.bound
  setReviewGoodCount = (reviewGoodCount: number) => {
    this._reviewGoodCount = reviewGoodCount;
  }

  @action.bound
  setReviewSosoCount = (reviewSosoCount: number) => {
    this._reviewSosoCount = reviewSosoCount;
  }

  @action.bound
  setReviewBadCount = (reviewBadCount: number) => {
    this._reviewBadCount = reviewBadCount;
  }

  @computed
  get reviewGoodCount() {
    return this._reviewGoodCount;
  }

  @computed
  get reviewSosoCount() {
    return this._reviewSosoCount;
  }

  @computed
  get reviewBadCount() {
    return this._reviewBadCount;
  }

  @computed
  get reviewList() {
    return this._reviewList;
  }

  @computed
  get reviewAllCount() {
    return this._reviewAllCount;
  }
}