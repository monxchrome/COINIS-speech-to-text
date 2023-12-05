import axios from 'axios';
import { EXPO_PUBLIC_OPENAI_API_KEY, EXPO_PUBLIC_API } from '@env';

export const sendAudioToServer = async (audioFile) => {
  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  const formData = new FormData();

  try {
    const response = await fetch(audioFile.uri, { mode: 'cors' });
    console.log(response);
    const arrayBuffer = await response.arrayBuffer();
    const mimeType = isSafari ? 'audio/mp4' : 'audio/m4a';
    const fileExtension = isSafari ? 'mp4' : 'm4a';

    const blob = new Blob([arrayBuffer], { type: mimeType });

    const fileName = 'audio.' + fileExtension;
    const file = new File([blob], fileName, { type: mimeType });

    formData.append('file', file);
    formData.append('model', 'whisper-1');

    const uploadResponse = await axios.post(`${EXPO_PUBLIC_API}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${EXPO_PUBLIC_OPENAI_API_KEY}`,
      },
    });

    const transcription = uploadResponse.data.text;

    return transcription;
  } catch (error) {
    console.error(error);
  }
};
