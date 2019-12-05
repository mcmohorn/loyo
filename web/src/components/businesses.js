import React, {useState, useEffect} from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';

import InboxIcon from '@material-ui/icons/MoveToInbox';
import { Mail, Menu, CreditCard, LocalOffer, Delete, Add } from '@material-ui/icons';
import { AppBar, Toolbar, IconButton, Typography, ListItem, ListItemIcon, ListItemText, ListItemSecondaryAction } from '@material-ui/core';
import PlaidLink from 'react-plaid-link';
import { businessActions } from '../actions';
import { useDispatch, useSelector } from 'react-redux';

import NewBusinessDialog from './newBusiness';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
}));

const Businesses = (props) => {
  const businesses = useSelector(state => state.businesses.list)
  const { redirect, user } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const classes = useStyles();
  const [state, setState] = useState({list: [], adding: false});


  useEffect(() => dispatch(businessActions.getBusinesses(user)), []);

  useEffect(() => {
    if (user && user.token ) {
      console.log('got businesses', businesses);
      setState({list: JSON.parse(businesses)})
    }
  }, [businesses]);


const remove  = (id) => {
  dispatch(businessActions.removeBusiness(user, id))
}

const itemClicked = (id) => {
  console.log('clickd', id);
  props.history.push(`/business/${id}`)
}

const toggleForm = () => {
  setState({ adding: !state.adding, list: state.list });
}

 return (
   <div>
   <List>
   {
     state.list.map((b, i) => {
       return (<ListItem button key={`${i}_business_opt`} onClick={() => itemClicked(b.id)} >
         <ListItemText primary={b.name} secondary={b.description}/>
         <ListItemSecondaryAction>
                    <IconButton edge="end" aria-label="delete" onClick={() => {remove(b.id)}}>
                      <Delete />
                    </IconButton>
                  </ListItemSecondaryAction>
       </ListItem>);
     })
   }
   <ListItem button key={`add_business_opt`} >
     <ListItemText primary={"Add Business"}/>
     <ListItemSecondaryAction>
                <IconButton edge="end" aria-label="delete" onClick={() => {toggleForm()}}>
                  <Add />
                </IconButton>
              </ListItemSecondaryAction>
   </ListItem>

   </List>
   <NewBusinessDialog open={state.adding} onClose={toggleForm}/>
   </div>
 );


};


export { Businesses  as BusinessesList};
