import React from 'react';
import { StyleSheet, Dimensions, View, TextInput } from 'react-native';

const { height, width } = Dimensions.get('window');

export default buildTextInput = (placeholder, value, secureTextEntry = false, onChangeText) => {
    return (
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.inputText}
          placeholder={placeholder}
          placeholderTextColor="grey"
          value={value}
          autoCapitalize='none'
          secureTextEntry={secureTextEntry}
          onChangeText={(text) => onChangeText(text)}
        />
      </View>
    );
};

const styles = StyleSheet.create({
     display:{
      fontSize: 30,
      fontWeight: '500',
      marginTop: 20,
      marginBottom: height * 0.075,
     },
     inputContainer: {
      width: width * 0.6,
      height: height * 0.05,
      flexDirection: "row",
      borderBottomWidth: 1,
      paddingBottom: 10,
      padding: 10,
      borderWidth: 1,
      borderRadius: 10,
      borderColor: "#009345",
      backgroundColor: "#FFF",
      marginBottom: 20,
    },
    inputText: {
      flex: 1,
      fontSize: 15,
    },
})