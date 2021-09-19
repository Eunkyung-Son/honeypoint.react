import { action, computed, makeObservable, observable } from "mobx";
import RestaurantData from "../../models/RestaurantData";

export default class MainContentStore {
  @observable private _restaurantCafeData?: Array<RestaurantData>;
  @observable private _restaurantKoreanData?: Array<RestaurantData>;
  @observable private _restaurantWesternData?: Array<RestaurantData>;
  @observable private _total = 0;

  constructor() {
    makeObservable(this);
  }

  @action.bound
  setRestaurantWesternData = (restaurantWesternData: Array<RestaurantData>) => {
    this._restaurantWesternData = restaurantWesternData;
  }

  @action.bound
  setRestaurantCafeData = (restaurantCafeData: Array<RestaurantData>) => {
    this._restaurantCafeData = restaurantCafeData;
  }

  @action.bound
  setRestaurantKoreanData = (restaurantKoreanData: Array<RestaurantData>) => {
    this._restaurantKoreanData = restaurantKoreanData;
  }

  @action.bound
  setTotal = (total: number) => {
    this._total = total;
  }

  @computed
  get restaurantWesternData() {
    return this._restaurantWesternData;
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