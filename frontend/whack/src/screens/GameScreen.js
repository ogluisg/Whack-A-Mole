import React, { Component } from 'react'
import { Alert, StyleSheet, Text, View, ImageBackground , TouchableOpacity, Dimensions, Image, SafeAreaView } from 'react-native'
import Slider from '@react-native-community/slider';
import Sound from 'react-native-sound';
import axios from 'axios';

import { connect } from 'react-redux'
import { resetPoints } from '../redux/actions';

import config from '../config/config'
import Mole from '../components/Mole';
import { delayedAlert, fetchNewScore } from '../util/util'
import * as Auth from '../services/authService'
import LoadingIndicator from '../components/loadingIndicator';
import * as logger from '../services/loggerService';

const { width } = Dimensions.get('window')

class GameScreen extends Component  {

  state = {
    timer: 30,
    speed: 1,
    timerId: null,
    loading: false,
    started: false,
    submitting: false
  }

  componentWillUnmount() {

    const { timerId } = this.state;

    clearInterval(timerId)

  }

  // function to commence an interval to reduce time by 1 second
  startTimer = () => {

    const timerId = setInterval(() => this.countDown(), 1000)

    this.setState({ timerId })
  }

  playSound = (gameOver = true, isSubmit = false) => {

    var whoosh = new Sound(gameOver && isSubmit ? 'swoosh.mp3' : gameOver ? 'victory.mp3' : 'start.mp3',
        Sound.MAIN_BUNDLE, 
                    (error) => {
                              if (error) return logger.log(`Failed to load the sound with error ${error}`);
                     whoosh.play();
      });
  }

  // function to actually reduce the time
  countDown = async () => {

    let { timer, timerId, started } = this.state;

    const { score } = this.props;

    if(timer === 0) {

      clearInterval(timerId)

      this.setState({timerId: null, started: false})

      this.playSound()

      if(score > 0) {

        // fetch user's top score
        let topScore = await fetchNewScore()
            
        // compare scores & check for internet connection
        if(score > topScore) await this.displaySubmit()
    }
  }
  else {
    if(started) this.setState({timer: timer -= 1})
  }
}

  // function to display optional score submission to user
  displaySubmit = async() => {
    Alert.alert('New Highscore!','\nSubmit it to the leaderboards?\n\n * Requries an Internet Connection *',
    [
      { text: "Cancel", onPress: null, style: "cancel"},
      { text: "YES", onPress: async () => await this.updateScore()}
    ])
  }

  // function to render a button
  buildButton = (text, onPress = null, small = false) => {

    const { started } = this.state;

    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={started ? true : false}
        style={[styles.loginButton, !small ? {backgroundColor: started ? 'grey' : "#009345"} : {marginRight: 5,  width: width * 0.4, backgroundColor: started ? 'grey' : "#009345"}]}
      >
        <Text style={styles.loginButton_text}>{text}</Text>
      </TouchableOpacity>
    )
  }

  // function to render the display text of the game button
  buildDisplayText = () => {
    return this.state.timer !== 0 ? 'Start' : 'Restart'
  }
 
  // function to send an HTTP post request to server to update highscore
  updateScore = async () => {

    try {

        this.setState({submitting: true})

        const { score } = this.props;

        const { status } = await axios.post(config.API.ENDPOINTS.SCORE, { points: score }, { headers: {token: await Auth.getToken()}})

        await Auth.setScore(score)
        
        this.playSound(true, true)
        
        this.setState({submitting: false})

        if(status === 200) delayedAlert('Success', 'Score succesfully submitted')
        
    } catch (error) {
      this.handleFailure()
    }
  }

  // function to handle failure of the updating score request
  handleFailure = () => {

    this.setState({submitting: false})

    delayedAlert('Error updating score!')
    
    logger.log(`Error updating score!`, error)
  }

  // function that handles the onPress of the game button (start, restart)
  buttonFunction = () => {
    
    const { timer, started } = this.state;

    this.props.resetPoints()

    this.playSound(false)

    this.setState({started: timer === 0 ? true : !started, timer: 30 }, () => this.startTimer())
  }

  // function to render scoreboard & timer
  buildScoreboard = () => {
    const { timer } = this.state;
    const { score } = this.props;
    return(
      <View style={{backgroundColor:'white', flexDirection:'row', borderWidth: 1, marginTop: 10, borderRadius: 10, justifyContent:'space-around'}}>
          <View style={{flexDirection:'row'}}>
              <Image source={require('../assets/images/timer.png')} style={{width: 30, height: 30, marginTop: '15%', marginLeft: 20}}/>
              <Text style={styles.header}>{timer}s</Text>
          </View>

          <View style={{flexDirection:'row'}}>
          <Image source={require('../assets/images/trophy.jpg')} style={{width: 40, height: 30, marginTop: '15%', marginLeft: 20}}/>
          <Text style={[styles.header, {marginRight: 30}]}>{score}</Text>
          </View>
      </View>
    )
  }

  // function to render a slider
  buildSlider = (speed) => {
    return(
      <View style={{marginTop: 25}}>
        <Text style={{fontWeight:'bold'}}>{`${speed.toFixed(1)}x`}</Text>
        <Slider
          onValueChange={(value) => this.setState({speed: value})}
          minimumValue={1}
          maximumValue={2}
          minimumTrackTintColor="#FFFFFF"
          maximumTrackTintColor="#000000"
        />
      </View>
    )
  }

  // function to render the game with moles
  buildGame = (started, speed) => {
  const moles = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15];
  //const moles = [1]
    return(
      <View style={styles.game}>
        {moles.map((mole, index) => <Mole key={index.toString()} started={started} speed={speed}/>)}
      </View>
    )
  }

  render(){
  
    const { submitting, started, speed } = this.state;

    const { navigation } = this.props;

    const { buildButton, buildDisplayText, buildScoreboard, buildSlider, buildGame, buttonFunction } = this;

    return (
      <ImageBackground style={styles.container} source={require('../assets/images/grass.png')}>

        <SafeAreaView>

              {buildScoreboard()}

              <View style={{flexDirection:'row', justifyContent:'space-between'}}>

              {buildButton(buildDisplayText(), () => buttonFunction(), true)}

              {buildButton('Leaderboards', () => navigation.navigate('Scoreboard'), true)}

              </View>

              {buildGame(started, speed)}

              {LoadingIndicator(submitting)}

              <View style={{ marginTop: '100%' }}>

              {buildButton('Help', () => Alert.alert('How are points calculated?','\nWhacking a mole: + 1 points\n\n Whacking a hole: -2 points\n\n Happy Gaming!'), true)}

              </View>

        </SafeAreaView>
        
        

    </ImageBackground>
    )
  }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
    },
    game: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      width: 300,
      marginLeft: '3%',
      paddingTop: '10%',
    },
    header: {
      fontWeight: 'bold',
      marginTop: 20,
      marginBottom: 20,
      marginRight: 5,
    },
    loginButton:{
        marginTop: 10,
        alignItems: "center",
        alignSelf: "center",
        width:  width * 0.6,
        padding: 15,
        backgroundColor: "#009345",
        borderRadius: 10,
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

  const mapStateToProps = (state) => {
    return {
        score: state.score
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        resetPoints: () => dispatch(resetPoints())
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(GameScreen)
