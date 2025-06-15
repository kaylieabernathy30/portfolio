import { Logo } from '@/components/icons/Logo';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Github, Linkedin, Mail } from 'lucide-react';

export function Header() {
  return (
    <header className="py-6 px-4 md:px-8 sticky top-0 z-50 bg-background/80 backdrop-blur-md shadow-sm">
      <div className="container mx-auto flex justify-between items-center">
        <Logo />
        <nav className="flex items-center space-x-3 sm:space-x-4">
          <Button variant="ghost" size="icon" asChild aria-label="GitHub Profile">
            <Link href="https://github.com/yourusername" target="_blank" rel="noopener noreferrer">
              <Github className="h-5 w-5" />
            </Link>
          </Button>
          <Button variant="ghost" size="icon" asChild aria-label="LinkedIn Profile">
            <Link href="https://linkedin.com/in/yourusername" target="_blank" rel="noopener noreferrer">
              <Linkedin className="h-5 w-5" />
            </Link>
          </Button>
          <Button variant="ghost" size="icon" asChild aria-label="Email Me">
            <Link href="mailto:youremail@example.com">
              <Mail className="h-5 w-5" />
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
