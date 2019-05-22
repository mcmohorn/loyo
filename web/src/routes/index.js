import React from 'react';
import { Route } from 'react-router';
import App from '../container/App';
import RegisterPage from '../components/register';
import LoginPage from '../components/login';

export default (
  <App>
     <Route path='/register' component={RegisterPage} />
     <Route path='/login' component={LoginPage} />
  </App>
);
