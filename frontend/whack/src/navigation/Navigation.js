import React from 'react';

import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen'
import Scoreboard from '../screens/ScoreBoard';
import GameScreen from '../screens/GameScreen';

const Navigation = (props) => {

    const Stack = createStackNavigator();

    return (
        <>
        {props.token ?

        // if user is logged in (authenticated)
        (
            <NavigationContainer>
                <Stack.Navigator>
                    <Stack.Screen name='GameScreen' component={GameScreen} options={{headerShown: false}} /> 
                    <Stack.Screen name='Login'  component={LoginScreen} options= {{headerShown: false}}/>
                    <Stack.Screen name='Register' component={RegisterScreen} options={{ headerTitleStyle:{color:'white'}, headerStyle: {backgroundColor: "#009345"}}}/>     
                    <Stack.Screen name='Scoreboard' component={Scoreboard} options= {{headerShown: false}} />
                </Stack.Navigator>
            </NavigationContainer>
        ):

        // if user is not logged in (not authenticated)
        (
            <NavigationContainer>
                <Stack.Navigator>
                    <Stack.Screen name='Login'  component={LoginScreen} options= {{headerShown: false}}/>
                    <Stack.Screen name='Register' component={RegisterScreen} options={{ headerTitleStyle:{color:'white'}, headerStyle: {backgroundColor: "#009345"}}}/>     
                    <Stack.Screen name='GameScreen' component={GameScreen} options={{headerShown: false}} />  
                    <Stack.Screen name='Scoreboard' component={Scoreboard} options= {{headerShown: false}} />
                </Stack.Navigator>
            </NavigationContainer>
        )
        }
        </>
    )
}

export default Navigation;