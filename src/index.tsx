import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import RootStore from './stores/RootStore';
import reportWebVitals from './reportWebVitals';
import createBrowserHistory from 'history/createBrowserHistory';
import { Router } from 'react-router-dom';
import { Provider } from 'mobx-react';
import { syncHistoryWithStore } from 'mobx-react-router';
import 'antd/dist/antd.css'; // or 'antd/dist/antd.less'
import { ConfigProvider } from 'antd';
import koKR from "antd/lib/locale/ko_KR";


const rootStore = new RootStore();
const browserHistory = createBrowserHistory();
const history = syncHistoryWithStore(browserHistory, rootStore.routing);


ReactDOM.render(
  <React.StrictMode>
    <ConfigProvider locale={koKR}>
      <Provider {...rootStore}>
        <Router history={history}>
          <App />
        </Router>
      </Provider>
    </ConfigProvider>

  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
