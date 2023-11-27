import React, { useCallback, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import AudioRecorder from './components/AudioRecorder/AudioRecorder';

const App = () => {
  return (
    <View style={styles.container}>
      <AudioRecorder />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;
