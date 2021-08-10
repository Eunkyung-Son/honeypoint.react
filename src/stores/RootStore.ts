import { RouterStore } from "mobx-react-router";
import AuthStore from "./AuthStore";
class RootStore {
	routing: RouterStore;
	authStore: AuthStore;

	constructor() {
		this.routing = new RouterStore();
		this.authStore = new AuthStore(this);
	}
}

export default RootStore;