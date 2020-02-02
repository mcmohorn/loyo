import React, { useState, useEffect } from 'react';
import {
  Grid,
  Table,
  TableCell,
  TableRow,
  TableBody,
  TableHead,
  Button
} from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import TextField from '@material-ui/core/TextField';

import { newBusinessActions } from '../../actions';

import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  button: {
    marginTop: theme.spacing(3),
    marginLeft: theme.spacing(1),
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
    setAddressList(addresses);
  }, [addresses])

  const handleChange = (n, value) => {
    setAddress({ ...address, [n]: value });
  };

  const handleAdd = () => {
    addressList.push(address);

    setAddressList([...addressList]);

    dispatch(newBusinessActions.setAddresses(addressList));
  };

  const addressesTable = (
    <Table className={classes.table} aria-label="simple table">
      <TableHead>
        <TableRow>
          <TableCell>Addr 1</TableCell>
          <TableCell>Addr 2</TableCell>
          <TableCell>City</TableCell>
          <TableCell>State </TableCell>
          <TableCell>Zip</TableCell>
          <TableCell>Country</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {addressList.map((row, i) => (
          <TableRow key={`address_${i}`}>
            <TableCell >{row.address1}</TableCell>
            <TableCell >{row.address2}</TableCell>
            <TableCell >{row.city}</TableCell>
            <TableCell >{row.state}</TableCell>
            <TableCell >{row.zip}</TableCell>
            <TableCell >{row.country}</TableCell>
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
            label="Address line 1"
            onChange={(e) => handleChange('address1', e.target.value)}
            fullWidth
            autoComplete="billing address-line1"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            id="address2"
            name="address2"
            label="Address line 2"
            onChange={(e) => handleChange('address2', e.target.value)}
            fullWidth
            autoComplete="billing address-line2"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="city"
            name="city"
            label="City"
            onChange={(e) => handleChange('city', e.target.value)}
            fullWidth
            autoComplete="billing address-level2"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField id="state" name="state" label="State/Province/Region" fullWidth onChange={(e) => handleChange('state', e.target.value)} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="zip"
            name="zip"
            label="Zip / Postal code"
            onChange={(e) => handleChange('zip', e.target.value)}
            fullWidth
            autoComplete="billing postal-code"
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
            autoComplete="billing country"
          />
        </Grid>
      </Grid>
      <Button onClick={handleAdd} className={classes.button} color="secondary" variant="contained">
        Add Address
                </Button>
      {addressesTable}
    </React.Fragment>
  );
}

export default AddressForm;