import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center gap-4 px-6 text-center">
      <p className="font-display text-6xl text-accent">404</p>
      <h2 className="font-display text-2xl">Page not found</h2>
      <p className="text-muted-foreground">The page you&apos;re looking for doesn&apos;t exist or has moved.</p>
      <Link href="/">
        <Button variant="accent">Back to home</Button>
      </Link>
    </div>
  );
}