import { action, computed, observable } from "mobx";
import RestaurantMember from "../../models/RestaurantMember";

export default class MainContentPage {
  @observable private _restaurantData?: Array<RestaurantMember>;
  @observable private _restName?: string;
  @observable private _restAddress?: string;
  @observable private _total = 0;

  @action.bound
  setRestaurantData = (restaurantData: Array<RestaurantMember>) => {
    this._restaurantData = restaurantData;
  }

  @action.bound
  setRestName = (restName: string) => {
    this._restName = restName;
  }

  @action.bound
  setRestAddress = (restAddress: string) => {
    this._restAddress = restAddress;
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
  get restName() {
    return this._restName;
  }

  @computed
  get restAddress() {
    return this._restAddress;
  }

  @computed
  get restaurantData() {
    return this._restaurantData;
  }
  
}