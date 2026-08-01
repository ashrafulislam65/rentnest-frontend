'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCurrentUser } from '@/hooks/useAuth';


import { UserRole } from '../../types';
import { Skeleton } from '../ui/skeleton';

const DASHBOARD_PATH: Record<UserRole, string> = {
  TENANT: '/dashboard/tenant',
  LANDLORD: '/dashboard/landlord',
  ADMIN: '/dashboard/admin',
};

// Wrap each role dashboard's layout with this. Redirects away if the
// logged-in user's role doesn't match the dashboard they navigated to.
export function RoleGuard({ role, children }: { role: UserRole; children: React.ReactNode }) {
  const { data: user, isLoading } = useCurrentUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user && user.role !== role) {
      router.replace(DASHBOARD_PATH[user.role]);
    }
  }, [isLoading, user, role, router]);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-6xl space-y-4 p-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (!user || user.role !== role) return null;

  return <>{children}</>;
}