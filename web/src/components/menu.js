import React, {Component} from 'react';
import {Link, Redirect} from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles';

import InboxIcon from '@material-ui/icons/MoveToInbox';
import {Mail, Menu, CreditCard, LocalOffer, AccountBox, StoreMallDirectory} from '@material-ui/icons';
import {AppBar, Divider,Drawer,Toolbar, List, IconButton, Typography, Button,ListItem, ListItemText, ListItemIcon} from '@material-ui/core';

import { userActions } from '../actions';
import { connect } from 'react-redux';
const CollisionLink = React.forwardRef((props, ref) => (
  <Link innerRef={ref} {...props} />
));
const useStyles = makeStyles(theme => ({
  list: {
    width: 250,
  },
  fullList: {
    width: 'auto',
  },
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    fontFamily: 'Harlow Solid Italic Italic',
    flexGrow: 1,
  },
}));

function ListItemLink(props) {
  return <ListItem button component="a" {...props} />;
}

const LoyoMenu = (props) => {
  const classes = useStyles();
 const [state, setState] = React.useState({
   open: false,
 });

 const toggleMenu = (open) => event => {
     if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
       return;
     }
     setState({ open });

   }
   const menuOptions = ['Rewards', 'Cards', 'Businesses'];
   const menuLinks = ['rewards','accounts','businesses'];
   const menuIcons = [<LocalOffer />, <CreditCard />, <StoreMallDirectory />];
   let menuList = null;

  
  let rightSection = (<Button color="inherit" component={Link} to="/login">Login</Button>);
  if (props.user && props.user.token) {
    rightSection = (<Button color="inherit" component={Link} to="/login">Logout</Button>);
    menuList = (
      <div
          style={{width: '250px'}}
        role="presentation"
        onClick={toggleMenu(false)}
        onKeyDown={toggleMenu(false)}
      >
        <List>
          {props.user ? (
            <ListItem button key={"user_name"} to="user" component={CollisionLink}>
              <ListItemIcon>{<AccountBox />}</ListItemIcon>
              <ListItemText primary={props.user.name} />
            </ListItem>
          ) : null}
  
          {menuOptions.map((text, index) => (
            <ListItem button key={`${index}_opt`} to={menuLinks[index]} component={CollisionLink}>
              <ListItemIcon>{menuIcons[index]}</ListItemIcon>
              <ListItemText primary={text} />
           </ListItem>
          ))}
        </List>
        <Divider />
      </div>
    );

  }
  return (<div style={{flexGrow: 1}}>
  <AppBar position="static">
    <Toolbar>
      <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu" onClick={toggleMenu(true)}>
        <Menu />
      </IconButton>
      <Typography variant="h6" className={classes.title}>
        Loyo
      </Typography>
      {rightSection}
    </Toolbar>
  </AppBar>
    <Drawer open={state.open} onClose={toggleMenu(false)}>
      {menuList}
    </Drawer>
  </div>);

};

function mapStateToProps(state) {
    const { loggingIn, redirect, user } = state.auth;
    return {
        user,
        loggingIn,
        redirect,
    };
}

const connected = connect(mapStateToProps)(LoyoMenu);
export { connected  as LoyoMenu};
