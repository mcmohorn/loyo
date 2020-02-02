import React, {useState, useEffect} from 'react';

import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';

import { Delete, Add } from '@material-ui/icons';
import { IconButton, ListItem, ListItemText, ListItemSecondaryAction } from '@material-ui/core';
import { businessActions } from '../../actions';
import { useDispatch, useSelector } from 'react-redux';

import NewBusinessDialog from './newBusiness';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
}));

const Businesses = (props) => {
  const businesses = useSelector(state => state.businesses.list)
  const {user } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const classes = useStyles();
  const [state, setState] = useState({list: [], adding: false});


  useEffect(() => dispatch(businessActions.getBusinesses(user)), [dispatch, user]);

  useEffect(() => {
    if (user && user.token ) {
      setState({list: JSON.parse(businesses)})
    }
  }, [businesses, user]);


const remove  = (id) => {
  dispatch(businessActions.removeBusiness(user, id))
}

const itemClicked = (id) => {
  props.history.push(`/business/${id}`)
}

const toggleForm = () => {
  setState({ adding: !state.adding, list: state.list });
}

 return (
   <div>
   <List className={classes.list}>
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
