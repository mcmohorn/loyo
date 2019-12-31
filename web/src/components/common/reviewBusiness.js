import React, {useState, useEffect} from 'react';
import {
  Grid,
  Table,
  TableCell,
  TableRow,
  TableBody,
  TableHead,
  Button,
  Typography
} from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

import {prettyDate} from '../../helpers/date-helper';

import { newBusinessActions } from '../../actions';

import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  
    table: {
      minWidth: 650,
    },
}));

const ReviewNewBusiness = () => {

  const dispatch = useDispatch();
  const classes = useStyles();
  const { addresses, rewards, name, description } = useSelector(state => state.newBusiness);

  const headerInfo = (
    <div>
        <Typography>{name}</Typography>
        <Typography>{description}</Typography>
    </div>
  );

    const addressesTable = (
    <div>
        <Typography>Locations</Typography>
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
          {addresses.map((row, i) => (
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
      </div>
    );

    const rewardsTable = (
        <div>
            <Typography>Rewards</Typography>
        <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Effective</TableCell>
            <TableCell>Expires</TableCell>
            <TableCell>Points</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rewards.map((row, i) => (
            <TableRow key={`reward_${i}`}>
              <TableCell >{row.name}</TableCell>
              <TableCell >{row.description}</TableCell>
              <TableCell >{prettyDate(row.effective)}</TableCell>
              <TableCell >{prettyDate(row.expiration)}</TableCell>
              <TableCell >{row.cost}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      </div>
    );
  return (
    <React.Fragment>
        {headerInfo}
      {addressesTable}
      
      {rewardsTable}
    </React.Fragment>
  );
}

export default ReviewNewBusiness;