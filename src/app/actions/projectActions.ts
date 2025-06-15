
"use server";

import { revalidatePath } from 'next/cache';
import { projectServerValidationSchema, type ProjectFormData } from '@/lib/schemas';
import { db } from '@/lib/firebase/config'; // For real implementation
import { collection, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, getDocs, query, orderBy, Timestamp } from 'firebase/firestore';
import type { Project } from '@/types';

// Placeholder for Firebase admin check - in a real app, verify user is admin.
// This is a simplified check. Real implementation should verify JWT or use Admin SDK.
async function ensureAdmin() {
  // const session = await getAuth(); // Placeholder for server-side auth check
  // if (!session?.user) { // Or check for admin role
  //   throw new Error("Unauthorized: Admin access required.");
  // }
  console.log("Admin check placeholder: Assuming user is admin.");
  return true; 
}

export async function addProjectAction(formData: ProjectFormData) {
  try {
    await ensureAdmin();
    const validatedFields = projectServerValidationSchema.safeParse(formData);

    if (!validatedFields.success) {
      return { error: "Invalid data.", issues: validatedFields.error.flatten().fieldErrors };
    }
    
    await addDoc(collection(db, 'projects'), {
      ...validatedFields.data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    revalidatePath('/');
    revalidatePath('/admin/dashboard');
    return { success: "Project added successfully." };
  } catch (error: any) {
    console.error("Error in addProjectAction:", error);
    return { error: error.message || "Failed to add project." };
  }
}

export async function updateProjectAction(id: string, formData: ProjectFormData) {
  try {
    await ensureAdmin();
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

export async function deleteProjectAction(id: string) {
  try {
    await ensureAdmin();

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

export async function getAdminProjects(): Promise<Project[]> {
  await ensureAdmin(); 
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
