import React from "react"
import { observer } from "mobx-react";
import { Button, Form, Modal, Space } from 'antd';
import TextArea from "antd/lib/input/TextArea";
import BoardDetailStore from "../../detail/BoardDetailStore";
import CommentEditModalStore from "./CommentEditModalStore";
import { SERVER_URL } from "../../../../config/config";
import axios, { AxiosResponse } from "axios";

type Props = {
  modalStore: CommentEditModalStore,
  boardDetailStore?: BoardDetailStore,
}

const CommentEditModal:React.FC<Props> = ({ modalStore, boardDetailStore }) => {
  const { isVisible, onCancel } = modalStore;

  const onCommentEdit = async (values: {
    cmtContent: string
  }) => {
    const URL =`${SERVER_URL}/api/comment/update`;
    await axios
      .post(URL,
        {
          ...modalStore.commentData,
          cmtContent: values.cmtContent
        },
        {
          headers: {
            'Content-Type': 'application/json'
          },
        }
      ).then((response: AxiosResponse) => {
        modalStore.setCommentData(response.data.comment);
        modalStore.setVisible(false);
        if (!modalStore.commentData?.bNo) return;
        boardDetailStore?.fetchComments(modalStore.commentData?.bNo);
      })
  }

  return (
    <Modal
      visible={isVisible}
      onCancel={onCancel}
      destroyOnClose={true}
      title={'댓글 수정하기'}
      footer={null}
    >
      <Form
        onFinish={onCommentEdit}
        initialValues={modalStore.commentData}
      >
        <Form.Item
          name={['cmtContent']}
        >
          <TextArea
            showCount 
            maxLength={400}
            placeholder={'주문하신 메뉴는 어떠셨나요? 식당 분위기와 서비스도 궁금해요!'}
          />
        </Form.Item>
        <div className="ant-modal-footer">
          <Space>
            <Button type="default" onClick={onCancel}>
              닫기
            </Button>
            <Button type="primary" htmlType="submit">
              수정하기
            </Button> 
          </Space>
        </div>
      </Form>
    </Modal>
  )
}

export default observer(CommentEditModal)