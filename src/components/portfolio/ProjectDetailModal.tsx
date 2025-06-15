"use client";

import type { Project } from '@/types';
import Image from 'next/image';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Layers, ExternalLink, X, Github } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ProjectDetailModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ProjectDetailModal({ project, isOpen, onClose }: ProjectDetailModalProps) {
  if (!project) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="font-headline text-2xl md:text-3xl">{project.title}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="flex-grow">
          <div className="px-6 space-y-4 py-4">
            {project.imageUrl && (
              <div className="relative w-full h-64 md:h-80 rounded-md overflow-hidden my-4" data-ai-hint="project hero image">
                <Image
                  src={project.imageUrl}
                  alt={project.title}
                  layout="fill"
                  objectFit="cover"
                />
              </div>
            )}
            <DialogDescription className="text-base text-foreground leading-relaxed">
              {project.description}
            </DialogDescription>
            
            <div className="pt-2">
              <h4 className="font-semibold text-lg mb-2 text-primary">Technologies Used:</h4>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-sm px-3 py-1 bg-accent/20 text-accent-foreground hover:bg-accent/30">
                    <Layers className="mr-1.5 h-4 w-4" />
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter className="p-6 pt-4 border-t sticky bottom-0 bg-background">
          {/* Example links - adapt as needed, perhaps based on project data */}
          <Button variant="outline" asChild>
            <a href="#" target="_blank" rel="noopener noreferrer">
              <ExternalLink className="mr-2 h-4 w-4" />
              Live Demo
            </a>
          </Button>
          <Button variant="secondary" asChild>
            <a href="#" target="_blank" rel="noopener noreferrer">
              <Github className="mr-2 h-4 w-4" />
              Source Code
            </a>
          </Button>
          <Button variant="outline" onClick={onClose}>
            <X className="mr-2 h-4 w-4" /> Close
          </Button>
        </DialogFooter>
        </ScrollArea>

      </DialogContent>
    </Dialog>
  );
}
