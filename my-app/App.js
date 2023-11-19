import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import axios from 'axios';
import { Audio, RecordingOptionsPreset } from 'expo-av';

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
    console.log('Успешная аутентификация:', user);
  })
  .catch((error) => {
    console.error('Ошибка аутентификации:', error.message);
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

  const startRecording = async () => {
  
    try {
      console.log('Requesting permissions..');
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      console.log('Starting recording..');
      const { recording } = await Audio.Recording.createAsync( Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
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
  
        // Загрузите файл в Firebase Storage
        const storageRef = await uploadFileToFirebase(uri);
  
        // Получите URL загруженного файла из Firebase Storage
        const downloadURL = await getDownloadUrlFromFirebase(storageRef);
  
        // Отправьте файл Firebase Storage в API OpenAI
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

  const uploadFileToFirebase = async (uri) => {
    try {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', uri, true);
      xhr.responseType = 'arraybuffer';  // Используем arraybuffer вместо blob
  
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
        // Создайте Blob из ArrayBuffer с правильным типом
        const blob = new Blob([arrayBuffer], { type: 'audio/m4a' });
        // Создайте File из Blob с использованием временного имени файла
        const file = new File([blob], 'audio.m4a', { type: 'audio/m4a' });
  
        const storageRef = ref(storage, 'audio/' + new Date().toISOString() + '.m4a');
        return uploadBytes(storageRef, file).then(() => storageRef);
      });
    } catch (error) {
      console.error('Ошибка загрузки файла в Firebase:', error);
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
    const formData = new FormData();
  
    try {
      const response = await fetch(audioFile.uri);
      const arrayBuffer = await response.arrayBuffer();
  
      const blob = new Blob([arrayBuffer], { type: 'audio/m4a' });
  
      const file = new File([blob], 'audio.m4a', { type: 'audio/m4a' });
  
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
