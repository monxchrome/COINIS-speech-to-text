import {
  initializeAuth,
  getReactNativePersistence,
  signInWithEmailAndPassword,
  getAuth,
} from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

import {
  EXPO_PUBLIC_FIREBASE_KEY,
  EXPO_PUBLIC_FIREBASE_DOMAIN,
  EXPO_PUBLIC_FIREBASE_URL,
  EXPO_PUBLIC_FIREBASE_ID,
  EXPO_PUBLIC_FIREBASE_BUCKET,
  EXPO_PUBLIC_FIREBASE_MESSAGE,
  EXPO_PUBLIC_FIREBASE_APP_ID,
  EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID,
  EXPO_PUBLIC_EMAIL,
  EXPO_PUBLIC_PASSWORD,
} from '@env';

const firebaseConfig = {
  apiKey: `${EXPO_PUBLIC_FIREBASE_KEY}`,
  authDomain: `${EXPO_PUBLIC_FIREBASE_DOMAIN}`,
  databaseURL: `${EXPO_PUBLIC_FIREBASE_URL}`,
  projectId: `${EXPO_PUBLIC_FIREBASE_ID}`,
  storageBucket: `${EXPO_PUBLIC_FIREBASE_BUCKET}`,
  messagingSenderId: `${EXPO_PUBLIC_FIREBASE_MESSAGE}`,
  appId: `${EXPO_PUBLIC_FIREBASE_APP_ID}`,
  measurementId: `${EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID}`,
};

let app;
let auth;

if (typeof window !== 'undefined') {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
} else {
  const isIOS =
    /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

  if (isIOS) {
    app = initializeApp(firebaseConfig);
    auth = initializeAuth(app, {
      persistence: getReactNativePersistence(ReactNativeAsyncStorage),
    });
  } else {
    console.error('Unsupported platform');
  }
}

const email = `${EXPO_PUBLIC_EMAIL}`;
const password = `${EXPO_PUBLIC_PASSWORD}`;

signInWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    const user = userCredential.user;
  })
  .catch((error) => {
    console.error('AUTH ERROR:', error.message);
  });

const storage = getStorage(app);

export const uploadFileToFirebase = async (uri, extension = '.m4a') => {
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

      const storageRef = ref(
        storage,
        `audio/${new Date().toISOString()}${extension}`,
      );

      return uploadBytes(storageRef, file).then(() => storageRef);
    });
  } catch (error) {
    console.error('Error uploading file to Firebase:', error);
    throw error;
  }
};

export const getDownloadUrlFromFirebase = async (storageRef) => {
  try {
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  } catch (error) {
    console.error('Ошибка получения URL из Firebase Storage:', error);
    throw error;
  }
};
