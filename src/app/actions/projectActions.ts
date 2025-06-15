
"use server";

import { revalidatePath } from 'next/cache';
import { projectServerValidationSchema, type ProjectFormData } from '@/lib/schemas';
import { db } from '@/lib/firebase/config'; // Client SDK Firestore
import { verifyIdToken } from '@/lib/firebase/admin'; // Admin SDK for token verification
import { collection, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, getDocs, query, orderBy, Timestamp } from 'firebase/firestore';
import type { Project } from '@/types';

// This function verifies the user's ID token.
// If valid, the subsequent Firestore operation will have `request.auth` populated.
async function ensureAdminAuth(idToken: string | undefined) {
  if (!idToken) {
    throw new Error("Authentication token is missing. Please log in again.");
  }
  try {
    const decodedToken = await verifyIdToken(idToken);
    // You could add additional checks here, e.g., if (decodedToken.admin === true) for role-based access
    console.log(`Action authorized for UID: ${decodedToken.uid}`);
    return decodedToken; // Contains user UID and other claims
  } catch (error: any) {
    console.error("Admin authentication failed:", error.message);
    throw new Error(error.message || "Unauthorized: Admin access required. Invalid token.");
  }
}

export async function addProjectAction(idToken: string, formData: ProjectFormData) {
  try {
    await ensureAdminAuth(idToken);
    const validatedFields = projectServerValidationSchema.safeParse(formData);

    if (!validatedFields.success) {
      return { error: "Invalid data.", issues: validatedFields.error.flatten().fieldErrors };
    }

    const docRef = await addDoc(collection(db, 'projects'), {
      ...validatedFields.data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    revalidatePath('/');
    revalidatePath('/admin/dashboard');
    return { success: "Project added successfully.", projectId: docRef.id };
  } catch (error: any) {
    console.error("Error in addProjectAction:", error);
    return { error: error.message || "Failed to add project." };
  }
}

export async function updateProjectAction(idToken: string, id: string, formData: ProjectFormData) {
  try {
    await ensureAdminAuth(idToken);
    const validatedFields = projectServerValidationSchema.safeParse(formData);

    if (!validatedFields.success) {
      return { error: "Invalid data.", issues: validatedFields.error.flatten().fieldErrors };
    }

    const projectRef = doc(db, 'projects', id);
    await updateDoc(projectRef, {
      ...validatedFields.data,
      updatedAt: serverTimestamp(),
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
    await ensureAdminAuth(idToken);

    const projectRef = doc(db, 'projects', id);
    await deleteDoc(projectRef);

    revalidatePath('/');
    revalidatePath('/admin/dashboard');
    return { success: "Project deleted successfully." };
  } catch (error: any) {
    console.error("Error in deleteProjectAction:", error);
    return { error: error.message || "Failed to delete project." };
  }
}

// Public read, does not require admin authentication for fetching
export async function getAdminProjects(): Promise<Project[]> {
  try {
    const projectsCol = collection(db, 'projects');
    const q = query(projectsCol, orderBy('createdAt', 'desc'));
    const projectSnapshot = await getDocs(q);

    return projectSnapshot.docs.map(docSnapshot => {
      const data = docSnapshot.data();
      return {
        id: docSnapshot.id,
        title: data.title,
        description: data.description,
        tags: Array.isArray(data.tags) ? data.tags : (typeof data.tags === 'string' ? data.tags.split(',').map(t => t.trim()) : []),
        imageUrl: data.imageUrl,
        createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : (data.createdAt ? new Date(data.createdAt) : new Date()),
        updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : (data.updatedAt ? new Date(data.updatedAt) : new Date()),
      } as Project;
    });
  } catch (error) {
    console.error("Error fetching admin projects:", error);
    return [];
  }
}
