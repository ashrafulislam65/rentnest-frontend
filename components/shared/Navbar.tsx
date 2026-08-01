'use client';

import Link from 'next/link';
import { Home } from 'lucide-react';


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
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-primary">
          <Home className="h-5 w-5" />
          RentNest
        </Link>

        <nav className="flex items-center gap-3">
          <Link href="/properties" className="text-sm font-medium hover:text-primary">
            Browse
          </Link>

          {!user && (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Log in
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm">Sign up</Button>
              </Link>
            </>
          )}

          {user && (
            <>
              <Link href={DASHBOARD_PATH[user.role]} className="text-sm font-medium hover:text-primary">
                Dashboard
              </Link>
              <Button variant="outline" size="sm" onClick={logout}>
                Log out
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}