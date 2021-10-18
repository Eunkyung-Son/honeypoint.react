import { action, computed, makeObservable, observable } from "mobx";
export default class RestaurantMemberSignupStore {
  @observable private _id = '';
  @observable private _email = '';
  @observable private _isDuplicated = false;
  @observable private _isEmailDuplicated = false;
  @observable private _tags: string[] = [];
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
  setInputValue = (inputValue: string) => {
    this._inputValue = inputValue;
  }

  @action.bound
  setEmail = (email: string) => {
    this._email = email;
  }

  @action.bound
  setEmailDuplicated = (isDuplicated: boolean) => {
    this._isEmailDuplicated = isDuplicated;
  }

  @computed
  get tags() {
    return this._tags;
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

  @computed
  get email() {
    return this._email;
  }

  @computed
  get isEmailDuplicated() {
    return this._isEmailDuplicated;
  }
  
}