import { makeObservable } from "mobx";

export default class RestaurantReviewStore {
  constructor() {
    makeObservable(this);
  }
}