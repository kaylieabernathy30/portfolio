
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
    throw new Error('Firebase Admin SDK: FIREBASE_SERVICE_ACCOUNT_BASE64 environment variable is not set. This variable should contain the Base64 encoded string of your Firebase service account JSON file.');
  }
  if (!projectId) {
    throw new Error('Firebase Admin SDK: NEXT_PUBLIC_FIREBASE_PROJECT_ID environment variable is not set.');
  }

  try {
    const serviceAccountJsonString = Buffer.from(serviceAccountBase64, 'base64').toString('utf-8');
    
    let serviceAccount;
    try {
      serviceAccount = JSON.parse(serviceAccountJsonString);
    } catch (e: any) {
      // This is the most likely error the user is hitting.
      console.error("Firebase Admin SDK: Failed to parse service account JSON.", e.message);
      const snippet = serviceAccountJsonString.substring(0, Math.min(100, serviceAccountJsonString.length));
      console.error(`Firebase Admin SDK: The decoded service account string (first 100 chars) starts with: "${snippet}${serviceAccountJsonString.length > 100 ? "..." : ""}"`);
      throw new Error(
        `Firebase Admin SDK: Malformed service account JSON after Base64 decoding. ` +
        `The error was: "${e.message}". ` +
        `Please carefully re-check that the FIREBASE_SERVICE_ACCOUNT_BASE64 environment variable contains the unmodified, ` +
        `correctly Base64 encoded content of your service account JSON file. ` +
        `Common issues include: incomplete copy-pasting of the Base64 string, ` +
        `accidental newlines or spaces within the Base64 string in your .env file, ` +
        `or an error during the Base64 encoding process itself.`
      );
    }

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: projectId,
    });
    console.log("Firebase Admin SDK initialized successfully.");

  } catch (error: any) {
    // This will catch errors from Buffer.from, or admin.initializeApp, or re-thrown parse error.
    // If it's the re-thrown parse error, the message is already specific.
    // If it's another error, the original message will be used.
    console.error("Firebase Admin SDK initialization error: ", error.message);
    if (error.message.startsWith("Firebase Admin SDK: Malformed service account JSON")) {
        // If it's our custom error, just re-throw it.
        throw error;
    }
    // For other errors (e.g., from Buffer.from if base64 is totally invalid, or initializeApp issues)
    throw new Error(`Firebase Admin SDK initialization failed: ${error.message}. Ensure FIREBASE_SERVICE_ACCOUNT_BASE64 and NEXT_PUBLIC_FIREBASE_PROJECT_ID are correctly set.`);
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
