import React, { Component } from 'react';
import { ActivityIndicator, View, StyleSheet, Text, TouchableOpacity, Dimensions, Image } from 'react-native';
import axios from 'axios';

import config from '../config/config';
import * as Auth from '../services/authService';
import * as logger from '../services/loggerService';

const { width, height} = Dimensions.get('window')

class Scoreboard extends Component {

  state = {
    connected: false,
    users: [],
    loading: false
  }

  async componentDidMount() {
    await this.requestScores()
  }

  // function to build a reusable button
  buildButton = (text, onPress = null, isLoading = false, red = false) => {

    const { loading } = this.state;

    return(
      <TouchableOpacity
        disabled={isLoading ? loading : false}
        onPress={onPress}
        style={[styles.loginButton, isLoading ? loading ? {backgroundColor: 'grey'} : null : null, red ? {backgroundColor: 'darkred'} : null]}
      >
      <Text style={styles.loginButton_text}>
        {text}
      </Text>
    </TouchableOpacity>
    )
  }

  // function to build reusable display
  buildDisplay = (text, large = true, smaller = false, isCenter = false) =>{
    return(
        <View style={isCenter ? {alignItems: 'center'}  : null}>
        <Text style={[styles.display, !large ? {fontSize: smaller ? 15: 20, marginBottom: 5, fontWeight: '500', color: !smaller ? 'white' : null}: null]}>{text}</Text>
       </View>
    )
  }

  // function to fetch scores from API
  requestScores = async () => {
    
      try {

          this.setState({loading: true})
          
          let { data, status} = await axios.get(config.API.ENDPOINTS.SCOREBOARD, {headers: { token: await Auth.getToken()}})

          if(status === 200) this.setState({ users:data.data })
          
          this.setState({loading: false, connected: true})

      } catch (error) {
          this.setState({loading: false})
          logger.log('Error fetching scores', error)
      }
    
  }

  // function to build a  row
  buildRow = (firstCol, secondCol, header = false, key = null) => {

    const { buildDisplay } = this;

      return (
        <View key={key ? key : null}  style={{borderRadius: !header ? 10 : 0, borderTopRightRadius: header ? 5 : 0, borderTopLeftRadius: header ? 5 : 0, 
        backgroundColor: !header ? 'lightgrey' : '#009345', flexDirection: 'row',  justifyContent:'space-around', 
        borderBottomColor: !header ? 'gray' : '#009345', borderBottomWidth: !header ? 1 : 2, alignContent:'stretch'}}>

            <View style={{borderRightColor: !header ? 'gray' : '#009345', borderRightWidth: !header ? 1 : 2, flex: 1.5, marginLeft: '25%'}}> 
                {buildDisplay(firstCol, false, !header? true : false)}
            </View>

            <View style={{ flex: 1, marginLeft: !header ? '15%' : '5%'}}>
                {buildDisplay(secondCol, false, !header ? true : false)}
            </View>

        </View>
      )
  }

  // function that displays the data (if any)
  displayData = () =>{

    const { buildRow } = this;

    const { users, loading, connected } = this.state;

      if(!connected && !loading && users.length === 0)
        return (
          <View style={{alignItems: 'center'}}>
            <Text style={{marginTop:'20%',fontSize: 20, color:'darkred', fontWeight:'bold' }}>No Internet Connection...</Text>
            <Image style={{borderRadius: 100, width: 50, height: 50, marginTop: '10%'}} source={require('../assets/images/noInternet.png')}/>
            <TouchableOpacity
             onPress={this.requestScores}
             style={{
              marginTop: 25,
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 3,
              borderRadius: 10, 
              backgroundColor: "#009345", 
              height: '15%', 
              width: '35%',
              justifyContent:'center', 
              alignItems:'center'}}>
              <Text style={{color: 'white'}}>Try again</Text>
            </TouchableOpacity>
          </View>
        )

      if(users.length === 0 && !loading) 
         return (<Text style={{marginTop:'20%', marginLeft: '18%',fontSize: 25 }}>No highscores yet!</Text>)
      
      if(users.length === 0 || loading) 
        return <ActivityIndicator style={{marginTop: '25%'}} size='large' color='green'/> 

     return users.map((user) => { return buildRow(user.displayName, user.points, false, user._id)})
  }

  // function to render a loader indicator
  loadingIndicator = () => {

    const { loading } = this.state;

    return loading ? <ActivityIndicator style={{position:'absolute'}} size='large' color='green'/> : null
  }


  // function to navigate
  navigate = async(logout) => {
    if(logout){
      this.props.navigation.navigate('Login')
      await Auth.removeToken()
    }
    else {
      this.props.navigation.navigate('GameScreen')
    }
  }

  render(){

    const { buildDisplay, buildRow, buildButton, displayData, navigate } = this;

    return (

      <View style={styles.container}>
   
         {buildDisplay('Leaderboards')}
   
         <View style={styles.tableContainer}>
   
            {buildRow('User', 'Points', true)}
   
            {displayData()}

         </View>
   
         {buildButton('Back to Game', () => navigate(false) )}
   
         {buildButton('LOGOUT', () => navigate(true), false, true)}
   
      </View>
     );
  }
}

const styles = StyleSheet.create({
    container:{
        alignItems: 'center',
        marginTop: height * 0.1
    },
    tableContainer:{
        height: height * 0.35,
        width: width * 0.75,
        borderColor: '#009345',
        borderWidth: 2,
        borderRadius: 10,
    },
    HeadStyle: { 
      height: 50,
      alignContent: "center",
      backgroundColor: '#ffe0f0'
    },
    TableText: { 
      margin: 10
    },
    display:{
        fontSize: 30,
        fontWeight: '500',
        marginTop: 20,
        marginBottom: height * 0.075,
       },
   loginButton:{
        alignItems: "center",
        alignSelf: "center",
        marginTop: height * 0.025,
        marginBottom: 15,
        width:  width * 0.6,
        padding: 15,
        backgroundColor: "#009345",
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 3,
    },
      loginButton_text:{
        fontSize: 20,
        color: "#fff",
      }
  });

export default Scoreboard;