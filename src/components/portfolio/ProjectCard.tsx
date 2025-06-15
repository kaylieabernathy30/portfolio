import type { Project } from '@/types';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Layers } from 'lucide-react'; // Placeholder for tech icons

interface ProjectCardProps {
  project: Project;
  index: number;
}

export function ProjectCard({ project, index }: ProjectCardProps) {
  const animationDelay = `${index * 100}ms`; // Staggered animation delay

  return (
    <Card 
      className="flex flex-col h-full overflow-hidden shadow-lg hover:shadow-primary/50 transition-shadow duration-300 ease-in-out opacity-0 animate-fade-in"
      style={{ animationDelay }}
      data-ai-hint="project showcase"
    >
      {project.imageUrl && (
        <div className="relative w-full h-48 sm:h-56">
          <Image
            src={project.imageUrl}
            alt={project.title}
            layout="fill"
            objectFit="cover"
            className="transition-transform duration-300 group-hover:scale-105"
            data-ai-hint="technology project"
          />
        </div>
      )}
      <CardHeader>
        <CardTitle className="font-headline text-xl lg:text-2xl">{project.title}</CardTitle>
        <CardDescription className="text-muted-foreground pt-1 h-20 overflow-y-auto">
          {project.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="bg-primary/20 text-primary hover:bg-primary/30">
              <Layers className="mr-1 h-3 w-3" /> {/* Generic icon for tags */}
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        {/* Optional: Link to project or source code */}
        {/* <Button variant="outline" asChild>
          <a href="#" target="_blank" rel="noopener noreferrer">
            View Project <ExternalLink className="ml-2 h-4 w-4" />
          </a>
        </Button> */}
      </CardFooter>
    </Card>
  );
}
