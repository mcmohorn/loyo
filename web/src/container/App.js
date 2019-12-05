import React, { Component } from 'react';
import PropTypes from 'prop-types';
import '../App.scss';

class App extends Component {
  componentDidMount(){

  }
  render() {
    return (
      <div className="App">
        <div className="appHeader"></div>
        {this.props.children}
      </div>
    );
  }
}

App.propTypes = {
  children: PropTypes.object.isRequired
};

export default App;
