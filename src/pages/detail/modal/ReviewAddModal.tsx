import { observer } from "mobx-react";
import React from "react";
import { Modal } from 'antd';
import ReviewAddModalStore from "./ReviewAddModalStore";
import TextArea from "antd/lib/input/TextArea";
import { FrownOutlined, MehOutlined, SmileOutlined } from '@ant-design/icons';

type Props = {
  modalStore: ReviewAddModalStore;
}

const ReviewAddModal: React.FC<Props> = observer(({modalStore}: Props) => {
  const { isVisible, onCancel } = modalStore;

  return (
    <Modal
      visible={isVisible}
      onCancel={onCancel}
      destroyOnClose={true}
      title={'리뷰 작성하기'}
    >
      <SmileOutlined style={{ fontSize: '40px', color: '#08c' }} /> 맛있다 &nbsp;
      <MehOutlined type="message" style={{ fontSize: '40px', color: '#08c' }} /> 보통 &nbsp;
      <FrownOutlined style={{ fontSize: '40px', color: '#08c' }} /> 별로다
      <TextArea 
        showCount 
        maxLength={400}
        placeholder={'주문하신 메뉴는 어떠셨나요? 식당 분위기와 서비스도 궁금해요!'}
      />
    </Modal>
  )
})

export default ReviewAddModal