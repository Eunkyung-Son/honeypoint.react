import React from "react";
import { observer } from "mobx-react";
import { Input, Modal, Form } from "antd";
import DaumPostcode, { AddressData } from "react-daum-postcode";
import AddressModalStore from "./AddressModalStore";

type Props = {
  addressModalStore: AddressModalStore;
};

@observer
export default class addressModal extends React.Component<Props> {

  handleOpenPost = () => {
    this.props.addressModalStore.setIsDaumPost(true);
  };

  handleSearchAddress = (data: AddressData) => {
    const { addressModalStore } = this.props;

    let AllAddress = data.address;
    let extraAddress = "";
    const zoneCodes = data.zonecode;

    if (data.addressType === "R") {
      if (data.bname !== "") {
        extraAddress += data.bname;
      }
      if (data.buildingName !== "") {
        extraAddress += extraAddress !== "" ? `, ${data.buildingName}` : data.buildingName;
      }
      AllAddress += extraAddress !== "" ? ` (${extraAddress})` : "";
    }

    addressModalStore.setFullAddress(`${zoneCodes}, ${AllAddress}`);
    addressModalStore.formRef?.setFieldsValue({
      postNumber: zoneCodes,
      mainAddress: data.address,
    });
    addressModalStore.setIsDaumPost(false);
  };

  handleCancel = () => {
    this.props.addressModalStore.setVisible(false);
  }

  handleOk = () => {
    const { addressModalStore } = this.props;
    const { onOk } = addressModalStore;
    addressModalStore.formRef?.submit();
    
    if (onOk instanceof Function) {
      onOk();
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
    const { addressModalStore } = this.props;
    return (
      <Modal 
        visible={addressModalStore.visible} 
        width={width} 
        onOk={this.handleOk}
        onCancel={this.handleCancel}
      >
      <Form 
        ref={(instance) => addressModalStore.setFormRef(instance)} 
        name="addressForm"
      >
        <div className="modalCell">
          <div className="cellFirst">
            <button type="button" onClick={this.handleOpenPost}>
              <span>우편번호 찾기</span>
            </button>
          </div>
          <DaumPostcode 
            width={width} 
            height={height} 
            style={modalStyle} 
            autoClose 
            onComplete={this.handleSearchAddress} 
          />
          <Form.Item name="postNumber" label="우편번호">         
            <Input readOnly/>
          </Form.Item>
          <Form.Item name="mainAddress" label="기본주소">         
            <Input readOnly/>
          </Form.Item>
          <Form.Item name="extraAddress" label="상세주소">
            <Input />
          </Form.Item>
        </div>
        </Form>
      </Modal>
    );
  }
}

