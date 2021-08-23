import { RouterStore } from "mobx-react-router";
import AuthStore from "./AuthStore";
import LoginStore from "./LoginStore";
class RootStore {
	routing: RouterStore;
	authStore: AuthStore;
	loginStore: LoginStore;

	constructor() {
		this.routing = new RouterStore();
		this.authStore = new AuthStore(this);
		this.loginStore = new LoginStore(this);
	}
}

export default RootStore;