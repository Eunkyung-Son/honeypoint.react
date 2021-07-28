
import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import './App.css';
import './pages/MainPage'
import MainPage from './pages/MainPage';
import LoginPage from './pages/login/LoginPage'

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path='/' exact component={MainPage} />
        <Route path='/login' component={LoginPage} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
