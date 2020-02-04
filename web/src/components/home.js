import React from 'react';
import Carousel from 'react-material-ui-carousel'
import { Paper, Button } from '@material-ui/core';
import { useSelector } from 'react-redux';

import { makeStyles } from '@material-ui/core/styles';
import { CreditCard, Store, Loyalty, AccountBalance, SyncAlt, ShoppingCart, DirectionsWalk } from '@material-ui/icons';

const items = [
  {
    name: "Link a Card",
    description: "Connect to your bank's website to claim loyalty points.",
    content: () => {
      return <div>
        <CreditCard fontSize="large" />
        <SyncAlt fontSize="large" />
        <AccountBalance fontSize="large" />
      </div>;
    },
  },
  {
    name: "Shop as Usual",
    description: "Earn loyalty points when you use your card.",
    content: () => {
      return <div>
        <DirectionsWalk fontSize="large" />
        <ShoppingCart fontSize="large" />
        <Store fontSize="large" />
        </div>
    },
  },
  {
    name: "Get Rewards",
    description: "Use your points to claim discounts and free stuff!",//  Business owners decide how points can be spent.
    content: () => {
      return <div><Loyalty /></div>
    },
    buttonText: "Get Started",
  }
]

const useStyles = makeStyles(theme => ({
  list: {
    width: 250,
  },
  introCarousel: {
    padding: '100px',
  },
  introItem: {
    padding: '50px'
  },
  getStartedButton: {
    'margin-top': '20px'
  }
}));



const Home = (props) => {
  const { user } = useSelector(state => state.auth);
  //const dispatch = useDispatch();
  const classes = useStyles();
  
  const getStarted = () => {
    if (user && user.id) {
      props.history.push('/accounts');
    } else {
      props.history.push('/register');
    }
  }
  return (
    <div className="col-md-6 col-md-offset-3">
      <Carousel className={classes.introCarousel} autoPlay={false} >
        {
          items.map((item) => {
            return (
              <Paper className={classes.introItem} elevation={5}>
                <h2>{item.name}</h2>
                <p>{item.description}</p>
                {item.content()}
                {
                  item.buttonText ?
                    <Button className={classes.getStartedButton} color="primary" variant="contained" onClick={getStarted}>
                      {item.buttonText}
                    </Button>
                    : null
                }

              </Paper>
            );
          })
        }
      </Carousel>

    </div>
  );


};

export { Home as HomePage };

