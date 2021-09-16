import { action, computed, makeObservable, observable } from "mobx";
import RestaurantData from "../../models/RestaurantData";

export default class MainContentStore {
  @observable private _restaurantCafeData?: Array<RestaurantData>;
  @observable private _restaurantKoreanData?: Array<RestaurantData>;
  @observable private _total = 0;

  constructor() {
    makeObservable(this);
  }

  @action.bound
  setRestaurantCafeData = (_restaurantCafeData: Array<RestaurantData>) => {
    this._restaurantCafeData = _restaurantCafeData;
  }

  @action.bound
  setRestaurantKoreanData = (_restaurantKoreanData: Array<RestaurantData>) => {
    this._restaurantKoreanData = _restaurantKoreanData;
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
  get restaurantCafeData() {
    return this._restaurantCafeData;
  }

  @computed
  get restaurantKoreanData() {
    return this._restaurantKoreanData;
  }
  
}