import { action, computed, makeObservable, observable } from "mobx";
import Board from "../../../models/Board";
import Comment from "../../../models/Comment";

export default class BoardDetailStore {
  @observable private _commentList: Array<Comment> = [];
  @observable private _boardDetailInfo?: Board;

  constructor() {
    makeObservable(this);
  }

  @action.bound
  setCommentList = (commentList: Array<Comment>) => {
    this._commentList = commentList;
  }

  @action.bound
  setBoardDetailInfo = (boardDetailInfo: Board) => {
    this._boardDetailInfo = boardDetailInfo;
  }

  @computed
  get commentList() {
    return this._commentList;
  }

  @computed
  get boardDetailInfo() {
    return this._boardDetailInfo;
  }
}