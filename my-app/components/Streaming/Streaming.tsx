import { Text, View, TouchableOpacity, Image } from 'react-native';
import styles from './styles';
import React, { useState, useCallback } from 'react';
import { Audio } from 'expo-av';
import {
  uploadFileToFirebase,
  getDownloadUrlFromFirebase,
} from '../../components/AudioRecorder/firebase';
import { sendAudioToServer } from '../../components/AudioRecorder/api';
import { useAppContext } from '../../contexts/context';

const Streaming = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recording, setRecording] = useState<Audio.Recording | undefined>(undefined);
  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

  const { setStreamingResult, setRecordingStatus } = useAppContext();

  const startRecording = useCallback(async () => {
    try {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const recordingOptions = {
        android: {
          extension: '.m4a',
          // @ts-ignore
          outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_MPEG_4,
          // @ts-ignore
          audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_AAC,
          sampleRate: 44100,
          numberOfChannels: 2,
          bitRate: 128000,
        },
        ios: {
          extension: '.m4a',
          // @ts-ignore
          outputFormat: Audio.RECORDING_OPTION_IOS_OUTPUT_FORMAT_MPEG4AAC,
          // @ts-ignore
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

      console.log('Detected browser:', isSafari ? 'Safari' : 'Not Safari');
      console.log('MIME type:', recordingOptions.web.mimeType);

      console.log('Starting recording..');
      const { recording } = await Audio.Recording.createAsync(recordingOptions);
      setRecording(recording);
      console.log('Recording started');
      setIsRecording(true);
      setRecordingStatus(true);
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  }, [setRecording, setIsRecording, setRecordingStatus]);

  const stopRecording = useCallback(async () => {
    try {
      if (recording) {
        setRecording(undefined);
        const audioRecording = recording as Audio.Recording;
      
        await audioRecording.stopAndUnloadAsync();
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
        setStreamingResult(transcriptionResult);
        setRecordingStatus(false);
      }
    } catch (e) {
      console.log(e);
    }
  }, [recording, setRecording, setIsRecording, setRecordingStatus, isSafari]);

  return (
    <View style={styles.Streaming}>
      <View style={styles.ViewText}>
        <Text style={styles.Text}>
          Start speaking in real-time to see your transcription:
        </Text>
      </View>
      <View style={styles.ButtonView}>
        <TouchableOpacity
          style={styles.Button}
          onPress={recording ? stopRecording : startRecording}
        >
          <Text style={styles.ButtonText}>
            {recording ? 'Stop Recording' : 'Start Recording'}
          </Text>
          <Image source={require('../../assets/Microphone.svg')} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Streaming;
