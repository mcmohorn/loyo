import React, { useState } from 'react';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import { newBusinessActions } from '../../actions';
import {useSelector, useDispatch} from 'react-redux'

import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({}));
const InfoForm = () => {

  const dispatch = useDispatch();
  const classes = useStyles();
  const { name, description } = useSelector(state => state.newBusiness);
  const [info, setInfo] = useState({
    name,
    description
  });


  const handleChange = (n, value) => {
    setInfo({ ...info, [n]: value });
  };

  const updateReduxInfo = () => {
    dispatch(newBusinessActions.setInfo(info));
  };


  return (
    <React.Fragment>
      <Grid container spacing={3} className={classes.grid}>
        <Grid item xs={12}>
          <TextField
            onChange={(e) => handleChange('name', e.target.value)}
            onBlur={updateReduxInfo}
            required
            value={info.name}
            id="newBusinessName"
            label="Business Name"
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            onChange={(e) => handleChange('description', e.target.value)}
            onBlur={updateReduxInfo}
            id="newBusinessDescription"
            value={info.description}
            label="Description"
            fullWidth
          />
        </Grid>
        
      </Grid>
    </React.Fragment>
  );
}

export default InfoForm;