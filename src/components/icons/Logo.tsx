import Link from 'next/link';

export function Logo() {
  return (
    <Link href="/" className="inline-block" aria-label="Devfolio Noir Home">
      <div className="flex items-center">
        <span className="font-headline text-2xl font-bold text-primary-foreground">
          Devfolio
        </span>
        <span className="font-headline text-2xl font-bold text-accent ml-2">
          Noir
        </span>
      </div>
    </Link>
  );
}
