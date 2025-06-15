// src/lib/firebase/authService.ts
import { 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut,
  createUserWithEmailAndPassword,
  type UserCredential,
  type AuthError
} from 'firebase/auth';
import { auth } from './config';
import type { LoginFormData, SignupFormData } from '@/lib/schemas';

export async function signInUser(credentials: LoginFormData): Promise<{ user?: UserCredential['user'], error?: string }> {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, credentials.email, credentials.password);
    return { user: userCredential.user };
  } catch (e) {
    const error = e as AuthError;
    if (error.code === 'auth/configuration-not-found') {
      return { error: 'Firebase Authentication is not configured for this project. Please enable Email/Password sign-in in the Firebase Console.' };
    }
    if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
      return { error: 'Invalid email or password.' };
    }
    return { error: error.message || 'Login failed. Please try again.' };
  }
}

export async function signOutUser(): Promise<{ success?: boolean, error?: string }> {
  try {
    await firebaseSignOut(auth);
    return { success: true };
  } catch (e) {
    const error = e as AuthError;
    return { error: error.message || 'Sign out failed.' };
  }
}

export async function signUpUser(credentials: SignupFormData): Promise<{ user?: UserCredential['user'], error?: string }> {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, credentials.email, credentials.password);
    // You might want to do something with the userCredential here, like setting up a user profile in Firestore
    return { user: userCredential.user };
  } catch (e) {
    const error = e as AuthError;
    if (error.code === 'auth/configuration-not-found') {
      return { error: 'Firebase Authentication is not configured for this project. Please enable Email/Password sign-in in the Firebase Console.' };
    }
    if (error.code === 'auth/email-already-in-use') {
      return { error: 'This email address is already in use.' };
    }
    if (error.code === 'auth/weak-password') {
      return { error: 'The password is too weak.' };
    }
    return { error: error.message || 'Signup failed. Please try again.' };
  }
}
