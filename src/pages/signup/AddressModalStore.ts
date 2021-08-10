import { FormInstance } from "antd";
import { action, computed, observable } from "mobx";

export default class addressModalStore {
  @observable _formRef?: FormInstance;
  @observable private _isVisible = false;
  @observable private _isDaumPost = false;
  @observable private _fullAddress = '';
  @observable private _onOk?: () => void;

  @action.bound
  setVisible(visible: boolean, onOk?: () => void) {
    this._isVisible = visible;
    this._onOk = onOk;
  }

  @action.bound
  setIsDaumPost(isDaumPost: boolean) {
    this._isDaumPost = isDaumPost;
  }

  @action.bound
  setFullAddress(fullAddress: string) {
    this._fullAddress = fullAddress;
  }

  @action.bound
  onCancel() {
    this._isVisible = false;
  }

  @action.bound
  setFormRef(formRef: FormInstance<any> | null) {
    if (!formRef) return;
    this._formRef = formRef;
  }

  @computed
  get fullAddress() {
    return this._fullAddress;
  }

  @computed
  get isDaumPost() {
    return this._isDaumPost;
  }

  @computed
  get visible() {
    return this._isVisible;
  }

  @computed
  get formRef(){
    return this._formRef;
  }

  @computed
  get onOk(){
    return this._onOk;
  }

}