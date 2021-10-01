import { action, computed, makeObservable, observable } from "mobx";
import Board from "../../models/Board";
export default class BoardPageStore {
  @observable private _boardList: Array<Board> = [];

  constructor() {
    makeObservable(this);
  }

  @action.bound
  setBoardList = (boardList: Array<Board>) => {
    this._boardList = boardList;
  }

  @computed
  get boardList() {
    return this._boardList;
  }
}