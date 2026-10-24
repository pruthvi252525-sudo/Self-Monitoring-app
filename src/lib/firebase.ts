import { initializeApp } from 'firebase/app';
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  getAuth,
  signInWithEmailAndPassword,
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

export const missingFirebaseEnvVariables = [
  ['VITE_FIREBASE_API_KEY', firebaseConfig.apiKey],
  ['VITE_FIREBASE_AUTH_DOMAIN', firebaseConfig.authDomain],
  ['VITE_FIREBASE_PROJECT_ID', firebaseConfig.projectId],
  ['VITE_FIREBASE_STORAGE_BUCKET', firebaseConfig.storageBucket],
  ['VITE_FIREBASE_MESSAGING_SENDER_ID', firebaseConfig.messagingSenderId],
  ['VITE_FIREBASE_APP_ID', firebaseConfig.appId],
]
  .filter(([, value]) => !value?.trim())
  .map(([name]) => name);

export const isFirebaseConfigured = missingFirebaseEnvVariables.length === 0;

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

export async function signInWithEmail(email: string, password: string): Promise<void> {
  if (!auth) throw new Error('Firebase is not configured. Add the Firebase settings and restart the app.');
  const credential = await signInWithEmailAndPassword(auth, email, password);
  if (!credential.user.emailVerified) {
    await firebaseSignOut(auth);
    throw Object.assign(new Error('Verify your email before signing in.'), {
      code: 'auth/email-not-verified',
    });
  }
}

export async function registerWithEmail(email: string, password: string): Promise<void> {
  if (!auth) throw new Error('Firebase is not configured. Add the Firebase settings and restart the app.');
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  try {
    await sendEmailVerification(credential.user);
  } catch (error) {
    await firebaseSignOut(auth);
    throw error;
  }
  await firebaseSignOut(auth);
}

export async function resendEmailVerification(email: string, password: string): Promise<void> {
  if (!auth) throw new Error('Firebase is not configured. Add the Firebase settings and restart the app.');
  const credential = await signInWithEmailAndPassword(auth, email, password);
  try {
    if (credential.user.emailVerified) {
      throw Object.assign(new Error('This email address is already verified. You can sign in.'), {
        code: 'auth/email-already-verified',
      });
    }
    await sendEmailVerification(credential.user);
  } finally {
    await firebaseSignOut(auth);
  }
}

export async function sendPasswordReset(email: string): Promise<void> {
  if (!auth) throw new Error('Firebase is not configured. Add the Firebase settings and restart the app.');
  await sendPasswordResetEmail(auth, email);
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
        return 'This sign-in method is not enabled for the Firebase project. Enable it in Firebase Authentication settings.';
      case 'auth/email-already-in-use':
        return 'An account already exists for this email. Sign in instead.';
      case 'auth/email-not-verified':
        return 'Check your inbox and verify your email before signing in. You can resend the verification email below.';
      case 'auth/email-already-verified':
        return 'This email address is already verified. You can sign in.';
      case 'auth/expired-action-code':
        return 'This email link has expired. Request a new email and try again.';
      case 'auth/invalid-action-code':
        return 'This email link is invalid or has already been used. Request a new email and try again.';
      case 'auth/invalid-email':
        return 'Enter a valid email address.';
      case 'auth/invalid-credential':
      case 'auth/invalid-login-credentials':
      case 'auth/user-not-found':
      case 'auth/wrong-password':
        return 'The email or password is incorrect.';
      case 'auth/weak-password':
        return 'Choose a password with at least 6 characters.';
      case 'auth/user-disabled':
        return 'This account has been disabled. Contact the app administrator.';
      case 'auth/too-many-requests':
        return 'Too many sign-in attempts. Wait a moment and try again.';
      case 'auth/network-request-failed':
        return 'Could not reach Firebase. Check your internet connection and try again.';
      case 'permission-denied':
        return 'Firebase denied access. Check that the Firestore and Storage security rules are published.';
    }
  }

  return error instanceof Error ? error.message : 'An unexpected Firebase error occurred.';
}
