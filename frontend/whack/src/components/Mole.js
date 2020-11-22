import React, { Component } from 'react'
import { StyleSheet,TouchableOpacity, Image } from 'react-native'

import Sound from 'react-native-sound';

import * as logger from '../services/loggerService';

import { addPoint, decreasePoints } from '../redux/actions'
import { connect } from 'react-redux'

Sound.setCategory('Playback');

class Mole extends Component {
    
    state = {
        isActive: false,
        hit: false,
        randomTime: (Math.random() * 10000 + 1000),
        popoutTime: 800,
        speed: 1,
        timerId: {},
        timeoutId: {}
    };

    async componentDidMount() { 
      this.start()
    }

    componentDidUpdate(nextProps, nextState){
        if(nextState.speed != this.state.speed) {
            this.start(true)
        }
        else if(this.props.started !== nextProps.started){
            this.start()
        }
    }

    componentWillUnmount() {
        this.endGame()
    }

    // function to begin the game or change speed
    start = (isChangeSpeed = false) => {

        const { speed, popoutTime , randomTime, timerId, timeoutId } = this.state;

        if(isChangeSpeed){

            if(timerId) clearInterval(timerId)

            if(timeoutId) clearTimeout(timeoutId)

        }

        let newTimerId, newTimeoutId;

        // Pops up
        newTimerId = setInterval(() => {
            this.setState({isActive: true})

        // Pops back down
        newTimeoutId = setTimeout(() => { 
            this.setState({isActive: false, hit: false})
            },  popoutTime / speed )
        }, randomTime)

        this.setState({timerId: newTimerId, timeoutId: newTimeoutId})

        if(!isChangeSpeed) setTimeout(this.endGame, 30000)
    }

    // function to end the game
   endGame = () => {
        clearInterval(this.state.timerId)
        clearInterval(this.state.timeoutId)
        this.setState({isActive: false, timeoutId: null, timerId: null})
    }

    playSound = (hit = false) => {
        var whoosh = new Sound(hit ? 'mole.mp3' : 'oops.mp3', Sound.MAIN_BUNDLE, (error) => {
            if (error) return logger.log(`Failed to load the sound with error ${error}`);
            whoosh.play();
          });
    }

    hit = () => {

        const { hit, isActive } = this.state;

        const { started, addPoint, decreasePoints } = this.props;

        if(!hit && isActive){
            this.playSound(true)
            this.setState({ hit : true, isActive: false})
            addPoint()
        }
        else if(started) {
            this.playSound()
            decreasePoints()
        }
    }

    render(){

        const { started } = this.props;

        const { hit } = this;

        const { isActive } = this.state;

            return (
                <TouchableOpacity onPress={hit} >
                    <Image 
                    source={started && isActive? require('../assets/images/mole.png'): require('../assets/images/hole.png')} 
                    style={isActive? styles.mole : styles.square}>
                    </Image>
                </TouchableOpacity>
            )
        };

}

const styles = StyleSheet.create({
    square: {
        flex: 1,
        minWidth: 80,
        minHeight: 80,
        margin: 10,
        backgroundColor: '#9BF89C',
        width: '100%'
    },
    mole: {
        flex: 1,
        minWidth: 80,
        minHeight: 80,
        margin: 10,
        backgroundColor: '#9BF89C', 
        width: '100%'
    },
    x: {
        fontWeight: 'bold',
        fontSize: 65,
        textAlign: 'center',
    }
})

const mapStateToProps = (state) => {
    return {
        score: state.score
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        addPoint: () => dispatch(addPoint()),
        decreasePoints: () => dispatch(decreasePoints())
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(Mole)