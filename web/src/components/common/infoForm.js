import React, { useState, useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import { newBusinessActions } from '../../actions';
import {useSelector, useDispatch} from 'react-redux'

import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({}));
const InfoForm = () => {

  const dispatch = useDispatch();
  const classes = useStyles();
  const [info, setInfo] = useState({});
  const { name, description } = useSelector(state => state.newBusiness);

  useEffect(() => {
    setInfo({ name, description });
  }, [name, description])

  const handleChange = (n, value) => {
    setInfo({ ...info, [n]: value });
  };

  const updateReduxInfo = () => {
    dispatch(newBusinessActions.setInfo(info));
  };


  return (
    <React.Fragment>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            onChange={(e) => handleChange('name', e.target.value)}
            onBlur={updateReduxInfo}
            required
            value={info.name}
            id="name"
            name="name"
            label="Business Name"
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            onChange={(e) => handleChange('description', e.target.value)}
            onBlur={updateReduxInfo}
            id="description"
            value={info.description}
            name="description"
            label="Description"
            fullWidth
          />
        </Grid>
        
      </Grid>
    </React.Fragment>
  );
}

export default InfoForm;