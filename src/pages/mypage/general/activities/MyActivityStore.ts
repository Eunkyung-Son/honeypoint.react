import { action, computed, makeObservable, observable } from "mobx";
import Board from "../../../../models/Board";
import RestaurantData from "../../../../models/RestaurantData";
import Review from "../../../../models/Review";

export default class MyActivityStore {
  @observable private _reviewList: any;
  @observable private _commmentList: any;
  @observable private _boardList?: Array<Board>;
  @observable private _favorRestaurantList?: Array<RestaurantData>

  constructor() {
    makeObservable(this);
  }
  
  @action.bound
  setReviewList = (reviewList: any) => {
    this._reviewList = reviewList;
  }

  @action.bound
  setCommentList = (commentList: any) => {
    this._commmentList = commentList;
  }

  @action.bound
  setBoardList = (boardList: Array<Board>) => {
    this._boardList = boardList;
  }

  @action.bound
  setFavorRestaurantList = (favorRestaurantList: Array<RestaurantData>) => {
    this._favorRestaurantList = favorRestaurantList;
  }

  @computed
  get reviewList() {
    return this._reviewList;
  }

  @computed
  get commentList() {
    return this._commmentList;
  }

  @computed
  get boardList() {
    return this._boardList;
  }

  @computed
  get favorRestaurantList() {
    return this._favorRestaurantList;
  }
}