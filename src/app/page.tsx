import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ProjectList } from '@/components/portfolio/ProjectList';
import { getProjects } from '@/lib/firebase/getProjects'; // Server-side data fetching
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowDown, Github, Linkedin, Mail } from 'lucide-react';

export default async function HomePage() {
  const projects = await getProjects();

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
        <section id="hero" className="text-center py-16 md:py-24" data-ai-hint="developer introduction">
          <h1 className="font-headline text-4xl sm:text-5xl md:text-6xl font-bold mb-4">
            Hi, I&apos;m <span className="text-primary">Your Name</span>.
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            A passionate Full-Stack Developer specializing in creating modern, responsive, and user-friendly web applications.
            I turn complex problems into elegant digital solutions.
          </p>
          <div className="flex justify-center space-x-4 mb-12">
            <Button size="lg" asChild>
              <Link href="#projects">
                View My Work <ArrowDown className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/resume.pdf" target="_blank"> {/* Replace with actual resume link */}
                Download CV
              </Link>
            </Button>
          </div>
        </section>

        <section id="projects" className="py-12 md:py-16">
          <h2 className="font-headline text-3xl md:text-4xl font-bold text-center mb-10 md:mb-12">
            Projects Showcase
          </h2>
          <ProjectList projects={projects} />
        </section>

        <section id="contact" className="py-16 md:py-24 text-center bg-card p-8 rounded-lg shadow-xl" data-ai-hint="contact information">
          <h2 className="font-headline text-3xl md:text-4xl font-bold mb-6">Get In Touch</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            I&apos;m always open to discussing new projects, creative ideas or opportunities to be part of your visions.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Button size="lg" variant="default" asChild className="w-full sm:w-auto">
              <Link href="mailto:youremail@example.com">
                <Mail className="mr-2 h-5 w-5" /> Email Me
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="w-full sm:w-auto">
              <Link href="https://linkedin.com/in/yourusername" target="_blank" rel="noopener noreferrer">
                <Linkedin className="mr-2 h-5 w-5" /> LinkedIn
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="w-full sm:w-auto">
              <Link href="https://github.com/yourusername" target="_blank" rel="noopener noreferrer">
                <Github className="mr-2 h-5 w-5" /> GitHub
              </Link>
            </Button>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
