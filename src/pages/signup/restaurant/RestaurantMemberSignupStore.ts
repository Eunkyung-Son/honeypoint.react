import { action, computed, observable } from "mobx";
export default class RestaurantMemberSignupStore {
  @observable private _id = '';
  @observable private _isDuplicated = false;
  @observable private _tags: string[] = [];
  @observable private _inputVisible = false;
  @observable private _inputValue = '';
  @observable private _value = 1;
  @observable private _restType?: string;
  @observable private _restPrice?: string;
  @observable private _restRestday?: any;
  @observable private _restParkingYn?: string;
  @observable private _restStartTime?: string;
  @observable private _restEndTime?: string;
  @observable private _restReserveYn?: string;

  @action.bound
  setId = (id: string) => {
    this._id = id;
  }

  @action.bound
  setIsDuplicated = (isDuplicated: boolean) => {
    this._isDuplicated = isDuplicated;
  }

  @action.bound
  setTags = (tags: string[]) => {
    this._tags = tags;
  }

  @action.bound
  setInputVisible = (inputVisible: boolean) => {
    this._inputVisible = inputVisible;
  }

  @action.bound
  setInputValue = (inputValue: string) => {
    this._inputValue = inputValue;
  }

  @action.bound
  setValue = (value: number) => {
    this._value = value;
  }

  @action.bound
  setRestType = (restType: string) => {
    this._restType = restType;
  }

  @action.bound
  setRestPrice = (restPrice: string) => {
    this._restPrice = restPrice;
  }

  @action.bound
  setRestRestday = (restRestday: any) => {
    this._restRestday = restRestday;
  }

  @action.bound
  setRestParkingYn = (restParkingYn: string) => {
    this._restParkingYn = restParkingYn;
  }

  @action.bound
  setRestStartTime = (restStartTime: string) => {
    this._restStartTime = restStartTime;
  }

  @action.bound
  setRestEndTime = (restEndTime: string) => {
    this._restEndTime = restEndTime;
  }

  @action.bound
  setRestReserveYn = (restReserveYn: string) => {
    this._restReserveYn = restReserveYn;
  }

  @computed
  get restReserveYn() {
    return this._restReserveYn;
  }

  @computed
  get restStartTime() {
    return this._restStartTime;
  }

  @computed
  get restEndTime() {
    return this._restEndTime;
  }

  @computed
  get restParkingYn() {
    return this._restParkingYn;
  }

  @computed
  get restRestday() {
    return this._restRestday;
  }

  @computed
  get restPrice() {
    return this._restPrice;
  }

  @computed
  get restType() {
    return this._restType;
  }

  @computed
  get tags() {
    return this._tags;
  }

  @computed
  get inputVisible() {
    return this._inputVisible;
  }

  @computed
  get inputValue() {
    return this._inputValue;
  }

  @computed
  get value() {
    return this._value;
  }

  @computed
  get id() {
    return this._id;
  }

  @computed
  get isDuplicated() {
    return this._isDuplicated;
  }
}