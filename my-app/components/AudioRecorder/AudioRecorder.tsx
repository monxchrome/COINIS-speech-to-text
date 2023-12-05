import React from 'react';
import { View, Text } from 'react-native';
import styles from './styles';
import { useAppContext } from '../../contexts/context';
import { useMediaQuery } from '@react-hook/media-query';

const AudioRecorder = () => {
  const { result, isRecording } = useAppContext();
  console.log('Is Recording:', isRecording);
  const isSmallScreen = useMediaQuery('(max-width: 800px)');

  return (
    <View style={styles.TextView}>
      {isRecording ? (
        <View
          style={[
            styles.isRecordingView,
            isSmallScreen && styles.mobileIsRecordingView,
          ]}
        >
          <Text style={styles.Text}>Recording...</Text>
        </View>
      ) : (
        <View>
          {result ? (
            <View style={[styles.Main, isSmallScreen && styles.mobileMain]}>
              <View
                style={[
                  styles.container,
                  isSmallScreen && styles.mobileContainer,
                ]}
              >
                <Text style={[styles.Text, isSmallScreen && styles.mobileText]}>
                  Transcription:
                </Text>
                <Text>{result}</Text>
              </View>
            </View>
          ) : (
            <View>
              <Text style={[styles.Text, isSmallScreen && styles.mobileText]}>
                Try CoinisAI Real-Time in your browser.
              </Text>
              <Text
                style={[
                  styles.Description,
                  isSmallScreen && styles.mobileDescription,
                ]}
              >
                CoinisAI Real-Time Transcription service allows you to
                transcribe live audio streams with high accuracy and low
                latency.
              </Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
};

export default AudioRecorder;
