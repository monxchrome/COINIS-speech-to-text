import axios from 'axios';
//@ts-ignore
import { EXPO_PUBLIC_OPENAI_API_KEY, EXPO_PUBLIC_API } from '@env';

export const sendFileToServer = async (audioFile) => {
  const formData = new FormData();

  formData.append('file', audioFile);
  formData.append('model', 'whisper-1');

  try {
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
    throw error;
  }
};
