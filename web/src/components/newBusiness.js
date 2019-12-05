
import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import {List, ListItem, ListItemAvatar, ListItemText, TextField, Button} from '@material-ui/core';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import PersonIcon from '@material-ui/icons/Person';
import AddIcon from '@material-ui/icons/Add';
import Typography from '@material-ui/core/Typography';
import { blue } from '@material-ui/core/colors';
import { businessActions } from '../actions';
import { useDispatch, useSelector } from 'react-redux';
const useStyles = makeStyles(theme => ({
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200,
  },
  button: {
    margin: theme.spacing(1),
  },
}));


function NewBusinessDialog(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { onClose, open } = props;
  const [name, setName] = useState('');
  const { user } = useSelector(state => state.auth);

  function handleClose() {
    setName('');
    onClose();
  }

  const handleSubmit = (e) => {
    console.log('wer are submitting!!!!');
    const newBusiness = {
      name,
    }
    dispatch(businessActions.createBusiness(user, newBusiness))
  }

  const addBusiness = () => {
    const newBusiness = {
      name,
    }
    dispatch(businessActions.createBusiness(user, newBusiness))
  }


  return (
    <Dialog onClose={handleClose} aria-labelledby="new-user-dialog" open={open}>
      <DialogTitle id="simple-dialog-title">Add a Business</DialogTitle>
      <form onSubmit={handleSubmit}>
      <div>
        <TextField
          id="business-name"
          label="Name"
          className={classes.textField}
          value={name}
          onChange={(e) => {setName(e.target.value)}}
          margin="normal"
        />
      </div>
      <Button variant="contained" color="primary" className={classes.button} onClick={addBusiness}> Add</Button>
      <Button variant="contained" color="secondary" className={classes.button} onClick={handleClose}> Cancel</Button>
    </form>
    </Dialog>
  );
}

NewBusinessDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  selectedValue: PropTypes.string.isRequired,
};

export default NewBusinessDialog;
