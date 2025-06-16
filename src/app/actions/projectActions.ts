
"use server";

import type { NextRequest } from 'next/server';
import { revalidatePath } from 'next/cache';
import { projectServerValidationSchema, type ProjectFormData } from '@/lib/schemas';
import { adminFirestore, verifyIdToken } from '@/lib/firebase/admin'; 
import { FieldValue } from 'firebase-admin/firestore'; 
import { collection, getDocs, query, orderBy, Timestamp as ClientTimestamp } from 'firebase/firestore'; 
import type { Project } from '@/types';
import { db } from '@/lib/firebase/config';


async function ensureAdminAuth(idToken: string | undefined) {
  if (!idToken) {
    throw new Error("Authentication token is missing. Please log in again.");
  }
  try {
    const decodedToken = await verifyIdToken(idToken);
    console.log(`Action authorized for UID: ${decodedToken.uid}`);
    return decodedToken; 
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
    
    const dataToSave = {
      ...validatedFields.data,
      imageUrls: validatedFields.data.imageUrls || [], 
      liveDemoUrl: validatedFields.data.liveDemoUrl || "",
      sourceCodeUrl: validatedFields.data.sourceCodeUrl || "",
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    };

    const docRef = await adminFirestore.collection('projects').add(dataToSave);

    revalidatePath('/');
    revalidatePath('/admin/dashboard');
    return { success: "Project added successfully.", projectId: docRef.id };
  } catch (error: any)
   {
    console.error("Error in addProjectAction:", error);
    const errorMessage = error.message || "Failed to add project.";
    if (error.code === 7 || (typeof error.message === 'string' && error.message.includes('PERMISSION_DENIED'))) {
        return { error: `Firestore Permission Denied: ${errorMessage}. This might indicate an issue with service account permissions if using Admin SDK, or residual client SDK issues.` };
    }
    return { error: errorMessage };
  }
}

export async function updateProjectAction(idToken: string, id: string, formData: ProjectFormData) {
  try {
    await ensureAdminAuth(idToken); 
    const validatedFields = projectServerValidationSchema.safeParse(formData);

    if (!validatedFields.success) {
      return { error: "Invalid data.", issues: validatedFields.error.flatten().fieldErrors };
    }
    
    const dataToUpdate = {
      ...validatedFields.data,
      imageUrls: validatedFields.data.imageUrls || [],
      liveDemoUrl: validatedFields.data.liveDemoUrl || "",
      sourceCodeUrl: validatedFields.data.sourceCodeUrl || "",
      updatedAt: FieldValue.serverTimestamp(),
    };

    const projectRef = adminFirestore.collection('projects').doc(id);
    await projectRef.update(dataToUpdate);

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

export async function getAdminProjects(): Promise<Project[]> {
  try {
    const projectsCol = collection(db, 'projects'); 
    const q = query(projectsCol, orderBy('createdAt', 'desc'));
    const projectSnapshot = await getDocs(q);

    return projectSnapshot.docs.map(docSnapshot => {
      const data = docSnapshot.data();
      const convertTimestamp = (timestampField: any): Date => {
        if (!timestampField) return new Date(); 
        if (timestampField instanceof ClientTimestamp) { 
          return timestampField.toDate();
        }
        if (timestampField._seconds && typeof timestampField._nanoseconds === 'number') { 
          return new Date(timestampField._seconds * 1000 + timestampField._nanoseconds / 1000000);
        }
        if (typeof timestampField === 'string' || typeof timestampField === 'number') {
          return new Date(timestampField);
        }
        return new Date(); 
      };
      
      return {
        id: docSnapshot.id,
        title: data.title,
        description: data.description,
        tags: Array.isArray(data.tags) ? data.tags : (typeof data.tags === 'string' ? data.tags.split(',').map(t => t.trim()) : []),
        imageUrls: Array.isArray(data.imageUrls) ? data.imageUrls : [],
        liveDemoUrl: data.liveDemoUrl || undefined,
        sourceCodeUrl: data.sourceCodeUrl || undefined,
        createdAt: convertTimestamp(data.createdAt),
        updatedAt: convertTimestamp(data.updatedAt),
      } as Project;
    });
  } catch (error) {
    console.error("Error fetching admin projects:", error);
    return [];
  }
}
