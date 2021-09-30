import { makeObservable } from "mobx";

export default class BoardPageStore {
  constructor() {
    makeObservable(this);
  }
}