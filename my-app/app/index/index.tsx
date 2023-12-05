import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import AudioRecorder from '../../components/AudioRecorder/AudioRecorder';
import LeftBar from '../../components/LeftBar/LeftBar';
import { AppProvider } from '../../contexts/context';
import { useMediaQuery } from '@react-hook/media-query';

const App = () => {
  const isSmallScreen = useMediaQuery('(max-width: 800px)');

  return (
    <AppProvider>
      <View style={[styles.container, !isSmallScreen && styles.containerWeb]}>
        {Platform.OS === 'web' ? (
          <>
            {isSmallScreen ? (
              <>
                <AudioRecorder />
                <LeftBar />
              </>
            ) : (
              <>
                <LeftBar />
                <AudioRecorder />
              </>
            )}
          </>
        ) : (
          <>
            <AudioRecorder />
            <LeftBar />
          </>
        )}
      </View>
    </AppProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
    backgroundColor: '#fff',
  },
  containerWeb: {
    flexDirection: 'row',
  },
});

export default App;
