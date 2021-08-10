
import React from 'react';
import { Route, Switch } from 'react-router-dom';
import './App.css';
import './pages/MainPage'
import MainPage from './pages/MainPage';
import LoginPage from './pages/login/LoginPage'
import SignupPage from './pages/signup/SignupPage';

const App: React.FC = () => {
  return (
    <Switch>
      <Route path='/' exact component={MainPage} />
      <Route path='/login' component={LoginPage} />
      <Route path='/signup' component={SignupPage} />
    </Switch>
  );
}

export default App;
