import { action, computed, makeObservable, observable } from "mobx";
import RestaurantData from "../../../../models/RestaurantData";

export default class RestaurantFileAddStore {
  @observable private _restaurantData?: RestaurantData;

  constructor() {
    makeObservable(this);
  }

  @action.bound
  setRestaurantData = async (restaurantData: RestaurantData) => {
    this._restaurantData = restaurantData;
  }

  @computed
  get restaurantData() {
    return this._restaurantData;
  }
}