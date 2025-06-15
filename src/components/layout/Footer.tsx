export function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="py-6 px-4 md:px-8 mt-auto border-t border-border">
      <div className="container mx-auto text-center text-muted-foreground text-sm">
        <p>&copy; {currentYear} Your Name. All rights reserved.</p>
        <p>Built with Next.js, Tailwind CSS, and Firebase.</p>
      </div>
    </footer>
  );
}
