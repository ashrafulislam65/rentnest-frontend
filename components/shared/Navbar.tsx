'use client';

import Link from 'next/link';
import { Button } from '../ui/button';
import { useAuthStore } from '../../store/auth-store';

const DASHBOARD_PATH: Record<string, string> = {
  TENANT: '/dashboard/tenant',
  LANDLORD: '/dashboard/landlord',
  ADMIN: '/dashboard/admin',
};

export function Navbar() {
  const { user, logout } = useAuthStore();

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        <Link href="/" className="font-display text-2xl tracking-tight">
          RentNest
        </Link>

        <nav className="hidden items-center gap-8 sm:flex">
          <Link href="/properties" className="text-sm font-medium text-foreground/80 hover:text-foreground">
            Properties
          </Link>
          {user && (
            <Link href={DASHBOARD_PATH[user.role]} className="text-sm font-medium text-foreground/80 hover:text-foreground">
              Dashboard
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-3">
          {!user && (
            <>
              <Link href="/login" className="hidden text-sm font-medium hover:text-accent sm:block">
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
      </div>
    </header>
  );
}