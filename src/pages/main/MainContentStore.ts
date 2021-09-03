import { action, computed, observable } from "mobx";
import RestaurantMember from "../../models/RestaurantMember";

export default class MainContentPage {
  @observable private _restaurantData?: RestaurantMember;
  @observable private _restName?: string;
  @observable private _restAddress?: string;

  @action.bound
  setRestaurantData = (restaurantData: RestaurantMember) => {
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