import React from 'react';
import { Route } from 'react-router';
import App from '../container/App';
import { Redirect } from 'react-router-dom';


import {HomePage, LoginPage, RegisterPage, LoyoMenu, RewardsList, AccountsList, BusinessesList, BusinessPage} from '../components';


import { useDispatch, useSelector } from 'react-redux';

// TODO fix this, it wasn't working, probably just wrap it with map state to props?
function PrivateRoute ({component: Component, auth, user, ...rest}) {
  console.log('111 private route has ', user );
  return (
    <Route
      {...rest}
      render={(props) => {
        console.log('222 props are', props);
        if (!!user && !!user.token) {
          return <Component {...props} />;
        } else {
          console.log('333 redirecting to login because tried to access unprotected route', auth, props)
          return <Redirect to={{pathname: '/login', state: {from: props.location}}} />;
        }
      }
      }
 
    />
  )
}

export default (
  <App>
    <LoyoMenu />
     <Route exact path='/register' component={RegisterPage} />
     <Route exact path='/login' component={LoginPage} />
     <Route exact path='/' component={HomePage} />
     <Route exact path='/rewards' component={RewardsList} />
     <Route exact path='/accounts' component={AccountsList} />
     <Route exact path='/businesses' component={BusinessesList} />
     <Route exact path='/business/:id' component={BusinessPage} />
  </App>
);
