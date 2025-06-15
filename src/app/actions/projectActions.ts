
"use server";

import type { NextRequest } from 'next/server';
import { revalidatePath } from 'next/cache';
import { projectServerValidationSchema, type ProjectFormData } from '@/lib/schemas';
import { db } from '@/lib/firebase/config'; // Client SDK Firestore for reads
import { adminFirestore } from '@/lib/firebase/admin'; // Admin SDK Firestore for writes
import { FieldValue } from 'firebase-admin/firestore'; // Admin SDK FieldValue
import { verifyIdToken } from '@/lib/firebase/admin'; 
import { collection, getDocs, query, orderBy, Timestamp as ClientTimestamp } from 'firebase/firestore'; // Client SDK for reads
import type { Project } from '@/types';

// This function verifies the user's ID token using the Admin SDK.
// If valid, the subsequent Firestore operation (if using Admin SDK) will have admin privileges.
// The primary purpose here is to authorize the *calling* of the server action.
async function ensureAdminAuth(idToken: string | undefined) {
  if (!idToken) {
    throw new Error("Authentication token is missing. Please log in again.");
  }
  try {
    const decodedToken = await verifyIdToken(idToken);
    console.log(`Action authorized for UID: ${decodedToken.uid}`);
    return decodedToken; // Contains user UID and other claims
  } catch (error: any) {
    console.error("Admin authentication failed:", error.message);
    // error.message will be "Invalid or expired authentication token." from verifyIdToken if that's the case
    throw new Error(error.message || "Unauthorized: Admin access required. Invalid token.");
  }
}

export async function addProjectAction(idToken: string, formData: ProjectFormData) {
  try {
    await ensureAdminAuth(idToken); // Authorize the action itself
    const validatedFields = projectServerValidationSchema.safeParse(formData);

    if (!validatedFields.success) {
      return { error: "Invalid data.", issues: validatedFields.error.flatten().fieldErrors };
    }

    // Use Admin SDK for the write operation
    const docRef = await adminFirestore.collection('projects').add({
      ...validatedFields.data,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });

    revalidatePath('/');
    revalidatePath('/admin/dashboard');
    return { success: "Project added successfully.", projectId: docRef.id };
  } catch (error: any)
   {
    console.error("Error in addProjectAction:", error);
    // Check for specific Firebase error codes if needed, e.g. error.code
    const errorMessage = error.message || "Failed to add project.";
    // If the error is from Firestore (like PERMISSION_DENIED, though less likely now with Admin SDK)
    // it might have a code property, e.g. error.code === 'permission-denied'
    // For now, returning the generic message.
    if (error.code === 7 || (typeof error.message === 'string' && error.message.includes('PERMISSION_DENIED'))) {
        return { error: `Firestore Permission Denied: ${errorMessage}. This might indicate an issue with service account permissions if using Admin SDK, or residual client SDK issues.` };
    }
    return { error: errorMessage };
  }
}

export async function updateProjectAction(idToken: string, id: string, formData: ProjectFormData) {
  try {
    await ensureAdminAuth(idToken); // Authorize the action
    const validatedFields = projectServerValidationSchema.safeParse(formData);

    if (!validatedFields.success) {
      return { error: "Invalid data.", issues: validatedFields.error.flatten().fieldErrors };
    }

    // Use Admin SDK for the write operation
    const projectRef = adminFirestore.collection('projects').doc(id);
    await projectRef.update({
      ...validatedFields.data,
      updatedAt: FieldValue.serverTimestamp(),
    });

    revalidatePath('/');
    revalidatePath('/admin/dashboard');
    return { success: "Project updated successfully." };
  } catch (error: any) {
    console.error("Error in updateProjectAction:", error);
    return { error: error.message || "Failed to update project." };
  }
}

export async function deleteProjectAction(idToken: string, id: string) {
  try {
    await ensureAdminAuth(idToken); // Authorize the action

    // Use Admin SDK for the delete operation
    const projectRef = adminFirestore.collection('projects').doc(id);
    await projectRef.delete();

    revalidatePath('/');
    revalidatePath('/admin/dashboard');
    return { success: "Project deleted successfully." };
  } catch (error: any) {
    console.error("Error in deleteProjectAction:", error);
    return { error: error.message || "Failed to delete project." };
  }
}

// Public read, uses client SDK as Firestore rules allow public reads.
// Does not require admin authentication for fetching.
export async function getAdminProjects(): Promise<Project[]> {
  try {
    const projectsCol = collection(db, 'projects'); // Using client SDK 'db'
    const q = query(projectsCol, orderBy('createdAt', 'desc'));
    const projectSnapshot = await getDocs(q);

    return projectSnapshot.docs.map(docSnapshot => {
      const data = docSnapshot.data();
      // Ensure Timestamps are converted correctly, whether from Client SDK or Admin SDK
      const convertTimestamp = (timestampField: any): Date => {
        if (!timestampField) return new Date(); // Default or error case
        if (timestampField instanceof ClientTimestamp) { // firebase/firestore Timestamp
          return timestampField.toDate();
        }
        if (timestampField._seconds && typeof timestampField._nanoseconds === 'number') { // firebase-admin/firestore Timestamp like
          return new Date(timestampField._seconds * 1000 + timestampField._nanoseconds / 1000000);
        }
        if (typeof timestampField === 'string' || typeof timestampField === 'number') {
          return new Date(timestampField);
        }
        return new Date(); // Fallback
      };
      
      return {
        id: docSnapshot.id,
        title: data.title,
        description: data.description,
        tags: Array.isArray(data.tags) ? data.tags : (typeof data.tags === 'string' ? data.tags.split(',').map(t => t.trim()) : []),
        imageUrl: data.imageUrl,
        createdAt: convertTimestamp(data.createdAt),
        updatedAt: convertTimestamp(data.updatedAt),
      } as Project;
    });
  } catch (error) {
    console.error("Error fetching admin projects:", error);
    return [];
  }
}

