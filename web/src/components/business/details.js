import React, {useState, useEffect, useAsyncEffect} from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';

import InboxIcon from '@material-ui/icons/MoveToInbox';
import { Mail, Menu, CreditCard, LocalOffer, Delete, Add, Info, Fastfood, Redeem, Clear } from '@material-ui/icons';
import { AppBar,
  Toolbar,
  IconButton,
  Typography,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  GridList,
  GridListTile,
  ListSubheader,
  GridListTileBar,
  Dialog,
  Paper,
  DialogActions,
  DialogTitle,
  DialogContent
} from '@material-ui/core';
import { businessActions } from '../../actions';
import { userActions } from '../../actions';
import { useDispatch, useSelector } from 'react-redux';

const useStyles = makeStyles(theme => ({
  businessNameHeader: {
    marginTop: '70px',
    fontSize: '36px'
  },
  root: {
    flexGrow: 1,
  },
  tile: {
    background: '#e5e5e5'
  },
  tileBar: {
    textAlign: 'left'
  },
  tileIcon: {
    position: 'relative',
    top: '15%',
    fontSize: '32px'
  },
  cost: {
    float: 'right'
  },
  redeemDialogContainer: {
    padding: '50px',
    minHeight: '400px',
  },
  rewardName: {
    marginTop: '20px'
  },
  rewardDescription: {

    marginTop: '20px'
  }, 
  rewardCost: {

    marginTop: '20px'
  }
}));

const Page = (props) => {
  const business = useSelector(state => state.business)
  const { redirect, user } = useSelector(state => state.auth);
  const { loading, value, error } = useSelector(state => state.currentReward);
  const dispatch = useDispatch();
  const classes = useStyles();
  const [state, setState] = useState({});
  const [showError, setShowError] = useState(false);
  const [selectedReward, setSelectedReward] = useState(null);

  // load the details for this business
  useEffect(() => {
    dispatch(businessActions.getBusiness(props.match.params.id))
  }, []);

  useEffect(() => {
    setSelectedReward(null);
    setShowError(!!error);
  }, [error])

  const handleClose = () => {
    setSelectedReward(null);
  }

  const handleRedeem = () => {
    const redeemBody = {
      businessId: business.id,
      rewardId: selectedReward.id
    };
    dispatch(userActions.redeemReward(user, redeemBody));

  };

  const handleSelectReward = (r) => {
    setSelectedReward(r);
  };

  const handleCloseError = (r) => {
    setShowError(false);
  }

  const errorDialog = (
    <Dialog onClose={handleCloseError} aria-labelledby="redeem-failed-dialog" open={showError}>
      <DialogTitle>Error</DialogTitle>
      <DialogContent>{error}</DialogContent>
      
      <DialogActions >
          <Button onClick={handleCloseError} color="secondary" variant="outlined">
             OK
          </Button>
        </DialogActions>
    </Dialog>
  );

  const redeemDialog = (
    <Dialog fullWidth maxWidth="lg" onClose={handleClose} aria-labelledby="new-user-dialog" open={selectedReward}>
      {
        selectedReward && (
          <div className={classes.redeemDialogContainer}>
          <Typography component="h1" variant="h4" align="center" className={classes.rewardName}>
            {selectedReward.name}
          </Typography>
          <Typography component="h2" variant="h4" align="center" className={classes.rewardDescription}>
            {selectedReward.description}
          </Typography>
          <Typography component="h3" variant="h4" align="center" className={classes.rewardCost}>
            {selectedReward.cost} Points
          </Typography>
          </div>
        )
      }
      <DialogActions style={{textAlign: 'center', display: 'block'}}>
          <Button onClick={handleClose} color="secondary" variant="outlined">
            <Clear /> Cancel
          </Button>
          <Button onClick={handleRedeem} color="primary" variant="contained">
            <LocalOffer /> Redeem 
          </Button>
        </DialogActions>
    </Dialog>
  );

  const notFound = <div>not found</div>;

  const businessProfile = business ? (
    <div>
       <Typography className={classes.businessNameHeader}>{business.name}</Typography>
       <div className={classes.root}>
      <GridList cellHeight={180} className={classes.gridList}>
        <GridListTile key="Subheader" cols={2} style={{ height: 'auto' }}>
          <ListSubheader component="div">{business.description}</ListSubheader>
        </GridListTile>
        {business.rewards && business.rewards.map((tile, i) => (
          <GridListTile key={`reward_${i}`} className={classes.tile} >
            <Fastfood className={classes.tileIcon} color="primary"/>
            <GridListTileBar
        title={<span><span>{tile.name}</span><span className={classes.cost}>{tile.cost} pts</span></span>}
              className={classes.tileBar}
              subtitle={<span>{tile.description}</span>}
              actionIcon={
                <IconButton aria-label={`info about ${tile.name}`} className={classes.icon} onClick={(e) => handleSelectReward(tile)}>
                  <Redeem />
                </IconButton>
              }
            />
          </GridListTile>
        ))}
      </GridList>
    </div>
   </div>
  ) : notFound;
 return (
   <>
   {errorDialog}
   {redeemDialog}
   {businessProfile}
   </>
 );


};


export { Page as BusinessPage};
