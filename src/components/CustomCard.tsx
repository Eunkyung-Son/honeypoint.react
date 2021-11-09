import React from "react";
import { Card, Avatar } from 'antd';
import { observer } from "mobx-react";
import './CustomCard.scss';

type Props = {
  title: string,
  description: string,
  src: string,
  onClick: () => void,
}

const CustomCard: React.FC<Props> = observer(({ src, title, description, onClick }: Props) => {
  const { Meta } = Card;

  return (
    <Card
      className="CustomCard"
      hoverable
      onClick={onClick}
      cover={
        <img
          alt="example"
          src={src}
          style={{ height: "280px" }}
        />
      }
    >
      <Meta
        title={title}
        description={description}
      />
    </Card>
  )
})

export default CustomCard;