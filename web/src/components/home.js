import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { userActions } from '../actions';
import { connect } from 'react-redux';

class Home extends Component {
    constructor(props) {
        super(props);

        // reset login status


        this.state = {
            username: '',
            password: '',
            submitted: false,
            redirect: false,
        };
    }

//   }

  render() {

    const { loggingIn } = this.props;
      const {submitted, password, username} = this.state;
    return (

        <div className="col-md-6 col-md-offset-3">
      Home page

            </div>

    )
  }
}
function mapStateToProps(state) {
    const { loggingIn, redirect } = state.auth;
    return {
        loggingIn,
        redirect,
    };
}

const connected = connect(mapStateToProps)(Home);
export { connected  as HomePage};
