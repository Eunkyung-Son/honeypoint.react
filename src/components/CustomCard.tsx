import React from "react";
import { Card, Avatar } from 'antd';
import { observer } from "mobx-react";

type Props = {
  title: string,
  description: string,
}

const { Meta } = Card;
          
// const CustomCard: React.FC<Props> = ({title, description}) => {
//   return (
//     <Card
//       style={{ width: 300 }}
//       cover={
//         <img
//           alt="example"
//           src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
//         />
//       }
//     >
//       <Meta
//         avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
//         title={title}
//         description={description}
//       />
//     </Card>
//   )
// }

// export default CustomCard;

@observer
export default class CustomCard extends React.Component<Props> {
  render() {
    const { title, description } = this.props;
    return (
      <Card
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
  }
}