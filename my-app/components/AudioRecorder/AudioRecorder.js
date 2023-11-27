import React, { useState, useCallback } from 'react';
import { View, Text, Button } from 'react-native';
import { Audio } from 'expo-av';
import { uploadFileToFirebase, getDownloadUrlFromFirebase } from './firebase';
import { sendAudioToServer } from './api';
import styles from './styles';

const AudioRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recording, setRecording] = React.useState();
  const [result, setResult] = useState('');
  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

  const startRecording = useCallback(async () => {
    try {
      console.log('Requesting permissions..');
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const recordingOptions = {
        android: {
          extension: '.m4a',
          outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_MPEG_4,
          audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_AAC,
          sampleRate: 44100,
          numberOfChannels: 2,
          bitRate: 128000,
        },
        ios: {
          extension: '.m4a',
          outputFormat: Audio.RECORDING_OPTION_IOS_OUTPUT_FORMAT_MPEG4AAC,
          audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_MAX,
          sampleRate: 44100,
          numberOfChannels: 2,
          bitRate: 128000,
          linearPCMBitDepth: 16,
          linearPCMIsBigEndian: false,
          linearPCMIsFloat: false,
        },
        web: {
          mimeType: 'audio/webm',
          bitsPerSecond: 128000,
          audioEncoder: 'audio/webm',
        },
      };

      const isSafari = /^((?!chrome|android).)*safari/i.test(
        navigator.userAgent,
      );
      if (isSafari) {
        recordingOptions.web.mimeType = 'audio/mp4';
        recordingOptions.web.audioEncoder = 'audio/mp4';
      }

      console.log('Starting recording..');
      const { recording } = await Audio.Recording.createAsync(recordingOptions);
      setRecording(recording);
      console.log('Recording started');
      setIsRecording(true);
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  });

  const stopRecording = useCallback(async () => {
    try {
      if (recording) {
        setRecording(undefined);
        await recording.stopAndUnloadAsync();
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
        });
        const uri = recording.getURI();
        console.log('Recording stopped and stored at', uri);

        const storageRef = await uploadFileToFirebase(
          uri,
          isSafari ? '.mp4' : '.m4a',
        );

        const downloadURL = await getDownloadUrlFromFirebase(storageRef);

        const audioFile = {
          uri: downloadURL,
          type: 'audio/m4a',
          name: 'audio.m4a',
        };

        const transcriptionResult = await sendAudioToServer(audioFile);
        setResult(transcriptionResult);
      }
    } catch (e) {
      console.log(e);
    }
  });

  return (
    <View style={styles.container}>
      <Button
        style={styles.recordingButton}
        title={recording ? 'Stop Recording' : 'Start Recording'}
        onPress={recording ? stopRecording : startRecording}
      />
      {result && (
        <Text style={styles.recordingButtonText}>Transcription: {result}</Text>
      )}
    </View>
  );
};

export default AudioRecorder;
