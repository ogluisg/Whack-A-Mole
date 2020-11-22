import React from 'react';
import { Modal, ActivityIndicator, StyleSheet, View } from 'react-native';

export default buildLoadingIndicator = (visible) => {
    return (
        <View>
            <Modal animationType="slide" transparent={true} visible={visible}>
                <ActivityIndicator size="large" color='green' style={styles.loading}/>
            </Modal>
        </View>
    )
}

const styles = StyleSheet.create({
    loading: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      backgroundColor: '#F5FCFF88',
      alignItems: 'center',
      justifyContent: 'center'
    },
})