import React from "react";
import { Card, Avatar } from 'antd';
import { observer } from "mobx-react";

type Props = {
  title: string,
  description: string,
  onClick: () => void,
}

const CustomCard: React.FC<Props> = observer(({title, description, onClick}: Props) => {
  const { Meta } = Card;

  return (
    <Card
    hoverable
    onClick={onClick}
    style={{ width: 300 }}
    cover={
      <img
        alt="example"
        src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
      />
    }
  >
    <Meta
      avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
      title={title}
      description={description}
    />
  </Card>
  )
})

export default CustomCard;