import React, { Component, useState } from 'react';
import { Redirect, Link } from 'react-router-dom';
import { userActions } from '../actions';
import { connect, useDispatch } from 'react-redux';

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import {Grid} from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Person from '@material-ui/icons/Person';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
// import styles from './styles'

const useStyles = makeStyles(theme => ({
    paper: {
      marginTop: theme.spacing(8),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    avatar: {
      margin: theme.spacing(1),
      backgroundColor: theme.palette.secondary.main,
    },
    form: {
      width: '100%', // Fix IE 11 issue.
      marginTop: theme.spacing(1),
    },
    submit: {
      margin: theme.spacing(3, 0, 2),
    },
  }));

  const Copyright = () => {
    return (
      <Typography variant="body2" color="textSecondary" align="center">
        {'Copyright © '}
        <Link color="inherit" href="https://material-ui.com/">
            Loyo
        </Link>{' '}
        {new Date().getFullYear()}
        {'.'}
      </Typography>
    );
  }


const Register = (props) => {
    const classes = useStyles();
    const dispatch = useDispatch();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [submitted, setSubmitted] = useState(false);


    const handleSubmit = (e) => {
        e.preventDefault();
        
        setSubmitted(true);

        if (username && password && name) {
          dispatch(userActions.register({ name, username, password}));
        }
    }

    const renderRedirect = () => {
        console.log('rendering redirect and ', props.redirect);
        if (props.redirect && props.redirect !== '/register') {
          console.log('redirecting from login page to ', props.redirect);
          return <Redirect to={props.redirect} />
        }
      }
   
  
    return (
      <Container component="main" maxWidth="xs">
          {renderRedirect()}
        <CssBaseline />
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <Person />
          </Avatar>
          <Typography component="h1" variant="h5">
            Create Account
          </Typography>
          <form className={classes.form} noValidate>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              onChange={(e) => setName(e.target.value)}
              name="name"
              label="Full Name"
              id="name"
              autoComplete="current-name"
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              onChange={(e) => setUsername(e.target.value)}
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              onChange={(e) => setPassword(e.target.value)}
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={handleSubmit}
            >
              Create Account
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link to="login" variant="body2">
                  {"Already have an account? Log In"}
                </Link>
              </Grid>
            </Grid>
          </form>
        </div>
        <Box mt={8}>
          <Copyright />
        </Box>
      </Container>
    );
  }
/*
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
*/

function mapStateToProps(state) {
    const { loggingIn, redirect } = state.auth;
    return {
        loggingIn,
        redirect
    };
}

const connected = connect(mapStateToProps)(Register);
export { connected as RegisterPage };
