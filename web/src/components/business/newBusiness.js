
import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { Edit } from '@material-ui/icons';
import {Button, Stepper, Step, StepLabel, CssBaseline} from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';

import {Typography,
  IconButton
} from '@material-ui/core';
import { businessActions } from '../../actions';
import { useDispatch, useSelector } from 'react-redux';

import AddressForm from '../common/addressForm';
import RewardsForm from '../common/rewardsForm';
import InfoForm from '../common/infoForm';
import ReviewNewBusiness from '../common/reviewBusiness';

const useStyles = makeStyles(theme => ({
  appBar: {
    position: 'relative',
  },
  layout: {
    width: 'auto',
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    [theme.breakpoints.up(1000 + theme.spacing(2) * 2)]: {
      width: 1000,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  paper: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    padding: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
      marginTop: theme.spacing(6),
      marginBottom: theme.spacing(6),
      padding: theme.spacing(3),
    },
  },
  stepper: {
    padding: theme.spacing(3, 0, 5),
  },
  buttons: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  button: {
    marginTop: theme.spacing(3),
    marginLeft: theme.spacing(1),
  },
  editButton: {
    float: 'right'
  }
}));
const steps = ['Info', 'Locations', 'Rewards', 'Review'];

function getStepContent(step, fn) {
  switch (step) {
    case 0: 
      return <InfoForm />;
    case 1:
      return <AddressForm />;
    case 2:
      return <RewardsForm />;
    case 3:
      return <ReviewNewBusiness onEditPress={(i) => {fn(i)}}/>;
    default:
      throw new Error('Unknown step');
  }
}

const NewBusinessDialog = (props) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { onClose, open } = props;
  const { user } = useSelector(state => state.auth);
  const business = useSelector(state => state.newBusiness);

   const [activeStep, setActiveStep] = React.useState(0);
  const handleNext = () => {
    setActiveStep(activeStep + 1);
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  function handleClose() {
    setActiveStep(0);
    onClose();
  }

  const handleSubmit = (e) => {
    setActiveStep(0);
    dispatch(businessActions.createBusiness(user, business))
  }

  return (
    <Dialog fullWidth maxWidth="lg" onClose={handleClose} aria-labelledby="new-business-dialog" open={open}>
      
      <React.Fragment>
      <CssBaseline />
      
      <main className={classes.layout}>
        <div className={classes.paper}>
          
          <div className={classes.headerBox}>
            {activeStep === 3 ? 
              <IconButton className={classes.editButton} aria-label="delete" color="secondary" onClick={()=> setActiveStep(0)}>
                  <Edit />
              </IconButton>
            : null
            } 
            <Typography component="h1" variant="h4" align="center">
              {business.name ? business.name : 'New Business' }
            </Typography>
            <Typography component="h1" variant="body1" align="center">
              {business.description ? business.description : '' }
            </Typography>
          </div>
          <Stepper activeStep={activeStep} className={classes.stepper}>
            {steps.map(label => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          <React.Fragment>
            {activeStep === steps.length ? (
              <React.Fragment>
                <Typography variant="h5" gutterBottom>
                  Thank you for your order.
                </Typography>
                <Typography variant="subtitle1">
                  Your order number is #2001539. We have emailed your order confirmation, and will
                  send you an update when your order has shipped.
                </Typography>
              </React.Fragment>
            ) : (
              <React.Fragment>
                {getStepContent(activeStep, setActiveStep)}
                <div className={classes.buttons}>
                  {activeStep !== 0 && (
                    <Button onClick={handleBack} className={classes.button}>
                      Back
                    </Button>
                  )}
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={activeStep === steps.length - 1 ? handleSubmit: handleNext}
                    className={classes.button}
                  >
                    {activeStep === steps.length - 1 ? 'Create Business' : 'Next'}
                  </Button>
                </div>
              </React.Fragment>
            )}
          </React.Fragment>
        </div>
      </main>
    </React.Fragment>

    </Dialog>
  );
}

NewBusinessDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  selectedValue: PropTypes.string.isRequired,
};

export default NewBusinessDialog;
