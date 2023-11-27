import React, { useCallback, useState } from 'react';
import { View } from 'react-native';
import AudioRecorder from './components/AudioRecorder/AudioRecorder';

const App = () => {
  return (
    <View>
      <AudioRecorder />
    </View>
  );
};

export default App;
