'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import { useAuthStore } from '../../store/auth-store';

const DASHBOARD_PATH: Record<string, string> = {
  TENANT: '/dashboard/tenant',
  LANDLORD: '/dashboard/landlord',
  ADMIN: '/dashboard/admin',
};

export function Navbar() {
  const { user, logout } = useAuthStore();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:h-20 sm:px-6">
        <Link href="/" className="font-display text-xl tracking-tight sm:text-2xl" onClick={() => setMenuOpen(false)}>
          RentNest
        </Link>

        <nav className="hidden items-center gap-8 sm:flex">
          <Link
            href="/properties"
            className={cn(
              'text-sm font-medium transition-colors hover:text-foreground',
              pathname.startsWith('/properties') ? 'text-accent' : 'text-foreground/80'
            )}
          >
            Properties
          </Link>
          {user && (
            <Link
              href={DASHBOARD_PATH[user.role]}
              className={cn(
                'text-sm font-medium transition-colors hover:text-foreground',
                pathname.startsWith('/dashboard') ? 'text-accent' : 'text-foreground/80'
              )}
            >
              Dashboard
            </Link>
          )}
        </nav>

        <div className="hidden items-center gap-3 sm:flex">
          {!user && (
            <>
              <Link href="/login" className="text-sm font-medium hover:text-accent">
                Log in
              </Link>
              <Link href="/register">
                <Button variant="accent" size="sm">
                  Sign up
                </Button>
              </Link>
            </>
          )}
          {user && (
            <Button variant="outline" size="sm" onClick={logout}>
              Log out
            </Button>
          )}
        </div>

        <button
          className="p-2 sm:hidden"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {menuOpen && (
        <nav className="border-t border-border bg-background px-4 py-4 sm:hidden">
          <div className="flex flex-col gap-1">
            <Link
              href="/properties"
              onClick={() => setMenuOpen(false)}
              className={cn(
                'rounded-md px-3 py-2.5 text-sm font-medium',
                pathname.startsWith('/properties') ? 'bg-secondary text-accent' : 'text-foreground/80'
              )}
            >
              Properties
            </Link>

            {user && (
              <Link
                href={DASHBOARD_PATH[user.role]}
                onClick={() => setMenuOpen(false)}
                className={cn(
                  'rounded-md px-3 py-2.5 text-sm font-medium',
                  pathname.startsWith('/dashboard') ? 'bg-secondary text-accent' : 'text-foreground/80'
                )}
              >
                Dashboard
              </Link>
            )}

            {!user && (
              <>
                <Link
                  href="/login"
                  onClick={() => setMenuOpen(false)}
                  className="rounded-md px-3 py-2.5 text-sm font-medium text-foreground/80"
                >
                  Log in
                </Link>
                <Link href="/register" onClick={() => setMenuOpen(false)} className="mt-2">
                  <Button variant="accent" className="w-full">
                    Sign up
                  </Button>
                </Link>
              </>
            )}

            {user && (
              <Button
                variant="outline"
                className="mt-2"
                onClick={() => {
                  setMenuOpen(false);
                  logout();
                }}
              >
                Log out
              </Button>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}