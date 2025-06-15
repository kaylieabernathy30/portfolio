"use client";

import type { Project } from '@/types';
import { ProjectCard } from './ProjectCard';
import React, { useEffect, useState } from 'react';

interface ProjectListProps {
  projects: Project[];
}

export function ProjectList({ projects: initialProjects }: ProjectListProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Simulate loading data and then trigger visibility for animation
    setProjects(initialProjects);
    const timer = setTimeout(() => setIsVisible(true), 100); // Short delay to ensure CSS is ready
    return () => clearTimeout(timer);
  }, [initialProjects]);

  if (!projects.length) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        <p>Loading projects or no projects to display yet...</p>
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 transition-opacity duration-500 ease-in ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      {projects.map((project, index) => (
        <ProjectCard key={project.id} project={project} index={index} />
      ))}
    </div>
  );
}
