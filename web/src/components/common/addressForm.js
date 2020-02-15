import React, { useState, useEffect } from 'react';
import {
  Grid,
  Table,
  TableCell,
  TableRow,
  TableBody,
  TableHead,
  Button,
  IconButton
} from '@material-ui/core';
import {
  Delete
} from '@material-ui/icons';
import { useDispatch, useSelector } from 'react-redux';
import TextField from '@material-ui/core/TextField';

import { newBusinessActions } from '../../actions';

import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  button: {
    marginTop: theme.spacing(3),
    marginLeft: theme.spacing(1),
    float: 'right',
  },
  table: {
    minWidth: 650,
  },
}));

const AddressForm = () => {

  const dispatch = useDispatch();
  const classes = useStyles();
  const [address, setAddress] = useState({});
  const { addresses } = useSelector(state => state.newBusiness);

  const [addressList, setAddressList] = useState([]);

  useEffect(() => {
    // address page loaded ? 
    
  }, []);

  useEffect(() => {
    setAddressList(addresses);
  }, [addresses])

  const handleChange = (n, value) => {
    setAddress({ ...address, [n]: value });
  };


  const handleRemove = (i) => {
    addressList.splice(i, 1);
    dispatch(newBusinessActions.setAddresses(addressList))
    setAddressList([...addressList ]);
  };

  // TODO tie this to the reqiured elemetns in the field ( use form )
  const isAddressInvalid = () => {
    return !(address.address1 && address.city && address.state && address.country && address.zip)
  }

  const handleAdd = () => {
    setAddress({});
    addressList.push(address);

    setAddressList([...addressList]);

    dispatch(newBusinessActions.setAddresses(addressList));
  };

  const addressesTable = (
    <Table className={classes.table} aria-label="simple table">
      <TableHead>
        <TableRow>
          <TableCell>Street</TableCell>
          <TableCell>City</TableCell>
          <TableCell>State </TableCell>
          <TableCell>Zip</TableCell>
          <TableCell>Country</TableCell>
          <TableCell></TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {addressList.map((row, i) => (
          <TableRow key={`address_${i}`}>
            <TableCell >{row.address1} {row.address2}</TableCell>
            <TableCell >{row.city}</TableCell>
            <TableCell >{row.state}</TableCell>
            <TableCell >{row.zip}</TableCell>
            <TableCell >{row.country}</TableCell>
            <TableCell > 
              <IconButton aria-label="delete" color="secondary" onClick={()=> handleRemove(i)}>
                <Delete />
              </IconButton>  
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
  return (
    <React.Fragment>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            required
            id="address1"
            name="address1"
            value={address.address1 || ''}
            label="Street line 1"
            onChange={(e) => handleChange('address1', e.target.value)}
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            id="address2"
            name="address2"
            label="Street line 2"
            value={address.address2 || ''}
            onChange={(e) => handleChange('address2', e.target.value)}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            value={address.city || ''}
            id="city"
            name="city"
            label="City"
            onChange={(e) => handleChange('city', e.target.value)}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="state" 
            name="state" 
            label="State/Province/Region" 
            value={address.state || ''}
            fullWidth onChange={(e) => handleChange('state', e.target.value)} 
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="zip"
            name="zip"
            label="Zip / Postal code"
            onChange={(e) => handleChange('zip', e.target.value)}
            fullWidth
            value={address.zip || ''}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="country"
            name="country"
            label="Country"
            onChange={(e) => handleChange('country', e.target.value)}
            fullWidth
            value={address.country || ''}
          />
        </Grid>
      </Grid>
      <Button 
        onClick={handleAdd}
        className={classes.button}
        color="secondary"
        disabled={isAddressInvalid()}
        variant="contained">
         Add Address
      </Button>
      {addressesTable}
    </React.Fragment>
  );
}

export default AddressForm;