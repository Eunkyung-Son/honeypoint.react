import { observer } from "mobx-react";
import { useEffect } from "react";
import { Modal } from "antd";
import RestaurantShareModalStore from "./RestaurantShareModalStore";
import kakao from "../../../images/kakao.png";
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
        description: '#리액트 #카카오 #공유버튼',
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
        {
          title: '앱으로 보기',
          link: {
            mobileWebUrl: window.location.href,
            webUrl: window.location.href,
          },
        },
      ],
    })
  }

  const { isVisible, onCancel } = modalStore;

  return (
    <Modal
      visible={isVisible}
      onCancel={onCancel}
      destroyOnClose={true}
      title={'공유하기'}
    >
      <div className="kakao-share-button" onClick={sendKakaoMessage}>
        <img src={kakao} alt="kakao-share-icon" style={{width: "50px", height: "50px"}} />
        <p style={{fontWeight: "bold"}}>카카오톡</p>
      </div>
    </Modal>
  )
}

export default observer(RestaurantShareModal)