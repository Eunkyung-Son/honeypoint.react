import React from "react";
import { observer } from "mobx-react";
import { Modal } from "antd";
import DaumPostcode, { AddressData } from "react-daum-postcode";
import ModalStore from "../../../stores/ModalStore";

type Props = {
  modalStore: ModalStore;
  handleAddressData: (data: AddressData) => void;
};

// FIXME: routerstore props
@observer
export default class AddressModal extends React.Component<Props> {

  handleSearchAddress = (data: AddressData) => {
    const { modalStore } = this.props;

    this.onSubmitClick();
    this.props.handleAddressData(data);
    modalStore.setVisible(false);
  };

  handleCancel = () => {
    this.props.modalStore?.setVisible(false);
  }

  handleOk = () => {    
    if (this.props.modalStore?.onOk instanceof Function) {
      this.props.modalStore?.onOk();
    }
  }

  onSubmitClick = () => {
    const submitButton = document.getElementById('submit-button');
    submitButton?.click();
  }

  render() {
    const width = 595;
    const height = 450;
    const modalStyle: React.CSSProperties = {
      position: "absolute",
      top: 0,
      left: "0px",
      zIndex: 100,
      border: "1px solid #000000",
      overflow: "hidden",
    };
    const { modalStore } = this.props;
    return (
      <Modal 
        visible={modalStore?.isVisible} 
        width={width} 
        onOk={this.handleOk}
        onCancel={this.handleCancel}
      >
        <button type="submit" id="submit-button" style={{ width: "none", height: "none"}} onClick={this.onSubmitClick}/>
        <DaumPostcode 
          width={width} 
          height={height} 
          style={modalStyle} 
          autoClose 
          onComplete={this.handleSearchAddress}
        />
      </Modal>
    );
  }
}

