import { action, computed, makeObservable, observable } from "mobx";
import Board from "../../models/Board";
export default class BoardPageStore {
  @observable private _boardList: Array<Board> = [];
  @observable private _boardDetailInfo?: Board;
  @observable private _isBoardDetail = false;
  @observable private _bNo?: string;

  constructor() {
    makeObservable(this);
  }

  @action.bound
  setBoardList = (boardList: Array<Board>) => {
    this._boardList = boardList;
  }

  @action.bound
  setBoardDetail = (isBoardDetail: boolean) => {
    this._isBoardDetail = isBoardDetail;
  }

  @action.bound
  setBoardDetailInfo = (boardDetailInfo: Board) => {
    this._boardDetailInfo = boardDetailInfo;
  }

  @action.bound
  setBNo = (bNo: string) => {
    this._bNo = bNo;
  }

  @computed
  get bNo() {
    return this._bNo;
  }

  @computed
  get boardList() {
    return this._boardList;
  }

  @computed
  get isBoardDetail() {
    return this._isBoardDetail;
  }

  @computed
  get boardDetailInfo() {
    return this._boardDetailInfo;
  }
}