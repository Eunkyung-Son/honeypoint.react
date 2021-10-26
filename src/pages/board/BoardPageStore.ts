import axios, { AxiosResponse } from "axios";
import { action, computed, makeObservable, observable } from "mobx";
import { SERVER_URL } from "../../config/config";
import Board from "../../models/Board";
export default class BoardPageStore {
  @observable private _boardList: Array<Board> = [];
  @observable private _boardDetailInfo?: Board;
  @observable private _isBoardDetail = false;
  @observable private _bNo?: string;
  @observable private _loading = false;

  @observable private _boardType = 1;

  constructor() {
    makeObservable(this);
  }

  @action.bound
  async fetchBoards() {
    const { _boardType: boardType } = this
    const URL = `${SERVER_URL}/api/boards`;
    const params = {
      ...(boardType && { boardType: boardType })
    }
    this.setLoading(true);
    await axios
      .get(URL, {
        headers: {
          'Content-Type': 'application/json'
        },
        params: {
          ...params
        }
      }).then((response: AxiosResponse) => {
        console.log(response);
        this.setBoardList(response.data.boards);
        this.setLoading(false);
      })
  }

  @action.bound
  async searchBoards (searchCondition: string, searchValues: string) {
    console.log(this._boardType);
    const URL = `${SERVER_URL}/api/searchBoards/${this._boardType}`;
    const params = {
      searchOption: {
        condition: searchCondition,
        value: searchValues
      }
    };
    await axios
      .get(URL, {
        headers: {
          'Content-Type': 'application/json'
        },
        params: {
          ...params
        }
      }).then((response: AxiosResponse) => {
        this.setBoardList(response.data.boards);
      })
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

  @action.bound
  setBoardType = (boardType: number) => {
    this._boardType = boardType;
  }

  @action.bound
  setLoading = (loading: boolean) => {
    this._loading = loading;
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

  @computed
  get boardType() {
    return this._boardType;
  }

  @computed
  get loading() {
    return this._loading;
  }
}