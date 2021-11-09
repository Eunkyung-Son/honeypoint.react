import { observer } from "mobx-react";
import { useEffect } from "react";
import { Button, Col, Modal, Row } from "antd";
import { CopyOutlined } from '@ant-design/icons';
import RestaurantShareModalStore from "./RestaurantShareModalStore";
import kakao from "../../../images/kakao.png";
import { FacebookShareButton, FacebookIcon } from "react-share";
import "./RestaurantShareModal.scss";


type Props = {
  modalStore: RestaurantShareModalStore;
}

declare global {
  interface Window {
    Kakao: any;
  }
}

const RestaurantShareModal: React.FC<Props> = ({modalStore}: Props) => {

  useEffect(() => {
    async function initialize() {
      window.Kakao.init(process.env.REACT_APP_KAKAO_KEY);
      console.log(window.Kakao.isInitialized());
    }
    initialize();
  }, [])

  const sendKakaoMessage = () => {
    window.Kakao.Link.sendDefault({
      objectType: 'feed',
      content: {
        title: '맛집',
        description: '#허니포인트 #맛집검색',
        imageUrl: 'IMAGE_URL',
        link: {
          mobileWebUrl: window.location.href,
          webUrl: window.location.href,
        },
      },
      social: {
        likeCount: 77,
        commentCount: 55,
        sharedCount: 333,
      },
      buttons: [
        {
          title: '웹으로 보기',
          link: {
            mobileWebUrl: window.location.href,
            webUrl: window.location.href,
          },
        },
      ],
    })
  }

  const doCopy = (text: string) => {
    // 흐름 1.
    if (!document.queryCommandSupported("copy")) {
      return Modal.error({
        title: '복사하기가 지원되지 않는 브라우저입니다.'
      })
    }

    // 흐름 2.
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.top = '';
    textarea.style.left = '';
    textarea.style.position = "fixed";

    // 흐름 3.
    document.body.appendChild(textarea);
    // focus() -> 사파리 브라우저 서포팅
    textarea.focus();
    // select() -> 사용자가 입력한 내용을 영역을 설정할 때 필요
    textarea.select();
    // 흐름 4.
    document.execCommand("copy");
    // 흐름 5.
    document.body.removeChild(textarea);
    Modal.success({
      title: '클립보드에 복사되었습니다.'
    })
  };

  const { isVisible, onCancel } = modalStore;

  const currentUrl = window.location.href;

  return (
    <Modal
      visible={isVisible}
      onCancel={onCancel}
      destroyOnClose={true}
      title={'공유하기'}
    >
      <Row>
        <Col span={2} />
        <Col span={4}>
          <div onClick={sendKakaoMessage}>
            <img src={kakao} alt="kakao-share-icon"  className="kakao-share-button" style={{width: "50px", height: "50px"}} />
            <p style={{fontWeight: "bold", marginTop: "5px"}}>카카오톡</p>
          </div>
        </Col>
        <Col span={2} />
        <Col span={2} />
        <Col span={4}>
          <FacebookShareButton url={currentUrl}>
            <FacebookIcon size={48} borderRadius={10}></FacebookIcon>
            <p style={{fontWeight: "bold"}}>페이스북</p>
          </FacebookShareButton>
        </Col>
        <Col span={2} />
        <Col span={2} />
        <Col span={4}>
          <div onClick={() => doCopy(`${currentUrl}`)}>
            <CopyOutlined style={{ fontSize: "50px"}}/>
            <p style={{fontWeight: "bold", marginTop: "4px"}}>복사하기</p>
          </div>
        </Col>
        <Col span={2} />
      </Row>
    </Modal>
  )
}

export default observer(RestaurantShareModal)