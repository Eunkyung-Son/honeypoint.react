import { Route, Switch } from "react-router-dom"
import RestaurantDetailPage from "../detail/RestaurantDetailPage";
import RestaurantMorePage from "../more/RestaurantMorePage";
import SearchPage from "../search/SearchPage";
import MainContentPage from "./MainContentPage";

const MainContent: React.FC = () => {
  return (
    <Switch>
      <Route exact path='/' component={MainContentPage} />
      <Route exact path='/more' component={RestaurantMorePage} />
      <Route exact path='/detail/:rNo' component={RestaurantDetailPage} />
      <Route exact path='/search/:keyword' component={SearchPage} />
    </Switch>
  )
}

export default MainContent;