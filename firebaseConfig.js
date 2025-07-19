import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const apiKey = process.env.EXPO_PUBLIC_API_KEY;
const authDomain = process.env.EXPO_PUBLIC_AUTH_DOMAIN;
const databaseURL = process.env.EXPO_PUBLIC_DATABASE_URL;
const projectId = process.env.EXPO_PUBLIC_PROJECT_ID;
const storageBucket = process.env.EXPO_PUBLIC_STORAGE_BUCKET;
const messagingSenderId = process.env.EXPO_PUBLIC_MESSAGING_SENDER_ID;
const appId = process.env.EXPO_PUBLIC_APP_ID;
const measurementId = process.env.EXPO_PUBLIC_MEASUREMENT_ID;

 
const firebaseConfig = {
  apiKey,
  authDomain,
  databaseURL,
  projectId,
  storageBucket,
  messagingSenderId,
  appId,
  measurementId
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export { auth };

