"use client";

import type { Project } from '@/types';
import { ProjectCard } from './ProjectCard';
import React, { useEffect, useState } from 'react';
import { ProjectDetailModal } from './ProjectDetailModal';

interface ProjectListProps {
  projects: Project[];
}

export function ProjectList({ projects: initialProjects }: ProjectListProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Simulate loading data and then trigger visibility for animation
    setProjects(initialProjects);
    const timer = setTimeout(() => setIsVisible(true), 100); // Short delay to ensure CSS is ready
    return () => clearTimeout(timer);
  }, [initialProjects]);

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    // Delay clearing selectedProject to allow modal to animate out
    setTimeout(() => setSelectedProject(null), 300); 
  };

  if (!projects.length && !isVisible) { // Ensure loading state shows until projects are ready and visible
    return (
      <div className="text-center py-10 text-muted-foreground">
        <p>Loading projects...</p>
      </div>
    );
  }
  
  if (!projects.length && isVisible) {
     return (
      <div className="text-center py-10 text-muted-foreground">
        <p>No projects to display yet.</p>
      </div>
    );
  }

  return (
    <>
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 transition-opacity duration-500 ease-in ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
        {projects.map((project, index) => (
          <ProjectCard 
            key={project.id} 
            project={project} 
            index={index} 
            onClick={() => handleProjectClick(project)}
          />
        ))}
      </div>
      {selectedProject && (
        <ProjectDetailModal 
          project={selectedProject}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
}
