import React, { useCallback, useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import axios from 'axios';
import { Audio } from 'expo-av';

import * as firebase from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import 'firebase/database';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyAx4pq5hjlUNCCZEiajoY2_wRMGrK6dmIM",
  authDomain: "coinis-speech-to-text.firebaseapp.com",
  databaseURL: "https://coinis-speech-to-text-default-rtdb.firebaseio.com",
  projectId: "coinis-speech-to-text",
  storageBucket: "coinis-speech-to-text.appspot.com",
  messagingSenderId: "454443681470",
  appId: "1:454443681470:web:55f585a42f3685a654c0ef",
  measurementId: "G-DR0SYGYYRD"
};

const app = firebase.initializeApp(firebaseConfig);
const auth = getAuth(app);

const email = 'test@mail.com';
const password = 'test123';

signInWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    const user = userCredential.user;
  })
  .catch((error) => {
    console.error('AUTH ERROR:', error.message);
  });

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordingButton: {
    margin: 10,
    padding: 10,
    backgroundColor: 'red',
  },
  recordingButtonText: {
    color: 'black',
    fontSize: 18,
  },
  transcriptionText: {
    marginTop: 20,
    fontSize: 16,
  },
});

const AudioRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recording, setRecording] = React.useState();
  const [result, setResult] = useState('');
  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

  const startRecording = async () => {
  
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

      const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
      if (isSafari) {
        recordingOptions.web.mimeType = 'audio/mp4';
        recordingOptions.web.audioEncoder = 'audio/mp4';
      }

      console.log('Starting recording..');
      const { recording } = await Audio.Recording.createAsync(recordingOptions);
      setRecording(recording);
      console.log('Recording started');
      setIsRecording(true)
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  };

  const stopRecording = async () => {
    try {
      if (recording) {
        setRecording(undefined);
        await recording.stopAndUnloadAsync();
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
        });
        const uri = recording.getURI();
        console.log('Recording stopped and stored at', uri);
  
        const storageRef = await uploadFileToFirebase(uri, isSafari ? '.mp4' : '.m4a');
  
        const downloadURL = await getDownloadUrlFromFirebase(storageRef);

        const audioFile = {
          uri: downloadURL,
          type: 'audio/m4a',
          name: 'audio.m4a',
        };
        await sendAudioToServer(audioFile);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const storage = getStorage(app);

  const uploadFileToFirebase = async (uri, extension = '.m4a') => {
    try {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', uri, true);
      xhr.responseType = 'arraybuffer';
  
      return new Promise((resolve, reject) => {
        xhr.onload = function () {
          if (xhr.status === 200) {
            resolve(xhr.response);
          } else {
            reject(new Error('Failed to fetch audio file'));
          }
        };
        xhr.onerror = function () {
          reject(new Error('Failed to fetch audio file'));
        };
        xhr.send();
      }).then((arrayBuffer) => {
        const blob = new Blob([arrayBuffer], { type: 'audio/m4a' });
        const file = new File([blob], `audio${extension}`, { type: 'audio/m4a' });
  
        const storageRef = ref(storage, `audio/${new Date().toISOString()}${extension}`);
        return uploadBytes(storageRef, file).then(() => storageRef);
      });
    } catch (error) {
      console.error('Error uploading file to Firebase:', error);
      throw error;
    }
  };
  
  

  // const sendAudioToServer = async (audioFileUri) => {
  //   const formData = new FormData();
  //   formData.append('file', {
  //     uri: audioFileUri,
  //     type: 'audio/aac',
  //     name: 'audio.aac',
  //   });

  //   try {
  //     const response = await axios.post(
  //       'http://127.0.0.1:8000/whisper/transcribe/',
  //       formData
  //     );
  //     const transcription = response.data.recognized_text;
  //     setResult(transcription);
  //     console.log(result)
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  const getDownloadUrlFromFirebase = async (storageRef) => {
    try {
      const downloadURL = await getDownloadURL(storageRef);
      return downloadURL;
    } catch (error) {
      console.error('Ошибка получения URL из Firebase Storage:', error);
      throw error;
    }
  };

  const sendAudioToServer = async (audioFile) => {
    console.log(audioFile);
    const formData = new FormData();
  
    try {
      // const response = await fetch('https://cors-anywhere.herokuapp.com/' + audioFile.uri);
      const response = await fetch(audioFile.uri, {mode: 'cors'});
      console.log(response)
      const arrayBuffer = await response.arrayBuffer();
  
      const mimeType = isSafari ? 'audio/mp4' : 'audio/m4a';
      const fileExtension = isSafari ? 'mp4' : 'm4a';
  
      const blob = new Blob([arrayBuffer], { type: mimeType });
  
      const fileName = 'audio.' + fileExtension;
      const file = new File([blob], fileName, { type: mimeType });
  
      formData.append('file', file);
      formData.append('model', 'whisper-1');
  
      const uploadResponse = await axios.post(
        'https://api.openai.com/v1/audio/transcriptions',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': 'Bearer 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',
          },
        }
      );
  
      const transcription = uploadResponse.data.text;
      setResult(transcription);
      console.log(result);
    } catch (error) {
      console.error(error);
    }
  };
  
  
  
  
  
  
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
