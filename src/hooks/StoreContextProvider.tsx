import React from 'react';
import { createBrowserHistory } from 'history';
import { syncHistoryWithStore } from 'mobx-react-router';
import { Router } from 'react-router-dom';
import RootStore from '../stores/RootStore';

const rootStore = new RootStore();
export const StoreContext = React.createContext<RootStore>(rootStore);

const browserHistory = createBrowserHistory();
const history = syncHistoryWithStore(browserHistory, rootStore.routing);

interface StoreContextProviderProps {
  children: React.ReactNode;
}

const StoreContextProvider: React.FC<StoreContextProviderProps> = (props) => {
  const { children } = props;
  return (
    <StoreContext.Provider value={rootStore}>
      <Router history={history}>
        {children}
      </Router>
    </StoreContext.Provider>
  );
};
export const useRootStore = () => React.useContext(StoreContext);
export default StoreContextProvider;
