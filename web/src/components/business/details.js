import React, {useState, useEffect} from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';

import InboxIcon from '@material-ui/icons/MoveToInbox';
import { Mail, Menu, CreditCard, LocalOffer, Delete, Add } from '@material-ui/icons';
import { AppBar, Toolbar, IconButton, Typography, ListItem, ListItemIcon, ListItemText, ListItemSecondaryAction } from '@material-ui/core';
import { businessActions } from '../../actions';
import { useDispatch, useSelector } from 'react-redux';



const Page = (props) => {
  const business = useSelector(state => state.business)
  const { redirect, user } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  // const classes = useStyles();
  const [state, setState] = useState({list: [], adding: false});

  // load the details for this business
  useEffect(() => dispatch(businessActions.getBusiness(props.match.id)), []);

  useEffect(() => {
    console.log('got business', business);
    if (user && user.token ) {
      
      //setState({list: JSON.parse(businesses)})
    }
  }, [business]);

 return (
   <div>
       <Typography>{business.name}</Typography>
   </div>
 );


};


export { Page as BusinessPage};
