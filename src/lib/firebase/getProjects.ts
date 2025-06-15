// src/lib/firebase/getProjects.ts
// This function would typically run on the server or be part of a server action / route handler.
// For this PRD, we'll mock the data fetching.
import type { Project } from '@/types';
// import { db } from './config'; // Actual Firestore instance
// import { collection, getDocs, orderBy, query } from 'firebase/firestore';

// Mock data
const mockProjects: Project[] = [
  {
    id: '1',
    title: 'E-commerce Platform',
    description: 'A full-featured e-commerce platform with Next.js, Stripe, and Firebase. Includes product listings, cart functionality, and user authentication.',
    tags: ['Next.js', 'React', 'TypeScript', 'Firebase', 'Stripe', 'Tailwind CSS'],
    imageUrl: 'https://placehold.co/600x400.png?text=E-commerce+Platform',
    createdAt: new Date('2023-10-15T10:00:00Z'),
  },
  {
    id: '2',
    title: 'Task Management App',
    description: 'A collaborative task management application using React, Node.js, and PostgreSQL. Features real-time updates and drag-and-drop interface.',
    tags: ['React', 'Node.js', 'Express', 'PostgreSQL', 'Socket.IO'],
    imageUrl: 'https://placehold.co/600x400.png?text=Task+Manager',
    createdAt: new Date('2023-08-20T14:30:00Z'),
  },
  {
    id: '3',
    title: 'Personal Blog',
    description: 'A statically generated blog built with Astro and Markdown. Optimized for performance and SEO, with a clean and minimalist design.',
    tags: ['Astro', 'Markdown', 'SSG', 'SEO'],
    // No image for this one
    createdAt: new Date('2023-05-01T09:00:00Z'),
  },
   {
    id: '4',
    title: 'AI Powered Chatbot',
    description: 'Developed a customer service chatbot using Dialogflow and integrated it with a web application. Reduced response times by 40%.',
    tags: ['AI', 'Dialogflow', 'Node.js', 'Webhook'],
    imageUrl: 'https://placehold.co/600x400.png?text=AI+Chatbot',
    createdAt: new Date('2024-01-10T11:00:00Z'),
  },
];

export async function getProjects(): Promise<Project[]> {
  // In a real application:
  // try {
  //   const projectsCol = collection(db, 'projects');
  //   const q = query(projectsCol, orderBy('createdAt', 'desc'));
  //   const projectSnapshot = await getDocs(q);
  //   const projectList = projectSnapshot.docs.map(doc => {
  //     const data = doc.data();
  //     return {
  //       id: doc.id,
  //       ...data,
  //       // Convert Firestore Timestamps to Date objects or strings as needed
  //       createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(),
  //       updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : new Date(),
  //     } as Project;
  //   });
  //   return projectList;
  // } catch (error) {
  //   console.error("Error fetching projects:", error);
  //   return [];
  // }

  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockProjects;
}
