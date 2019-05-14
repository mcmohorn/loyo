import React from 'react';
import { Route, IndexRoute } from 'react-router';
import App from '../container/App';
import RegisterPage from '../components/register';

export default (
  <Route path='/' component={App}>
    <Route path='register' component={RegisterPage} />
  </Route>
);
