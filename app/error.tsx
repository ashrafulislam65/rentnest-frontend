'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center gap-4 px-6 text-center">
      <h2 className="font-display text-3xl">Something went wrong</h2>
      <p className="text-muted-foreground">
        We couldn&apos;t load this page. Try again, or head back to the homepage.
      </p>
      {process.env.NODE_ENV === 'development' && (
        <pre className="max-w-full overflow-auto rounded-md bg-secondary p-3 text-left text-xs text-muted-foreground">
          {error.message}
        </pre>
      )}
      <div className="flex gap-3">
        <Button variant="accent" onClick={reset}>
          Try again
        </Button>
        <Link href="/">
          <Button variant="outline">Go home</Button>
        </Link>
      </div>
    </div>
  );
}