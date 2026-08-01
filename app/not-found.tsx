import Link from 'next/link';
import { Button } from '../components/ui/button';


export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center gap-4 p-6 text-center">
      <h1 className="text-5xl font-bold text-primary">404</h1>
      <h2 className="text-xl font-semibold">Page not found</h2>
      <p className="text-muted-foreground">The page you&apos;re looking for doesn&apos;t exist or has moved.</p>
      <Link href="/">
        <Button>Back to home</Button>
      </Link>
    </div>
  );
}