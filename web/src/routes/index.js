import React from 'react';
import { Route } from 'react-router';
import App from '../container/App';

import {HomePage, LoginPage, RegisterPage} from '../components';

export default (
  <App>
    <Route exact path='/' component={HomePage} />
     <Route exact path='/register' component={RegisterPage} />
     <Route exact path='/login' component={LoginPage} />
  </App>
);
