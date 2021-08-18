import { RouterStore } from "mobx-react-router";
import AuthStore from "./AuthStore";
import LoginStore from "./LoginStore";
import ModalStore from "./ModalStore";
class RootStore {
	routing: RouterStore;
	authStore: AuthStore;
	loginStore: LoginStore;
	modalStore: ModalStore;

	constructor() {
		this.routing = new RouterStore();
		this.authStore = new AuthStore(this);
		this.loginStore = new LoginStore(this);
		this.modalStore = new ModalStore(this);
	}
}

export default RootStore;