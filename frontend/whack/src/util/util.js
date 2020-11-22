import { Alert } from "react-native";
import axios from 'axios';
import config from '../config/config';
import * as Auth from '../services/authService';
import * as logger from '../services/loggerService';

export const wait = (timeout) => {
    return new Promise((resolve) => {
      setTimeout(resolve, timeout);
    });
  };

export const delayedAlert = (text, text2 = '') => {
    wait(1000).then(() => Alert.alert(text, text2 !== '' ? text2 : null))
}

export const validateEmail = (email) => {
  return email.match('(.+)@(.+){2,}.(.+){2,}');
};

export const parseStatusCode = (error) => {
  return error.message.substring(error.message.length - 3, error.message.length)
}

export const fetchNewScore = async () => {

  try {
    
  let token = await Auth.getToken()

  if(token){

    try {
      
      let { data: info } = await axios.get(config.API.ENDPOINTS.SCORE, { headers: { token }}) 

      let score = info.data.points; 

      return score;
      
   } catch (error) {
     logger.log(`Error fetching user's top highscore with error ${error}`)
     return false;
   }

  }
  else {
    logger.log(`No auth token found`)
    return false;
  }

} catch (error) {
    logger.log(`Error fetching new score ${error}`)
    return false;
}
  
}