import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { userActions } from '../actions';
import { useDispatch, useSelector } from 'react-redux';


const useStyles = makeStyles(theme => ({
  list: {

  },

}));

const RewardsList = (props) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const [state, setState] = React.useState({ open: false, redirect: null, balances: {} });
  useEffect(() => dispatch(userActions.getTransactions(user)), [dispatch, user]);

  useEffect(() => {
    if (user && user.token) {
      setState({ balances: user.balances })
    }
  }, [user]);
  const rewardList = user && state && state.balances ? (
    <List className={classes.list}>
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

  return (<div style={{ flexGrow: 1 }}>
    {rewardList}
  </div>);

};


export { RewardsList };
