import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@material-ui/styles';
import { createMuiTheme } from '@material-ui/core/styles';
import './resources/fonts/Harlow Solid Italic Italic.ttf'

import {store} from './helpers/store';
import routes from './routes';
import './index.css';

import purple from '@material-ui/core/colors/purple'; 


const theme = createMuiTheme({
  palette: {
    primary: { 500: purple[800]},
    // secondary: green,
  },
  status: {
    danger: 'orange',
  },
});

ReactDOM.render(
  <Provider store={store}>
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <div>
          {routes}
        </div>
      </BrowserRouter>
    </ThemeProvider>
  </Provider>
  , document.getElementById('root'));

  // If you want your app to work offline and load faster, you can change
  // unregister() to register() below. Note this comes with some pitfalls.
  // Learn more about service workers: https://bit.ly/CRA-PWA
  //serviceWorker.unregister();
