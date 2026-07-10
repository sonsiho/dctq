import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAnalytics, isSupported, type Analytics } from 'firebase/analytics';
import { getAuth, signInAnonymously, type User } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

export const firebaseConfig = {
  apiKey: 'AIzaSyAXuvX5bUBTHyyCy9Bhtvn37NRM2RHmulw',
  authDomain: 'dctq-69844.firebaseapp.com',
  projectId: 'dctq-69844',
  storageBucket: 'dctq-69844.firebasestorage.app',
  messagingSenderId: '448544299065',
  appId: '1:448544299065:web:0de25a48d98d0d47e955e8',
  measurementId: 'G-P8P14DCF1J',
};

export const firebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const firestore = getFirestore(firebaseApp);
export const firebaseAuth = getAuth(firebaseApp);

let analyticsPromise: Promise<Analytics | null> | undefined;
let authPromise: Promise<User> | undefined;

export function initializeFirebaseAnalytics(): Promise<Analytics | null> {
  analyticsPromise ??= isSupported()
    .then((supported) => (supported ? getAnalytics(firebaseApp) : null))
    .catch((error) => {
      console.warn('Firebase Analytics is not available in this environment.', error);
      return null;
    });

  return analyticsPromise;
}

export function ensureAuthenticatedUser(): Promise<User> {
  if (firebaseAuth.currentUser) {
    return Promise.resolve(firebaseAuth.currentUser);
  }

  authPromise ??= signInAnonymously(firebaseAuth)
    .then((credential) => credential.user)
    .catch((error) => {
      authPromise = undefined;
      throw error;
    });
  return authPromise;
}
