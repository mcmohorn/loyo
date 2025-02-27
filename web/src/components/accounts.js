import React, {useState, useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import { Delete} from '@material-ui/icons';
import {IconButton, ListItem, ListItemText, ListItemSecondaryAction} from '@material-ui/core';
import PlaidLink from 'react-plaid-link';
import { accountActions } from '../actions';
import { useDispatch, useSelector } from 'react-redux';

const useStyles = makeStyles(theme => ({
  list: {

  },
  fullList: {
    width: 'auto',
  },
  root: {
    flexGrow: 1,
  },
  title: {
    flexGrow: 1,
  },
}));

const Accounts = (props) => {
  const accounts = useSelector(state => state.accounts.list)
  const { user } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const classes = useStyles();
  const [state, setState] = useState({open: false, redirect: null, searching: false, list: []});
  const handleOnSuccess = (token, metadata) => {
   dispatch(accountActions.linkAccount(user,token, metadata.account_id))
}

  useEffect(() => dispatch(accountActions.getAccounts(user)), [user, dispatch]);

  useEffect(() => {
    if (user && user.token ) {
      setState({list: JSON.parse(accounts)})
    }
  }, [accounts, user]);

const handleOnExit = () => {
// handle the case when your user exits Link
}


const remove  = (id) => {
  dispatch(accountActions.removeAccount(user, id))
}
 React.forwardRef((props, ref) => (
   <PlaidLink innerRef={ref} {...props} />
 ));

 const plaidContent = (
   <PlaidLink
   clientName="Loyo"
   env="development"
   product={["auth", "transactions"]}
   publicKey="a75f625b338b36bc4ae96af7f36b07"
   onExit={handleOnExit}
   onSuccess={handleOnSuccess}
   >
   Add Bank Account
   </PlaidLink>
 )
 return (
   <List className={classes.list}>
   {
     state.list.map((b, i) => {
       return (<ListItem button key={`${i}_account_opt`} >
         <ListItemText primary={b.name} secondary={b.mask}/>
         <ListItemSecondaryAction>
                    <IconButton edge="end" aria-label="delete" onClick={() => {remove(b.id)}}>
                      <Delete />
                    </IconButton>
                  </ListItemSecondaryAction>
       </ListItem>);
     })
   }
     <ListItem button key={`item_new_account`}>
       <ListItemText primary={plaidContent} />
     </ListItem>
   </List>
 );


};

export { Accounts  as AccountsList};
