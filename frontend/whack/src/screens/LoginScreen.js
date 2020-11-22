import React, { Component } from 'react';
import { Alert, View, StyleSheet, Dimensions } from 'react-native';
import axios from 'axios';

import BuildLoadingIndicator from '../components/loadingIndicator';
import buildButton from '../components/button';
import buildDisplay from '../components/display';
import buildTextInput from '../components/textInput';
import config from '../config/config';
import { delayedAlert, parseStatusCode } from '../util/util'
import * as Auth from '../services/authService';
import * as logger from '../services/loggerService';

const { width, height} = Dimensions.get('window')

class LoginScreen extends Component {

  state = {
    email: "",
    password: "",
    loading: false
  }

  // function to send an HTTP post request to login!
  loginRequest = async () => {

    const { email, password } = this.state;

    if(email === '' && password === '') 
        return Alert.alert('Invalid login information, try again')

    try {

      this.setState({ loading: true})

      let { status, data } = await axios.post(config.API.ENDPOINTS.LOGIN, { email: email.toLowerCase(), password })


      this.setState({ loading: false})

      if(status === 200){ 

        await this.handleSuccess(data.token)

        let { data: info } = await axios.get(config.API.ENDPOINTS.SCORE, { headers: { token: data.token }}) 

        let score = info.data.points; 

        if(score) await Auth.setScore(score)
      }


    } catch (error) {
      this.handleFailure(error)
    }
  }

  // function to handle the success
  handleSuccess = async(token) =>{
    await Auth.setToken(token)
    this.props.navigation.navigate('GameScreen');
  }

  // function to handle failure
  handleFailure = (error) => {
    this.setState({ loading: false})
    const parsedStausCode = parseStatusCode(error)
    if(parsedStausCode === '409'){
      delayedAlert('Account Verify Error','Please check your email to verify account before logging in')
    }else {
      delayedAlert('Error', 'Invalid login info, please try again')
      logger.log('Error logging in', error)
    }
  }


  // function to handle the text input fields
  handleChange = (inputType, value) => {
    if(inputType === 'email'){
      this.setState({email: value})
    }
    else if(inputType === 'password'){
      this.setState({password: value})
    }
  }

  render(){

    const { loginRequest, handleChange} = this;

    const { navigation } = this.props;

    const { email, password, loading } = this.state;

    return (
      <View style={styles.container}>
   
         {buildDisplay('Whack a Mole!')}
   
         {buildTextInput('Email', email, false, (text) => handleChange('email', text ))}
   
         {buildTextInput('Password', password, true, (text) => handleChange('password', text ))}
   
         {buildButton('LOG IN', loginRequest)}
   
         {buildDisplay("Don't have an account?", false)}
   
         {buildButton('SIGN UP', () => navigation.navigate('Register'))}
   
         {BuildLoadingIndicator(loading)}
   
      </View>
     );
  }
}

const styles = StyleSheet.create({
  container:{
    alignItems: 'center',
    marginTop: height * 0.1
  },
   display:{
    fontSize: 30,
    fontWeight: '500',
    marginTop: 20,
    marginBottom: height * 0.075,
   },
   inputContainer: {
    width: width * 0.6,
    height: height * 0.05,
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#000',
    paddingBottom: 10,
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "#009345",
    backgroundColor: "#FFF",
    marginBottom: 20,
  },
  inputText:{
    flex: 1,
    fontSize: 20
  },
  loginButton:{
    alignItems: "center",
    alignSelf: "center",
    width:  width * 0.6,
    padding: 15,
    backgroundColor: "#009345",
    borderRadius: 10,
  },
  loginButton_text:{
    fontSize: 20,
    color: "#fff",
  }
});

export default LoginScreen;