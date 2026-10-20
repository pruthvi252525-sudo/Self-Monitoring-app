import { initializeApp } from 'firebase/app';
import {
  GoogleAuthProvider,
  getAuth,
  signInWithPopup,
  signOut as firebaseSignOut,
} from 'firebase/auth';
import type { Auth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import type { Firestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import type { FirebaseStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const isFirebaseConfigured = Object.values(firebaseConfig).every(Boolean);

let auth: Auth | null = null;
let db: Firestore | null = null;
let storage: FirebaseStorage | null = null;

if (isFirebaseConfigured) {
  const app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
}

export { auth, db, storage };

export async function signInWithGoogle(): Promise<void> {
  if (!auth) throw new Error('Firebase is not configured. Add the Firebase settings and restart the app.');
  await signInWithPopup(auth, new GoogleAuthProvider());
}

export async function signOut(): Promise<void> {
  if (!auth) throw new Error('Firebase is not configured.');
  await firebaseSignOut(auth);
}

export function getFirebaseErrorMessage(error: unknown): string {
  if (error && typeof error === 'object' && 'code' in error) {
    switch (error.code) {
      case 'auth/popup-closed-by-user':
        return 'The Google sign-in window was closed before sign-in finished.';
      case 'auth/popup-blocked':
        return 'Your browser blocked the Google sign-in window. Allow pop-ups and try again.';
      case 'auth/unauthorized-domain':
        return 'This site is not authorized for Firebase sign-in. Add its domain in Firebase Authentication settings.';
      case 'auth/operation-not-allowed':
        return 'Google sign-in is not enabled for this Firebase project.';
      case 'permission-denied':
        return 'Firebase denied access. Check that the Firestore and Storage security rules are published.';
    }
  }

  return error instanceof Error ? error.message : 'An unexpected Firebase error occurred.';
}
