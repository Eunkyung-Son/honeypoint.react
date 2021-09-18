import { action, computed, makeObservable, observable } from "mobx";
import RestaurantData from "../../models/RestaurantData";

export default class RestaurantMoreStore {
  @observable private _restaurantData? :Array<RestaurantData>;

  constructor() {
    makeObservable(this);
  }

  @action.bound
  setRestaurantData = (restaurantData: Array<RestaurantData>) => {
    this._restaurantData = restaurantData;
  }

  @computed
  get restaurantData() {
    return this._restaurantData;
  }
}