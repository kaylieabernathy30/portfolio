// src/types/index.ts
import type { Timestamp } from 'firebase/firestore';

export interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  imageUrls: string[]; // Changed from imageUrl: string
  createdAt?: Timestamp | Date | string; 
  updatedAt?: Timestamp | Date | string;
}
