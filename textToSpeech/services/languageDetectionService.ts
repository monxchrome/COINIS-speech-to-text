import axios from 'axios';

// @ts-ignore
export const determineLanguage = async audioFile => {
  try {
    const apiUrl = 'http://127.0.0.1:8000/transcribe-audio/';
    const formData = new FormData();
    formData.append('audio_file', {
      uri: audioFile,
      type: 'audio/mpeg',
      name: 'audio.mp3',
    });

    const response = await axios.post(apiUrl, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    console.log(`ebat ${response.data}`);

    if (response.status === 200) {
      return response.data.transcription;
    } else {
      throw new Error('Language detection failed');
    }
  } catch (error) {
    console.error('Language detection error:', error);
    throw error;
  }
};
