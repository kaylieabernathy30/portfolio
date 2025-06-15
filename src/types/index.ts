// src/types/index.ts
import type { Timestamp } from 'firebase/firestore';

export interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  imageUrl?: string;
  createdAt?: Timestamp | Date | string; // Allow for Firestore Timestamp, Date object, or string representation
  updatedAt?: Timestamp | Date | string;
}
