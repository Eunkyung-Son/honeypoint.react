import { action, computed, makeObservable, observable } from "mobx";
export default class RestaurantMemberSignupStore {
  @observable private _id = '';
  @observable private _isDuplicated = false;
  @observable private _tags: string[] = [];
  @observable private _inputVisible = false;
  @observable private _inputValue = '';

  constructor() {
    makeObservable(this);
  }

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
  get id() {
    return this._id;
  }

  @computed
  get isDuplicated() {
    return this._isDuplicated;
  }
}