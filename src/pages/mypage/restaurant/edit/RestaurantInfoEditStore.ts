import { action, computed, makeObservable, observable } from "mobx";
import RestaurantData from "../../../../models/RestaurantData";

export default class RestaurantInfoEditStore {
  @observable private _restaurantData?: RestaurantData;
  @observable private _tags: string[] = [];
  @observable private _inputValue = '';

  constructor() {
    makeObservable(this);
  }

  @action.bound
  setRestaurantData = async (restaurantData: RestaurantData) => {
    this._restaurantData = restaurantData;
  }

  @action.bound
  setTags = (tags: string[]) => {
    this._tags = tags;
  }

  @action.bound
  setInputValue = (inputValue: string) => {
    this._inputValue = inputValue;
  }

  @computed
  get restaurantData() {
    return this._restaurantData;
  }

  @computed
  get tags() {
    return this._tags;
  }

  @computed
  get inputValue() {
    return this._inputValue;
  }
  
}