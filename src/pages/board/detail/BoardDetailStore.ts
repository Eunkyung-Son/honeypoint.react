import axios, { AxiosResponse } from "axios";
import { action, computed, makeObservable, observable } from "mobx";
import { SERVER_URL } from "../../../config/config";
import Board from "../../../models/Board";
import Comment from "../../../models/Comment";

export default class BoardDetailStore {
  @observable private _commentList: Array<Comment> = [];
  @observable private _boardDetailInfo?: Board;

  constructor() {
    makeObservable(this);
  }

  @action.bound
  fetchComments = async (bNo: number) => {
    const URL = `${SERVER_URL}/api/comment/${bNo}`;
    await axios
      .get(URL, {
        headers: {
          'Content-Type': 'application/json'
        }
      }).then((response: AxiosResponse) => {
        console.log(response.data.comments);
        this.setCommentList(response.data.comments);
      })
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