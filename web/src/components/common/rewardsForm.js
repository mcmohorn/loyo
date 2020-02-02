import React, { useState, useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import {useDispatch, useSelector} from 'react-redux';
import DateFnsUtils from '@date-io/date-fns';
import {
    FormControl,
    FormHelperText,
    InputLabel,
    InputAdornment,
    Input,
    Table,
    TableHead,
    TableCell,
    TableBody,
    TableRow,
    Button,
} from '@material-ui/core';
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker
} from '@material-ui/pickers';
import { makeStyles } from '@material-ui/core/styles';
import { newBusinessActions } from '../../actions';

import {prettyDate} from '../../helpers/date-helper';

const useStyles = makeStyles(theme => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
        width: '100%',
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
    root: {
        width: '100%',
      },
      paper: {
        width: '100%',
        overflowX: 'auto',
      },
      table: {
        minWidth: 650,
      },
}));

const initialState = {

};

const RewardsForm = () => {
    const dispatch = useDispatch();
    const classes = useStyles();
    const [reward, setReward] = useState(initialState);
    const { rewards } = useSelector(state => state.newBusiness);

    const [rewardList, setRewardList] = useState([]);

    useEffect(() => {
        setRewardList(rewards);
    }, [rewards])

    const handleChange = (n, value) => {
        setReward({...reward, [n]: value});
    };

    const handleAdd = () => {
        rewardList.push(reward);
        
        setRewardList([...rewardList]);
        
        dispatch(newBusinessActions.setRewards(rewardList));
    };

    

    const rewardsTable = (
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
          {rewardList.map((row, i) => (
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
    );

    return (
        <React.Fragment>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
      
            <Grid container spacing={3}>

                
                <Grid item xs={4}>
                    <FormControl className={classes.formControl}>
                    <InputLabel htmlFor="name">Reward Name</InputLabel>
                        <Input
                            id="name"
                            onChange={(e) => handleChange('name', e.target.value)}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                        <FormHelperText>e.g. 'Small Coffee'</FormHelperText>
                    </FormControl>
                </Grid>
                <Grid item xs={8}>
                    <FormControl className={classes.formControl}>
                    <InputLabel htmlFor="description">Notes (optional)</InputLabel>
                        <Input
                            id="description"
                            onChange={(e) => handleChange('description', e.target.value)}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                        <FormHelperText>Include terms or conditions here</FormHelperText>
                    </FormControl>
                </Grid>

                    
                    
                    <Grid item xs={4}>
                        <FormControl fullWidth className={classes.formControl} variant="filled">
                            <InputLabel htmlFor="effective"></InputLabel>
                            <KeyboardDatePicker
                                disableToolbar
                                variant="inline"
                                format="MM/dd/yyyy"
                                margin="normal"
                                id="effective"
                                label="Effective Date"
                                value={reward.effective}
                                onChange={(v) => handleChange('effective', v.toISOString())}
                                />
                        </FormControl>
                        <FormHelperText></FormHelperText>
                    </Grid>
                    <Grid item xs={4}>
                        <FormControl fullWidth className={classes.formControl} variant="filled">
                            <InputLabel htmlFor="expiration"></InputLabel>
                            <KeyboardDatePicker
                                disableToolbar
                                variant="inline"
                                format="MM/dd/yyyy"
                                margin="normal"
                                id="expiration"
                                label="Expiration Date"
                                value={reward.expiration}
                                onChange={(v) => handleChange('expiration', v.toISOString())}
                                />
                        </FormControl>
                        <FormHelperText></FormHelperText>
                    </Grid>
                    <Grid item xs={4}>
                        <FormControl fullWidth className={classes.formControl} variant="filled">
                            <InputLabel htmlFor="cost">Cost</InputLabel>
                            <Input
                                id="cost"
                                value={reward.cost}
                                type="number"
                                onChange={(e) => handleChange('cost', Number(e.target.value))}
                                endAdornment={<InputAdornment position="end">Pts</InputAdornment>}
                                
                            />
                            <FormHelperText>1 Pt = 1$ Spent </FormHelperText>
                        </FormControl>
                    </Grid>
                </Grid>
                
                <Button onClick={handleAdd} className={classes.button} variant="contained" color="secondary">
                    Add Reward
                </Button>
                {rewardsTable}
            </MuiPickersUtilsProvider>
        </React.Fragment>
            );
        }
        
export default RewardsForm;