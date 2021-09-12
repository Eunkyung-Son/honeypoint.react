import { action, computed, makeObservable, observable } from "mobx";
import RestaurantData from "../../models/RestaurantData";

export default class RestaurantDetailStore {
  @observable private _restaurantData?:RestaurantData;

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