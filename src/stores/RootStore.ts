import { RouterStore } from "mobx-react-router";

class RootStore {
	routing: RouterStore;

	constructor() {
		this.routing = new RouterStore();
	}
}

export default RootStore;