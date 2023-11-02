import React, {useState, useEffect} from 'react';
import {View, Text, Button} from 'react-native';
import Voice from '@react-native-voice/voice';

const TextToSpeech = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState('');

  useEffect(() => {
    Voice.onSpeechResults = results => {
      //@ts-ignore
      setTranscription(results[0]);
    };

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const startRecording = async () => {
    try {
      await Voice.start('en-US');
      setIsRecording(true);
    } catch (error) {
      console.error('Voice recording error:', error);
    }
  };

  const stopRecording = async () => {
    try {
      await Voice.stop();
      setIsRecording(false);
    } catch (error) {
      console.error('Voice recording error:', error);
    }
  };

  return (
    <View>
      <Text>Speech to Text:</Text>
      <Text>{transcription}</Text>
      <Button
        title={isRecording ? 'Stop Recording' : 'Start Recording'}
        onPress={isRecording ? stopRecording : startRecording}
      />
    </View>
  );
};

export default TextToSpeech;
