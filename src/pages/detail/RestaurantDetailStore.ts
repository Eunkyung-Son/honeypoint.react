import { action, computed, makeObservable, observable } from "mobx";
import Menu from "../../models/Menu";
import RestaurantData from "../../models/RestaurantData";
import Review from "../../models/Review";

export default class RestaurantDetailStore {
  @observable private _restaurantData?:RestaurantData;
  @observable private _favorCount = 0;
  @observable private _menuList?: Array<Menu>;
  @observable private _reviewCount = 0;
  @observable private _reviewList?: Array<Review>;

  constructor() {
    makeObservable(this);
  }

  @action.bound
  setReviewList = (reviewList: Array<Review>) => {
    this._reviewList = reviewList;
  }

  @action.bound
  setReviewCount = (reviewCount: number) => {
    this._reviewCount = reviewCount;
  }

  @action.bound
  setMenuList = (menuList: Array<Menu>) => {
    this._menuList = menuList;
  }

  @action.bound
  setFavorCount = (favorCount: number) => {
    this._favorCount = favorCount;
  }

  @action.bound
  setRestaurantData = (restaurantData: RestaurantData) => {
    this._restaurantData = restaurantData;
  }

  @computed
  get reviewList() {
    return this._reviewList;
  }

  @computed
  get reviewCount() {
    return this._reviewCount;
  }

  @computed
  get menuList() {
    return this._menuList;
  }

  @computed
  get favorCount() {
    return this._favorCount;
  }

  @computed
  get restaurantData() {
    return this._restaurantData;
  }
}