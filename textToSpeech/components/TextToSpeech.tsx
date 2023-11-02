import React, {useState, useEffect} from 'react';
import {View, Text, Button} from 'react-native';
import Voice from '@react-native-voice/voice';

const TextToSpeech = () => {
  const [state, setState] = useState({
    isRecording: false,
    transcription: '',
    detectedLanguage: '',
  });

  useEffect(() => {
    // @ts-ignore
    const onSpeechResults = async results => {
      if (results.value && results.value.length > 0) {
        const recognizedText = results.value[0];

        const detectedLanguage = await detectLanguageWithWhisper(
          recognizedText,
        );

        setState(prevState => ({
          ...prevState,
          transcription: recognizedText,
          detectedLanguage,
        }));
      }
    };

    Voice.onSpeechResults = onSpeechResults;

    return () => {
      Voice.removeAllListeners();
    };
  }, []);

  const startRecording = async () => {
    try {
      await Voice.start({
        language: state.detectedLanguage,
      });
      setState(prevState => ({
        ...prevState,
        isRecording: true,
      }));
    } catch (error) {
      console.error('Voice recording error:', error);
    }
  };

  const stopRecording = async () => {
    try {
      await Voice.stop();
      setState(prevState => ({
        ...prevState,
        isRecording: false,
      }));
    } catch (error) {
      console.error('Voice recording error:', error);
    }
  };

  // @ts-ignore
  const detectLanguageWithWhisper = async text => {
    try {
      const response = await fetch(
        'https://api.openai.com/v1/audio/transcriptions',
        {
          method: 'POST',
          headers: {
            Authorization:
              'Bearer sk-Lrxlqvgs9yourgUk357UT3BlbkFJNM0mFWjtrQRJgDPGYUHR',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text: text,
            model: 'whisper-large',
          }),
        },
      );

      if (response.status === 200) {
        const data = await response.json();
        if (data.language) {
          return data.language;
        }
      }

      return 'Unknown';
    } catch (error) {
      console.error('Language detection error:', error);
      return 'Unknown';
    }
  };

  return (
    <View>
      <Text>Voice Recorder:</Text>
      <Text>Recording: {state.isRecording ? 'Yes' : 'No'}</Text>
      <Text>Transcription: {state.transcription}</Text>
      <Text>Detected Language: {state.detectedLanguage}</Text>
      <Button
        title={state.isRecording ? 'Stop Recording' : 'Start Recording'}
        onPress={state.isRecording ? stopRecording : startRecording}
      />
    </View>
  );
};

export default TextToSpeech;
