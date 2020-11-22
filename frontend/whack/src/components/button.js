import React from 'react';
import { StyleSheet, Text, TouchableOpacity, Dimensions} from 'react-native';

const { width } = Dimensions.get('window');

export default buildButton = (text, onPress = null, small = false) => {
    return (
      <TouchableOpacity onPress={onPress} style={styles.loginButton}>
        <Text style={styles.loginButton_text}>{text}</Text>
      </TouchableOpacity>
    );
  };

  const styles = StyleSheet.create({
    loginButton:{
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
  })