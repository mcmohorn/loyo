import React, { Component, useState, useEffect } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { userActions } from '../actions';
import { connect, useSelector, useDispatch } from 'react-redux';
import Carousel from 'react-material-ui-carousel'
import { Drawer, Paper, Button } from '@material-ui/core';
import Popup from './popup'

import { makeStyles } from '@material-ui/core/styles';
import { CreditCard, Store, Loyalty, AccountBalance, SyncAlt, ShoppingCart, DirectionsWalk } from '@material-ui/icons';
import {userService} from '../services/user.service'



const items = [
  {
    name: "Link a Card",
    description: "Connect to your bank's website to automatically claim loyalty points.",
    content: () => {
      return <div>
        <CreditCard fontSize="large"/>
        <SyncAlt fontSize="large"/>
        <AccountBalance fontSize="large"/>
      </div>;
    },
  },
  {
    name: "Shop as Usual",
    description: "Earn loyalty points shopping at your favorite places with credit or debit card.",
    content: () => {
      return <div><DirectionsWalk fontSize="large"/><ShoppingCart fontSize="large"/><Store fontSize="large"/></div>
    },
  },
  {
    name: "Win",
    description: "Get rewarded for your loyalty! ",//  Business owners decide how points can be spent.
    content: () => {
      return <div><Loyalty /></div>
    },
    buttonText: "Get Started",
    onClick: () => {
      // get started
    }
}
]

const useStyles = makeStyles(theme => ({
  list: {
    width: 250,
  },
  introCarousel: {
    padding: '100px',
  },
  introItem: {
    padding: '50px'
  },
  getStartedButton: {
    'margin-top': '20px'
  }
}));

const Item = (props) =>
{
    const classes = useStyles();
    return (
        <Paper className={classes.introItem} elevation={5}>
            <h2>{props.item.name}</h2>
            <p>{props.item.description}</p>
            {props.item.content()}
            {
              props.item.buttonText ?
              <Button className={classes.getStartedButton} color="primary" variant="contained" onClick={props.item.onClick}>
                {props.item.buttonText}
            </Button>
              : null
            }
            
        </Paper>
    )
}

const Home = (props) => {
  const accounts = useSelector(state => state.accounts.list)
  const { loggingIn, redirect, user } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const classes = useStyles();
  const [state, setState] = useState({open: false, redirect: null, searching: false, list: []});
  

 return (
  <div className="col-md-6 col-md-offset-3">
  <Carousel className={classes.introCarousel} autoPlay={false} >
  {
      items.map( (item) => {
         return  <Item item={item}/>;
      })
  }
  </Carousel>

</div>
 );


};

export { Home  as HomePage};

