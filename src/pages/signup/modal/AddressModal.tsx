import React from "react";
import { observer } from "mobx-react";
import { Modal } from "antd";
import DaumPostcode, { AddressData } from "react-daum-postcode";
import AddressModalStore from "./AddressModalStore";

type Props = {
  modalStore: AddressModalStore;
  handleAddressData: (data: AddressResponse) => void;
};

export type AddressResponse = {
  zoneCode: string,
  address: string,
}
@observer
export default class AddressModal extends React.Component<Props> {
  onClose = (data: AddressData) => {
    const { modalStore, handleAddressData } = this.props;
    handleAddressData(this.parsingAddressData(data));
    modalStore.setVisible(false);
  }

  parsingAddressData = (data: AddressData) => {
    let address = data.address;
    let extraAddress = "";

    if (data.addressType === "R") {
      if (data.bname !== "") {
        extraAddress += data.bname;
      }
      if (data.buildingName !== "") {
        extraAddress += extraAddress !== "" ? `, ${data.buildingName}` : data.buildingName;
      }
      address += extraAddress !== "" ? ` (${extraAddress})` : "";
    }

    return {
      address,
      zoneCode: data.zonecode
    }
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
    const { isVisible, onCancel } = modalStore;

    return (
      <Modal
        visible={isVisible}
        width={width}
        onCancel={onCancel}
      >
        <DaumPostcode
          width={width}
          height={height}
          style={modalStyle}
          autoClose
          onComplete={this.onClose}
        />
      </Modal>
    );
  }
}

