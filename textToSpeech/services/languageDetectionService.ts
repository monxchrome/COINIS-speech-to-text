import {SpeechClient} from '@google-cloud/speech';

// Создайте экземпляр клиента Speech
const speechClient = new SpeechClient({
  keyFilename: 'path/to/your/service-account-key.json',
});

// @ts-ignore
export const determineLanguage = async text => {
  try {
    const request = {
      content: text,
    };

    // @ts-ignore
    const [response] = await speechClient.recognize(request);

    if (response && response.results && response.results.length > 0) {
      const language = response.results[0].languageCode;
      return language;
    }

    return null;
  } catch (error) {
    console.error('Language detection error:', error);
    return null;
  }
};
