import { RouterStore } from "mobx-react-router";
import BoardPageStore from "../pages/board/BoardPageStore";
import AuthStore from "./AuthStore";
class RootStore {
	routing: RouterStore;
	authStore: AuthStore;
	boardStore: BoardPageStore;

	constructor() {
		this.routing = new RouterStore();
		this.authStore = new AuthStore(this);
		this.boardStore = new BoardPageStore();
	}
}

export default RootStore;