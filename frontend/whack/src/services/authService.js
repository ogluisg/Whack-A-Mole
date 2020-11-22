import AsyncStorage from '@react-native-community/async-storage';

const tokenKey = 'token'

const scoreKey = 'score'

export const getToken = () => {
   return AsyncStorage.getItem(tokenKey)
}

export const setToken = (token) => {
    return AsyncStorage.setItem(tokenKey, token)
}

export const removeToken = () => {
    return AsyncStorage.removeItem(tokenKey)
}

export const getScore = () => {
    return AsyncStorage.getItem(scoreKey)
}

export const setScore = (score) => {
    return AsyncStorage.setItem(scoreKey, score.toString())
}