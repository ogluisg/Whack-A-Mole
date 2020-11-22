import React, { Component } from "react";
import { View, StyleSheet, Dimensions, Alert} from "react-native";
import axios from 'axios';
import profanities from 'profanities';

import config from '../config/config';
import buildButton from '../components/button';
import buildDisplay from '../components/display';
import buildTextInput from '../components/textInput';
import BuildLoadingIndicator from '../components/loadingIndicator';
import { delayedAlert, wait, validateEmail } from '../util/util';
import * as logger from '../services/loggerService'

const { width, height } = Dimensions.get("window");

class LoginScreen extends Component {

  state = {
    email: "",
    password: "",
    displayName: "",
    loading: false
  }

  validate = (email, password, displayName) => {
    if(!validateEmail(email)){
      Alert.alert('Please enter a valid email')
      return false
    }

    if(profanities.includes(displayName.toLowerCase())){
      Alert.alert('Inapropriate display name. please choose a different one')
      return false
    }
    
    if(password.length < 6){
      Alert.alert('Password must be atleast 6 characters')
      return false;
    }

    return true;
  }

  // function to handle the HTTP post request to signup
  signupRequest = async () => {

    try {

      const { email, password, displayName } = this.state;

      const valid = this.validate(email, password, displayName)

      if(!valid) return;

      this.setState({loading: true})

      let { status } = await axios.post(config.API.ENDPOINTS.SIGNUP, {email: email.toLowerCase(), password, displayName})

      this.setState({loading: false})

      if(status === 200) this.handleSuccess()

    } catch (error) {
      this.handleFailure(error)
    }
  }

  // function to handle the success of the signup request
  handleSuccess = () => {
    delayedAlert('Account successfully created\n\nCheck your email to verify your accoun\n\nNote: Check spam if unable to find it')
    wait(1000).then(() =>  this.props.navigation.navigate('Login'))
  }

  // function to handle an error thrown from the signup request
  handleFailure = (error) => {
    this.setState({loading: false})
    delayedAlert('Oops, username already taken!')
    logger.log('Error signing up!', error)
  }

  // function to handle change of input fields
  handleChange = (inputType, value) => {
    if(inputType === 'email'){
      this.setState({email: value})
    }
    else if(inputType === 'password'){
      this.setState({password: value})
    }
    else if(inputType === 'displayName'){
      this.setState({displayName: value})
    }
  }

  render(){

    const { signupRequest, handleChange } = this;

    const { email, password, displayName, loading } = this.state;

    return (

      <View style={styles.container}>

        {buildDisplay("Create an account")}
  
        {buildTextInput("Email", email, false, (text) => handleChange('email', text ))}
  
        {buildTextInput("Password", password, true, (text) => handleChange('password', text ))}
  
        {buildTextInput('Display name', displayName, false,  (text) => handleChange('displayName', text ))}
  
        {buildButton("SIGN UP", signupRequest)}
  
        {BuildLoadingIndicator(loading)}
  
      </View>
    );
  }
};

const styles = StyleSheet.create({
  loading: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: '#F5FCFF88',
    alignItems: 'center',
    justifyContent: 'center'
  },
  container: {
    alignItems: "center",
    marginTop: height * 0.1,
  },
  display: {
    fontSize: 30,
    fontWeight: "500",
    marginBottom: 25,
  },
  inputContainer: {
    width: width * 0.6,
    height: height * 0.05,
    flexDirection: "row",
    borderBottomWidth: 1,
    paddingBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "#009345",
    backgroundColor: "#FFF",
    marginBottom: 20,
  },
  inputText: {
    flex: 1,
    fontSize: 20,
  },
  loginButton: {
    alignItems: "center",
    alignSelf: "center",
    width: width * 0.6,
    padding: 15,
    backgroundColor: "#009345",
    borderRadius: 10,
  },
  loginButton_text: {
    fontSize: 20,
    color: "#fff",
  },
});

export default LoginScreen;
