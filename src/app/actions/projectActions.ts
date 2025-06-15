"use server";

import { revalidatePath } from 'next/cache';
import { projectSchema, type ProjectFormData } from '@/lib/schemas';
// import { db, auth as firebaseAdminAuth } from '@/lib/firebase/config'; // For real implementation
// import { collection, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, getDoc } from 'firebase/firestore';
// import { getAuth } from 'firebase-admin/auth'; // For server-side admin auth check if using Firebase Admin SDK

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

// Mock database for demonstration as we don't have a live Firestore connection here
let mockProjectsDb: Array<any & {id: string, createdAt?: Date, updatedAt?: Date}> = [
  { id: '1', title: 'E-commerce Platform', description: 'A full-featured e-commerce platform...', tags: ['Next.js', 'Stripe'], imageUrl: 'https://placehold.co/600x400.png', createdAt: new Date(), updatedAt: new Date() },
  { id: '2', title: 'Task Management App', description: 'A collaborative task management application...', tags: ['React', 'Node.js'], imageUrl: 'https://placehold.co/600x400.png', createdAt: new Date(), updatedAt: new Date() },
];
let nextId = 3;


export async function addProjectAction(formData: ProjectFormData) {
  try {
    await ensureAdmin();
    const validatedFields = projectSchema.safeParse(formData);

    if (!validatedFields.success) {
      return { error: "Invalid data.", issues: validatedFields.error.flatten().fieldErrors };
    }
    
    // Mock: Add to mock DB
    const newProject = { 
      id: String(nextId++), 
      ...validatedFields.data,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    mockProjectsDb.push(newProject);
    console.log("Mock DB after add:", mockProjectsDb);


    // Real Firestore:
    // await addDoc(collection(db, 'projects'), {
    //   ...validatedFields.data,
    //   createdAt: serverTimestamp(),
    //   updatedAt: serverTimestamp(),
    // });

    revalidatePath('/');
    revalidatePath('/admin/dashboard');
    return { success: "Project added successfully." };
  } catch (error: any) {
    return { error: error.message || "Failed to add project." };
  }
}

export async function updateProjectAction(id: string, formData: ProjectFormData) {
  try {
    await ensureAdmin();
    const validatedFields = projectSchema.safeParse(formData);

    if (!validatedFields.success) {
      return { error: "Invalid data.", issues: validatedFields.error.flatten().fieldErrors };
    }

    // Mock: Update in mock DB
    const projectIndex = mockProjectsDb.findIndex(p => p.id === id);
    if (projectIndex === -1) {
      return { error: "Project not found." };
    }
    mockProjectsDb[projectIndex] = { ...mockProjectsDb[projectIndex], ...validatedFields.data, updatedAt: new Date() };
    console.log("Mock DB after update:", mockProjectsDb);

    // Real Firestore:
    // const projectRef = doc(db, 'projects', id);
    // await updateDoc(projectRef, {
    //   ...validatedFields.data,
    //   updatedAt: serverTimestamp(),
    // });
    
    revalidatePath('/');
    revalidatePath('/admin/dashboard');
    return { success: "Project updated successfully." };
  } catch (error: any) {
    return { error: error.message || "Failed to update project." };
  }
}

export async function deleteProjectAction(id: string) {
  try {
    await ensureAdmin();

    // Mock: Delete from mock DB
    mockProjectsDb = mockProjectsDb.filter(p => p.id !== id);
    console.log("Mock DB after delete:", mockProjectsDb);

    // Real Firestore:
    // const projectRef = doc(db, 'projects', id);
    // await deleteDoc(projectRef);
    
    revalidatePath('/');
    revalidatePath('/admin/dashboard');
    return { success: "Project deleted successfully." };
  } catch (error: any) {
    return { error: error.message || "Failed to delete project." };
  }
}

// This function would fetch projects for the admin dashboard.
// It's similar to getProjects but might not need timestamp conversion if used directly server-side.
export async function getAdminProjects() {
  await ensureAdmin(); 
  // Real Firestore:
  // const projectsCol = collection(db, 'projects');
  // const q = query(projectsCol, orderBy('createdAt', 'desc'));
  // const projectSnapshot = await getDocs(q);
  // return projectSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Project[];
  
  // Mock: Return from mock DB
  console.log("Fetching from Mock DB for admin:", mockProjectsDb);
  return [...mockProjectsDb].sort((a,b) => (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0));
}
