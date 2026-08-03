import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-border bg-secondary/40">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-6 py-14 sm:grid-cols-4">
        <div className="col-span-2 sm:col-span-1">
          <p className="font-display text-2xl">RentNest</p>
          <p className="mt-3 text-sm text-muted-foreground">
            Find a place you&apos;ll love to call home.
          </p>
        </div>

        <div>
          <p className="text-sm font-semibold">Explore</p>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><Link href="/properties" className="hover:text-accent">Browse Properties</Link></li>
            <li><Link href="/register" className="hover:text-accent">List Your Property</Link></li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold">Account</p>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><Link href="/login" className="hover:text-accent">Log in</Link></li>
            <li><Link href="/register" className="hover:text-accent">Sign up</Link></li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold">Contact</p>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>support@rentnest.com</li>
            <li>+880 1XXX-XXXXXX</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border px-6 py-5 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} RentNest. All rights reserved.
      </div>
    </footer>
  );
}