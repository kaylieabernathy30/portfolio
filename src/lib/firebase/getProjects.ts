
// src/lib/firebase/getProjects.ts
import type { Project } from '@/types';
import { db } from './config'; // Actual Firestore instance
import { collection, getDocs, orderBy, query, Timestamp } from 'firebase/firestore';

export async function getProjects(): Promise<Project[]> {
  try {
    const projectsCol = collection(db, 'projects');
    const q = query(projectsCol, orderBy('createdAt', 'desc'));
    const projectSnapshot = await getDocs(q);
    const projectList = projectSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        title: data.title,
        description: data.description,
        tags: Array.isArray(data.tags) ? data.tags : (typeof data.tags === 'string' ? data.tags.split(',').map(t=>t.trim()) : []),
        imageUrl: data.imageUrl,
        createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : (data.createdAt ? new Date(data.createdAt) : new Date()),
        updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : (data.updatedAt ? new Date(data.updatedAt) : new Date()),
      } as Project;
    });
    return projectList;
  } catch (error) {
    console.error("Error fetching projects:", error);
    // It's good practice to inform the user or log this error more visibly in a real app
    // For now, returning an empty array on error.
    return [];
  }
}
