import { action, observable, computed, makeObservable } from "mobx";
import RestaurantData from "../../../models/RestaurantData";

export default class RestaurantMyInfoStore {
  @observable private _restaurantData?: RestaurantData;

  constructor() {
    makeObservable(this);
  }

  @action.bound
  setRestaurantData = (restaurantData: RestaurantData) => {
    this._restaurantData = restaurantData;
  }

  @computed
  get restaurantData() {
    return this._restaurantData;
  }

}