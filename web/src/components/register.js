import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class RegisterPage extends Component {
  componentDidMount(){

  }
  render() {
    return (
      <div>
        <h3>RegisterPage</h3>
        Already have account? <Link to='login'>Login here</Link>
      </div>
    )
  }
}

export default RegisterPage;
