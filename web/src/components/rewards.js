import React, { Component, useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import { Mail, Menu, CreditCard, LocalOffer } from '@material-ui/icons';
import { AppBar, Toolbar, IconButton, Typography } from '@material-ui/core';
import { userActions, accountActions } from '../actions';
import { useDispatch, useSelector } from 'react-redux';

const useStyles = makeStyles(theme => ({
  list: {
    width: 250,
  },

}));

const RewardsList = (props) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { loggingIn, redirect, user } = useSelector(state => state.auth);
  const [state, setState] = React.useState({ open: false, redirect: null, balances: {} });
  useEffect(() => dispatch(userActions.getTransactions(user)), []);

  useEffect(() => {
    if (user && user.token) {
      setState({ balances: user.balances })
    }
  }, [user]);
  const rewardList = user && state && state.balances ? (
    <List>
      {
        Object.keys(state.balances).map((b, i) => {
          return (<ListItem button key={`${i}_reward_opt`} >
            <ListItemText primary={state.balances[b].business ? state.balances[b].business.name : ""} secondary={state.balances[b].amount} onClick={() => itemClicked(b)}/>
          </ListItem>);
        })
      }
    </List>
  ) : null;

  const itemClicked = (id) => {
    props.history.push(`/business/${id}`)
  }

  const toggleMenu = (open) => event => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setState({ open });

  }

  return (<div style={{ flexGrow: 1 }}>
    {rewardList}
  </div>);

};


export { RewardsList };
