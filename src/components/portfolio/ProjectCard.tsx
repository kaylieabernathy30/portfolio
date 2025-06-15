
import type { Project } from '@/types';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Layers } from 'lucide-react'; 

interface ProjectCardProps {
  project: Project;
  index: number;
  onClick: () => void;
}

export function ProjectCard({ project, index, onClick }: ProjectCardProps) {
  const animationDelay = `${index * 100}ms`; 
  const firstImageUrl = project.imageUrls && project.imageUrls.length > 0 ? project.imageUrls[0] : null;

  return (
    <Card 
      className="flex flex-col h-full overflow-hidden shadow-lg hover:shadow-primary/50 transition-shadow duration-300 ease-in-out opacity-0 animate-fade-in cursor-pointer group"
      style={{ animationDelay }}
      onClick={onClick}
      data-ai-hint="project showcase"
    >
      {firstImageUrl ? (
        <div className="relative w-full h-48 sm:h-56 overflow-hidden">
          <Image
            src={firstImageUrl}
            alt={project.title}
            layout="fill"
            objectFit="cover"
            className="transition-transform duration-300 group-hover:scale-105"
            data-ai-hint="technology project"
          />
        </div>
      ) : (
         <div className="relative w-full h-48 sm:h-56 overflow-hidden bg-muted flex items-center justify-center">
            <Layers className="h-12 w-12 text-muted-foreground" />
         </div>
      )}
      <CardHeader>
        <CardTitle className="font-headline text-xl lg:text-2xl">{project.title}</CardTitle>
        <ScrollArea className="h-20">
          <CardDescription className="text-muted-foreground pt-1">
            {project.description}
          </CardDescription>
        </ScrollArea>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="bg-primary/20 text-primary hover:bg-primary/30">
              <Layers className="mr-1 h-3 w-3" /> 
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter>
      </CardFooter>
    </Card>
  );
}
