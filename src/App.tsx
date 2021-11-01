
import React from 'react';
import { Route, Switch } from 'react-router-dom';
import './pages/MainPage'
import MainPage from './pages/MainPage';
import LoginPage from './pages/login/LoginPage'
import SignupPage from './pages/signup/SignupPage';
import './App.scss';
import './styles.css';

const App: React.FC = () => {
  return (
      <Switch>
        <Route path='/login' component={LoginPage} />
        <Route path='/signup' component={SignupPage} />
        <Route path='/' component={MainPage} />
      </Switch>
  );
}

export default App;
