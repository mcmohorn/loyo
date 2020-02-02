import React, {useState, useEffect} from 'react';

import { makeStyles } from '@material-ui/core/styles';

import { Search } from '@material-ui/icons';
import { TextField, InputAdornment, List, ListItem, ListItemText } from '@material-ui/core';

import { businessActions } from '../../actions';
import { useDispatch, useSelector } from 'react-redux';


const useStyles = makeStyles(theme => ({
  container: {
    padding: 100,
  }
}));


const SearchPage = (props) => {
  const { results } = useSelector(state => state.businesses);
  // const { redirect, user } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const classes = useStyles();
  const [list, setList] = useState([]);
  const [query, setQuery] = useState('');

  useEffect(() => {
    setList(results);
  }, [results]);

 
  const itemClicked = (id) => {
    setQuery(null);
    setList([]);
    props.history.push(`/business/${id}`)
  }
const handleSearch = (e) => {
    setQuery(e.target.value);
    dispatch(businessActions.searchBusinesses(e.target.value));
};

 return (
   <div className={classes.container}>
       <TextField
        fullWidth
        variant="outlined"
        className={classes.margin}
        id="search-textfield"
        value={query}
        placeholder="Search"
        onBlur={handleSearch}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search />
            </InputAdornment>
          ),
        }}
        onKeyPress={(ev) => {
          if (ev.key === 'Enter') {
            handleSearch(ev);
          }
        }}
      />
      <List>

      {
     list.map((b, i) => {
       return (<ListItem button key={`${i}_business_result`} onClick={() => itemClicked(b.id)} >
         <ListItemText primary={b.name} secondary={b.description}/>
          
       </ListItem>);
     })
   }
   </List>
   </div>
 );


};


export { SearchPage };
