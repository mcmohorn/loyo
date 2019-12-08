import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { userActions } from '../actions';
import { connect } from 'react-redux';

import Popup from './popup'

import {userService} from '../services/user.service'


class Home extends Component {
    constructor(props) {
        super(props);

        this.state = {
            username: '',
            password: '',
            submitted: false,
            redirect: false,
            error: null,
        };
    }

 renderRedirect = () => {
     if (this.props.redirect && this.props.redirect !== "/") {
       console.log('now redirecting to ', this.props.redirect);
       return <Redirect to={this.props.redirect} />
     }
   }


  render() {
    const { loggingIn, user } = this.props;
      const {submitted, password, username} = this.state;
    return (

        <div className="col-md-6 col-md-offset-3">
        
      Loyo, yay

            </div>

    )
  }
}
function mapStateToProps(state) {
  console.log('home page mapping state to props ... appState = ', state);
    const { loggingIn, redirect, user } = state.auth;
    return {
        user,
        loggingIn,
        redirect,
    };
}

const connected = connect(mapStateToProps)(Home);
export { connected  as HomePage};
