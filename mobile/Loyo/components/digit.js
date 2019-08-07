/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {StyleSheet, Text, View, TextInput, Keyboard} from 'react-native';


type Props = {};
export default class Digit extends Component<Props> {
  constructor(props) {
    super(props);

  }

  componentWillMount() {

  }

  componentDidMount() {


  }

  componentWillUnmount() {

  }
  render() {
    let value = this.props.value || '_';
    return (
        <Text style={styles.digit}>{value}</Text>
    );
  }
}

const styles = StyleSheet.create({

  digit: {
    padding: 3,
    color: 'white',
    fontSize: 40,
  },
});
