import React, { Component } from 'react';
import { Provider as StateProvider } from 'react-redux'
import SplashScreen from 'react-native-splash-screen'
import store from './src/redux/store';

import Navigation from './src/navigation/Navigation';
import * as Auth from './src/services/authService';

class App extends Component {

  state = {
    token: false,
    loading: false
  }

  async componentDidMount(){
    SplashScreen.hide()
    this.setState({ loading: true })
    await this.setup()
  }

  // validates auth token
  setup = async () => {
    
    const token = await Auth.getToken()

    if(token) this.setState({ token: true })

    this.setState({loading: false})
  }

  render(){

    if(this.state.loading) return null;

    return (
      <StateProvider store={store}>
        <Navigation token={this.state.token}/>
      </StateProvider>
    );
  }
};

export default App;
