// src/lib/firebase/admin.ts
import admin, { type App } from 'firebase-admin';
import type { Auth } from 'firebase-admin/auth';
import type { Firestore } from 'firebase-admin/firestore';

interface FirebaseAdminApp {
  app: App;
  auth: Auth;
  firestore: Firestore;
}

// Ensure this is only run once
if (!admin.apps.length) {
  const serviceAccountBase64 = process.env.FIREBASE_SERVICE_ACCOUNT_BASE64;
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

  if (!serviceAccountBase64) {
    throw new Error('Firebase Admin SDK: FIREBASE_SERVICE_ACCOUNT_BASE64 environment variable is not set.');
  }
  if (!projectId) {
    throw new Error('Firebase Admin SDK: NEXT_PUBLIC_FIREBASE_PROJECT_ID environment variable is not set.');
  }

  try {
    const serviceAccountJsonString = Buffer.from(serviceAccountBase64, 'base64').toString('utf-8');
    const serviceAccount = JSON.parse(serviceAccountJsonString);

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: projectId,
    });
    console.log("Firebase Admin SDK initialized successfully.");
  } catch (error: any) {
    console.error("Firebase Admin SDK initialization error: ", error.message);
    // Depending on the environment, you might want to re-throw or handle differently
    throw new Error(`Firebase Admin SDK initialization failed: ${error.message}`);
  }
}

const adminApp: App = admin.app();
const adminAuth: Auth = admin.auth();
const adminFirestore: Firestore = admin.firestore();

export { adminApp, adminAuth, adminFirestore };

/**
 * Verifies the Firebase ID token.
 * If the token is valid, returns the decoded token containing user UID and other claims.
 * If invalid, throws an error.
 */
export async function verifyIdToken(idToken: string) {
  try {
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    return decodedToken;
  } catch (error) {
    console.error('Error verifying ID token:', error);
    throw new Error('Invalid or expired authentication token.');
  }
}
