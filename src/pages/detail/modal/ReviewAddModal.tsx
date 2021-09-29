import { observer } from "mobx-react";
import React from "react";
import { Button, Form, Modal, Radio, Space } from 'antd';
import ReviewAddModalStore from "./ReviewAddModalStore";
import TextArea from "antd/lib/input/TextArea";
import { FrownOutlined, MehOutlined, SmileOutlined } from '@ant-design/icons';
import './ReviewAddModal.scss';
import { SERVER_URL } from "../../../config/config";
import axios, { AxiosResponse } from "axios";

type Props = {
  modalStore: ReviewAddModalStore;
  rNo: string;
}

const ReviewAddModal: React.FC<Props> = ({modalStore, rNo}: Props) => {
  const { isVisible, onCancel } = modalStore;

  const onReviewWrite = async (values: {
    score: number,
    revCn: string,
  }) => {
    console.log(values);
    const URL = `${SERVER_URL}/api/review/${rNo}`;
    await axios
      .post(URL,
        {
          score: values.score,
          revCn: values.revCn
        },
        {
          headers: {
            'Content-Type': 'application/json'
          },
        }
      )
      .then((response: AxiosResponse) => {
        console.log(response);
      })
  }

  return (
    <Modal
      visible={isVisible}
      onCancel={onCancel}
      destroyOnClose={true}
      title={'리뷰 작성하기'}
      footer={null}
    >
      <Form
        onFinish={onReviewWrite}
      >
        <Form.Item
          name={['score']}
        >
          <Radio.Group>
            <Radio.Button value="1" className="radio-button">      
              <SmileOutlined style={{ fontSize: '40px', color: '#08c' }} /> 맛있다 &nbsp;
            </Radio.Button>
            <Radio.Button value="2">
              <MehOutlined type="message" style={{ fontSize: '40px', color: '#08c' }} /> 보통 &nbsp;
            </Radio.Button>
            <Radio.Button value="3">
              <FrownOutlined style={{ fontSize: '40px', color: '#08c' }} /> 별로다
            </Radio.Button>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          name={['revCn']}
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
              리뷰작성
            </Button> 
          </Space>
        </div>
      </Form>
    </Modal>
  )
}

export default observer(ReviewAddModal)