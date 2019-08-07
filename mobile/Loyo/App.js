/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, TextInput, Keyboard, TouchableHighlight,TouchableNativeFeedback, Button, TouchableOpacity} from 'react-native';
import Digit from './components/digit'

import Orientation from 'react-native-orientation';

const PURPLE = '#7030A0';
const GRAY = '#aba9a8';
const GREEN = '#3a8528';
const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

type Props = {};
export default class App extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = { text: '', message: '', orientation: null, phone: '', amount: 0 };
  }

  _onOrientationDidChange = (orientation) => {

    this.setState({ orientation: orientation});
    if (orientation == 'LANDSCAPE-LEFT') {
      //do something with landscape left layout
    } else {
      //do something with portrait layout
    }
  }

  componentWillMount() {
    //The getOrientation method is async. It happens sometimes that
    //you need the orientation at the moment the js starts running on device.
    //getInitialOrientation returns directly because its a constant set at the
    //beginning of the js code.
    var initial = Orientation.getInitialOrientation();
    this.setState({orientation: initial});
    if (initial === 'PORTRAIT') {
      //do stuff
    } else {
      //do other stuff
    }
  }

  componentDidMount() {

    //Orientation.getAutoRotateState((rotationLock) => this.setState({rotationLock}));
    //this allows to check if the system autolock is enabled or not.

    //  Orientation.lockToPortrait(); //this will lock the view to Portrait
    //Orientation.lockToLandscapeLeft(); //this will lock the view to Landscape
    //Orientation.unlockAllOrientations(); //this will unlock the view to all Orientations

    //get current UI orientation
    /*
    Orientation.getOrientation((orientation)=> {
      console.log("Current UI Orientation: ", orientation);
    });

    //get current device orientation
    Orientation.getDeviceOrientation((deviceOrientation)=> {
      console.log("Current Device Orientation: ", deviceOrientation);
    });
    */

    Orientation.addOrientationListener(this._onOrientationDidChange);
  }
  onPressNumber = () => {
    this.phoneInput.focus();
  }
  onPressAmount = () => {
    this.amountInput.focus();
  }

  onPressSend = () => {

  }

  componentWillUnmount() {
    Orientation.removeOrientationListener(this._onOrientationDidChange);
  }
  onPhoneChange = (phone) => {
    console.log('phone changed');
    if (phone.length < 11) {
      if (phone.length === 10) {
        this.amountInput.focus();
      }
      this.setState({ phone });
    }


  }
  onAmountChange = (amount) => {
    this.setState({ amount });



  }
  render() {
    const isCustomer = this.state.orientation !== 'PORTRAIT';
    let num = this.state.phone;
    let amt = this.state.amount;
    const numberDisplay = (
      <View style={styles.numberContainer}>
      <TouchableHighlight onPress={this.onPressNumber} underlayColor="white">
      <View style={styles.numberDisplay}>
        <Digit value="(" />
        <Digit value={num.length > 0 ? num[0] : null} />
        <Digit value={num.length > 1 ? num[1] : null} />
        <Digit value={num.length > 2 ? num[2] : null} />
        <Digit value=")" />
        <Digit value={num.length > 3 ? num[3] : null} />
        <Digit value={num.length > 4 ? num[4] : null} />
        <Digit value={num.length > 5 ? num[5] : null} />
        <Digit value="-" />
        <Digit value={num.length > 6 ? num[6] : null} />
        <Digit value={num.length > 7 ? num[7] : null} />
        <Digit value={num.length > 8 ? num[8] : null} />
        <Digit value={num.length > 9 ? num[9] : null} />
      </View>
      </TouchableHighlight>
      </View>
      ) ;

    const displayString = Number(this.state.amount).toFixed(2) || "0.00";
    const amountDisplay = (
      <View style={styles.numberContainer}>
      <TouchableHighlight onPress={this.onPressAmount} underlayColor="white">
      <View style={styles.numberDisplay}>
        <Digit value="$" />
        {
          displayString.split().map((a) => <Digit value={a} />)
        }

      </View>
      </TouchableHighlight>
      </View>
      );


      let sendTitle = ''
      let bgclr = PURPLE;
      if (this.state.phone.length === 10) {
        if (isCustomer) {
          sendTitle = 'Return Device';
          bgclr = PURPLE;
        } else {
          if (Number(Number(this.state.amount).toFixed(2)) > 0) {
            sendTitle = 'Claim Points';
            bgclr = GREEN;
          }
          else {
            sendTitle = 'Enter Total Spent';
            bgclr = PURPLE;
          }

        }
      } else {
        sendTitle = 'Enter Phone'
      }

      const sendButton = (<TouchableOpacity
         style={{
           backgroundColor: bgclr,
           width: 200,
           height: 50,
           alignItems: 'center', justifyContent:'center',
           }}
         onPress={this.onPressSend}
       >
         <Text style={{textAlign: 'center', fontSize: 24, color:'white' }}> {sendTitle} </Text>
       </TouchableOpacity>);





    return (
      <View style={styles.outerContainer}>
      <View style={styles.container}>
        <View style={styles.emptyBlock}></View>


      {numberDisplay}

      {
        this.state.orientation === 'PORTRAIT' ?
        amountDisplay :
        null
      }
      {sendButton}
      <TextInput
        ref={(input) => { this.phoneInput = input; }}
        style={styles.hiddenInput}
        onChangeText={this.onPhoneChange}
        value={this.state.phone}
        keyboardType="number-pad"
        placeholder="Enter Phone number"
      />
      <TextInput
        ref={(input) => { this.amountInput = input; }}
        style={styles.hiddenInput}
        onChangeText={this.onAmountChange}
        value={this.state.amount}
        keyboardType="decimal-pad"
        placeholder="Enter Amount Spent"
      />

      </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  numberDisplay: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  hiddenInput: {
    height: 40,
    display: 'none',
    fontSize: 24,
    borderColor: 'white',
    borderWidth: 1,
    width: 40,
    textAlign: 'center',
    margin: 'auto'
  },
  numberContainer: {
    height: 50,
  },
  button: {
    backgroundColor: 'green',
    borderWidth: 1,
    borderColor: 'black'
  },
  outerContainer: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: PURPLE,
    color : '#ffffff',
  },
  container: {
    flex: .5,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  emptyBlock: {
    height: 100,
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#ffffff',
    marginBottom: 5,
  },
});
