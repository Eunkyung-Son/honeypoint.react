import { useParams } from "react-router-dom";

type RouteProps = {
  bNo: string
}

const BoardDetailPage:React.FC = () => {
  const { bNo } = useParams<RouteProps>();
  return (
    <>
      {bNo}
    </>
  )
}

export default BoardDetailPage