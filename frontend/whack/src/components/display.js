import React from 'react';
import { StyleSheet, Text, Dimensions} from 'react-native';

const { height } = Dimensions.get('window');

export default buildDisplay = (text, large = true) =>{
  return (
    <Text style={[styles.display, !large ? {fontSize: 15, marginBottom: 5, fontWeight: '300'}: null]}>{text}</Text>
  )
}

const styles = StyleSheet.create({
     display:{
      fontSize: 30,
      fontWeight: '500',
      marginTop: 20,
      marginBottom: height * 0.075,
     }
})