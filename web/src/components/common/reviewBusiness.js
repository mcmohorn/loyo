import React from 'react';
import {
  Table,
  TableCell,
  TableRow,
  TableBody,
  TableHead,
  Typography,
  IconButton
} from '@material-ui/core';
import { useSelector } from 'react-redux';

import {
    Edit
} from '@material-ui/icons'
import {prettyDate} from '../../helpers/date-helper';


import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
    sectionHeader: {
      fontWeight: 700,
      float: 'left'
    },
    table: {
      minWidth: 650,
    },
    editButton: {
      float: 'right'
    }
}));

const ReviewNewBusiness = (props) => {

  const classes = useStyles();
  const { addresses, rewards} = useSelector(state => state.newBusiness);

  const editPage = (stepIndex) => {
    props.onEditPress(stepIndex);
  }

    const addressesTable = (
    <div>
        <Typography className={classes.sectionHeader}>Locations</Typography>
        <IconButton className={classes.editButton} aria-label="delete" color="secondary" onClick={()=> editPage(1)}>
            <Edit />
        </IconButton> 
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Street</TableCell>
            <TableCell>City</TableCell>
            <TableCell>State </TableCell>
            <TableCell>Zip</TableCell>
            <TableCell>Country</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {addresses.map((row, i) => (
            <TableRow key={`address_${i}`}>
              <TableCell >{row.address1} {row.address2}</TableCell>
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
            <Typography className={classes.sectionHeader}>Rewards</Typography>
            <IconButton className={classes.editButton} aria-label="delete" color="secondary" onClick={()=> editPage(2)}>
            <Edit />
        </IconButton> 
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
      {addressesTable}
      
      {rewardsTable}
    </React.Fragment>
  );
}

export default ReviewNewBusiness;