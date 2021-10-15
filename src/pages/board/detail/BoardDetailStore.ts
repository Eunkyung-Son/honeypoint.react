import { action, computed, makeObservable, observable } from "mobx";
import Comment from "../../../models/Comment";

export default class BoardDetailStore {
  @observable private _commentList: Array<Comment> = [];

  constructor() {
    makeObservable(this);
  }

  @action.bound
  setCommentList = (commentList: Array<Comment>) => {
    this._commentList = commentList;
  }

  @computed
  get commentList() {
    return this._commentList;
  }
}