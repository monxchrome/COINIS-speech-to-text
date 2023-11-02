import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import VoiceRecorder from '../components/VoiceRecorder';

const HomeScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Voice Recording App</Text>
      <VoiceRecorder />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default HomeScreen;
