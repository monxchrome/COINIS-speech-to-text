import React, {useState, useEffect} from 'react';
import {View, Text, Button} from 'react-native';
import Voice, {SpeechResultsEvent} from '@react-native-voice/voice';

interface VoiceRecorderState {
  isRecording: boolean;
  transcription: string;
}

const VoiceRecorder: React.FC = () => {
  const [state, setState] = useState<VoiceRecorderState>({
    isRecording: false,
    transcription: '',
  });

  useEffect(() => {
    const onSpeechResults = (results: SpeechResultsEvent) => {
      if (results.value && results.value.length > 0) {
        setState(prevState => ({
          ...prevState,
          // @ts-ignore
          transcription: results.value[0],
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
      await Voice.start({language: 'en-US'});
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

  return (
    <View>
      <Text>Voice Recorder:</Text>
      <Text>Recording: {state.isRecording ? 'Yes' : 'No'}</Text>
      <Text>Transcription: {state.transcription}</Text>
      <Button
        title={state.isRecording ? 'Stop Recording' : 'Start Recording'}
        onPress={state.isRecording ? stopRecording : startRecording}
      />
    </View>
  );
};

export default VoiceRecorder;
