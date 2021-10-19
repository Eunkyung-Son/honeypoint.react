import { action, computed, makeObservable, observable } from "mobx";
import Comment from "../../../../models/Comment";
import ModalStore from "../../../../stores/ModalStore";

export default class CommentEditModalStore extends ModalStore{
  @observable private _commentData?: Comment;

  constructor() {
    super();
    makeObservable(this);
  }

  @action.bound
  setCommentData = (commentData: Comment) => {
    this._commentData = commentData;
  }

  @computed
  get commentData() {
    return this._commentData;
  }

}