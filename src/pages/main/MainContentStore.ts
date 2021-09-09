import { action, computed, makeObservable, observable } from "mobx";
import RestaurantMember from "../../models/RestaurantMember";

export default class MainContentStore {
  @observable private _restaurantData?: Array<RestaurantMember>;
  @observable private _total = 0;

  constructor() {
    makeObservable(this);
  }

  @action.bound
  setRestaurantData = (restaurantData: Array<RestaurantMember>) => {
    this._restaurantData = restaurantData;
  }

  @action.bound
  setTotal = (total: number) => {
    this._total = total;
  }

  @computed
  get total() {
    return this._total;
  }

  @computed
  get restaurantData() {
    return this._restaurantData;
  }
  
}