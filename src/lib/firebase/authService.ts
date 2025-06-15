// src/lib/firebase/authService.ts
import { 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut,
  type UserCredential,
  type AuthError
} from 'firebase/auth';
import { auth } from './config';
import type { LoginFormData } from '@/lib/schemas';

export async function signInUser(credentials: LoginFormData): Promise<{ user?: UserCredential['user'], error?: string }> {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, credentials.email, credentials.password);
    return { user: userCredential.user };
  } catch (e) {
    const error = e as AuthError;
    // Provide more specific error messages
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
