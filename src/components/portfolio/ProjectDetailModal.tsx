
"use client";

import type { Project } from '@/types';
import Image from 'next/image';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Layers, ExternalLink, X, Github, Image as ImageIcon } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from '@/components/ui/carousel';

interface ProjectDetailModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ProjectDetailModal({ project, isOpen, onClose }: ProjectDetailModalProps) {
  if (!project) return null;

  const hasImages = project.imageUrls && project.imageUrls.length > 0;
  const hasMultipleImages = hasImages && project.imageUrls.length > 1;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="font-headline text-2xl md:text-3xl">{project.title}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="flex-grow">
          <div className="px-6 space-y-4 py-4">
            {hasImages && !hasMultipleImages && (
              <div className="relative w-full h-64 md:h-80 rounded-md overflow-hidden my-4" data-ai-hint="project hero image">
                <Image
                  src={project.imageUrls[0]}
                  alt={project.title}
                  layout="fill"
                  objectFit="cover"
                />
              </div>
            )}
            {hasMultipleImages && (
              <Carousel className="w-full my-4" data-ai-hint="project image gallery">
                <CarouselContent>
                  {project.imageUrls.map((url, index) => (
                    <CarouselItem key={index}>
                      <div className="relative w-full h-64 md:h-80 rounded-md overflow-hidden">
                        <Image
                          src={url}
                          alt={`${project.title} - Image ${index + 1}`}
                          layout="fill"
                          objectFit="cover"
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            )}
            {!hasImages && (
                 <div className="relative w-full h-64 md:h-80 rounded-md overflow-hidden my-4 bg-muted flex items-center justify-center" data-ai-hint="placeholder image">
                    <ImageIcon className="h-24 w-24 text-muted-foreground" />
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
