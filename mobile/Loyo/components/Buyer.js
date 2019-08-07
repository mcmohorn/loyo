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
export default class Buyer extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = { phone: '' };
  }

  componentWillMount() {

  }

  componentDidMount() {


  }

  componentWillUnmount() {

  }
  render() {
    return (
      <View style={styles.container}>

      <TextInput
        style={{height: 40,
          fontSize: 24,borderColor: 'white', borderWidth: 1, width: "90%", textAlign: 'center', margin: 'auto'}}
        onChangeText={(text) => this.setState({text})}
        value={this.state.text}
        keyboardType="number-pad"
        placeholder="Enter Phone number"
      />
        <Text style={styles.digit}>{this.state.message}</Text>

      </View>
    );
  }
}

const styles = StyleSheet.create({

  instructions: {
    textAlign: 'center',
    color: '#ffffff',
    marginBottom: 5,
  },
});
