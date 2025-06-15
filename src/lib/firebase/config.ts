// src/lib/firebase/config.ts
import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Diagnostic log for Firebase config
// This log will appear in the server console during SSR and in the browser console on the client.
console.log(
  `Firebase Config Check: API Key is ${firebaseConfig.apiKey ? 'present' : 'MISSING/NOT SET'}, Project ID is ${firebaseConfig.projectId ? firebaseConfig.projectId : 'MISSING/NOT SET'}.`
);

if (!firebaseConfig.apiKey) {
  console.error(
    'CRITICAL Firebase Error: NEXT_PUBLIC_FIREBASE_API_KEY is not defined in your environment variables. ' +
    'Firebase cannot initialize. Please check your .env.local file or deployment settings.'
  );
  // Firebase will likely throw an error during initializeApp or getAuth if apiKey is missing.
  // This log provides an earlier, more specific warning.
}
if (!firebaseConfig.projectId) {
   console.error(
    'CRITICAL Firebase Error: NEXT_PUBLIC_FIREBASE_PROJECT_ID is not defined in your environment variables. ' +
    'Firebase cannot initialize correctly. Please check your .env.local file or deployment settings.'
  );
}

let app: FirebaseApp;
// Initialize Firebase
// Wrapping with try-catch to provide more context if initializeApp fails.
try {
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApp();
  }
} catch (e) {
  const initError = e instanceof Error ? e.message : String(e);
  console.error(`Firebase initialization failed: ${initError}. Ensure all NEXT_PUBLIC_FIREBASE_ environment variables are correctly set.`);
  // Depending on the app's requirements, you might want to throw a custom error
  // or allow the app to continue in a degraded state if Firebase is not critical for all parts.
  // For now, re-throwing to make it clear initialization failed.
  throw new Error(`Firebase initialization failed. Check console for details. Original error: ${initError}`);
}

const auth: Auth = getAuth(app);
const db: Firestore = getFirestore(app);

export { app, auth, db };
