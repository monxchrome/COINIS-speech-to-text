import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import axios from 'axios';
import { Audio, RecordingOptionsPreset } from 'expo-av';

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
        setRecording(undefined)
        await recording.stopAndUnloadAsync();
        await Audio.setAudioModeAsync(
          {
            allowsRecordingIOS: false,
          }
        );
        const uri = recording.getURI();
        console.log('Recording stopped and stored at', uri);
        sendAudioToServer(uri)
      }
    } catch(e) {
      console.log(e)
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

  const sendAudioToServer = async (audioFileUri) => {
    const formData = new FormData();
    formData.append('file', {
      uri: audioFileUri,
      type: 'audio/m4a',
      name: 'audio.m4a',
    });
    formData.append('model', 'whisper-1'); // Добавляем параметр model
  
    try {
      const response = await axios.post(
        'https://api.openai.com/v1/audio/transcriptions',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': 'Bearer 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',
          },
        }
      );
      const transcription = response.data.text;
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
