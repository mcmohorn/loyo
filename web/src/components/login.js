import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { userActions } from '../actions';
import { connect } from 'react-redux';

class Login extends Component {
    constructor(props) {
        super(props);

        // reset login status
        //console.log('logging out because we are constructing login page');
        //this.props.dispatch(userActions.logout());

        this.state = {
            username: '',
            password: '',
            submitted: false,
            redirect: false,
        };
    }

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
}
componentWillReceiveProps(nextProps) {
    console.log('receing props.redirect', nextProps.redirect);
    if (nextProps.redirect && nextProps.redirect !== this.state.redirect) {
        this.setState({ redirect: nextProps.redirect });
    }
}

handleSubmit = async(e) => {
    e.preventDefault();

    this.setState({ submitted: true });
    const { username, password } = this.state;
    const { dispatch } = this.props;
    if (username && password) {
      dispatch(userActions.login(username, password));
    }
}
renderRedirect = () => {
    if (this.state.redirect && this.state.redirect !== '/login') {
      console.log('redirecting from login page to ', this.state.redirect);
      return <Redirect to={this.state.redirect} />
    }
  }

  render() {
    const { loggingIn } = this.props;
      const {submitted, password, username} = this.state;
    return (

        <div className="col-md-6 col-md-offset-3">
        {this.renderRedirect()}
            <div className="loginBox">
                <span><span className="bold">Welcome.</span> Please login.</span>
                <form name="form" onSubmit={this.handleSubmit}>
                    <div className={'form-group' + (submitted && !username ? ' has-error' : '')}>

                        <input type="text" className="form-control" placeholder="Username" name="username" value={username} onChange={this.handleChange} />
                        {submitted && !username &&
                            <div className="red help-block">Username is required</div>
                        }
                    </div>
                    <div className={'form-group' + (submitted && !password ? ' has-error' : '')}>
                        <input type="password" placeholder="Password" className="form-control" name="password" value={password} onChange={this.handleChange} />
                        {submitted && !password &&
                            <div className="red help-block">Password is required</div>
                        }
                    </div>
                    <div className="form-group">
                        <button className="btn btn-primary">Login</button>
                        {loggingIn &&
                            <img src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==" />
                        }
                    </div>
                    <div className="newMsg">
                    New? <Link to='register'>Sign up here</Link>
                    </div>
                </form>


                </div>
            </div>

    )
  }
}
function mapStateToProps(state, ownProps) {
    const { loggingIn, redirect } = state.auth;
    return {
        loggingIn,
        redirect,
    };
}

const connectedLoginPage = connect(mapStateToProps)(Login);
export { connectedLoginPage as LoginPage };
