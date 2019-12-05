import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { userActions } from '../actions';
import { connect } from 'react-redux';


class Register extends Component {
  state = {
      username: '',
      password: '',
      name: '',
      submitted: false
  };
  componentDidMount(){

  }
  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  }

handleSubmit = async(e) => {
    e.preventDefault();

    this.setState({ submitted: true });
    const { username, password, name } = this.state;
    const { dispatch } = this.props;
    if (username && password && name) {
         dispatch(userActions.register(this.state));
      //  console.log('result is ', result);
    }
}
renderRedirect = () => {
    if (this.props.redirect) {
      return <Redirect to='/login' />
    }
  }
  render() {
    const { loggingIn } = this.props;
    const {submitted, password, username, name} = this.state;
    return (

      <div className="col-md-6 col-md-offset-3">
      {this.renderRedirect()}
          <div className="loginBox">
              <span><span className="bold"></span> Create a new account</span>
              <form name="form" onSubmit={this.handleSubmit}>
                  <div className={'form-group' + (submitted && !name ? ' has-error' : '')}>
                      <input type="text" placeholder="Name" className="form-control" name="name" value={name} onChange={this.handleChange} />
                      {submitted && !name &&
                          <div className="red help-block">Name is required</div>
                      }
                  </div>
                  <div className={'form-group' + (submitted && !username ? ' has-error' : '')}>
                      <input type="text" className="form-control" placeholder="Email" name="username" value={username} onChange={this.handleChange} />
                      {submitted && !username &&
                          <div className="red help-block">Email is required</div>
                      }
                  </div>
                  <div className={'form-group' + (submitted && !password ? ' has-error' : '')}>
                      <input type="password" placeholder="Password" className="form-control" name="password" value={password} onChange={this.handleChange} />
                      {submitted && !password &&
                          <div className="red help-block">Password is required</div>
                      }
                  </div>
                  <div className="form-group">
                      <button className="btn btn-primary">Register</button>
                      {loggingIn &&
                          <img src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==" />
                      }
                  </div>
                  <div className="newMsg">
                  Already have account? <Link to='login'>Login here</Link>
                  </div>
              </form>


              </div>
          </div>
    )
  }
}

function mapStateToProps(state) {
    const { loggingIn, redirect } = state.auth;
    return {
        loggingIn,
        redirect
    };
}

const connected = connect(mapStateToProps)(Register);
export { connected as RegisterPage };
