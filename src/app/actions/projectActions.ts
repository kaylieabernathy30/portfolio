
"use server";

import { revalidatePath } from 'next/cache';
import { projectServerValidationSchema, type ProjectFormData } from '@/lib/schemas';
import { db, auth } from '@/lib/firebase/config'; // Import auth
import { collection, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, getDocs, query, orderBy, Timestamp } from 'firebase/firestore';
import type { Project } from '@/types';
import type { User } from 'firebase/auth'; // Import User type

// Placeholder for Firebase admin check - in a real app, verify user is admin.
async function ensureAdmin() {
  // IMPORTANT: THIS IS A SIMPLIFIED SERVER-SIDE CHECK AND HAS SIGNIFICANT LIMITATIONS.
  // In a Next.js Server Action context, auth.currentUser (from the Firebase client SDK)
  // will typically be null because the client's browser authentication state does not
  // automatically propagate to the server-side execution environment of the action.
  //
  // For robust server-side authentication with Firebase and Firestore security rules
  // like `request.auth != null`, you generally need to:
  // 1. Pass the Firebase ID token from the client to the Server Action.
  // 2. Use the Firebase Admin SDK on the server to verify this ID token.
  // 3. Perform actions based on the verified user's identity.
  //
  // This current check is a placeholder to illustrate the point and will likely
  // result in an error because auth.currentUser will be null here.
  const currentUser: User | null = auth.currentUser;

  if (!currentUser) {
    console.error(
      "ensureAdmin Check Failed: No authenticated user found in the Server Action context. " +
      "Firestore operations requiring authentication (request.auth != null) will be denied. " +
      "This is expected when using the Firebase client SDK for auth checks directly in Server Actions. " +
      "Consider implementing ID token verification with Firebase Admin SDK for proper server-side auth."
    );
    throw new Error("Unauthorized: Admin access required. No authenticated user context established on the server for this action.");
  }

  // In a real application, you would also check if this 'currentUser' has admin privileges,
  // for example, by checking custom claims on their ID token (verified via Admin SDK).
  console.log(`ensureAdmin Check Placeholder: Action attempted by user UID (if available): ${currentUser.uid}. Further admin role verification would be needed.`);
  return true;
}

export async function addProjectAction(formData: ProjectFormData) {
  try {
    await ensureAdmin(); // This will now likely throw an error due to auth.currentUser being null
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
    // If ensureAdmin throws, its message will be caught here.
    // If Firestore throws (e.g., if ensureAdmin was bypassed/modified), that error is caught.
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
  // Reading projects might have different security rules (e.g., allow read: if true;).
  // If reading also requires auth, ensureAdmin() or a similar check would be needed here too,
  // or the Firestore client making this call needs to be authenticated.
  // For now, assuming public read or specific admin read rules are handled.
  // If `ensureAdmin` was called here, it would also likely fail due to server-side auth context.
  // Let's assume for now getAdminProjects might be used in contexts where client SDK on server is fine for reads (e.g. build time, or rules allow unauth read).
  // If reads are protected by `request.auth != null`, this will also fail from a server action without Admin SDK.

  // await ensureAdmin(); // Potentially add this if reads also need strong server-side auth verification.

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
    // If this operation is permission-denied, this log will show it.
    return [];
  }
}
