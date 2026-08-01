'use client';

import Link from 'next/link';


import { Button } from '../../../components/ui/button';
import { Card, CardContent } from '../../../components/ui/card';
import { Skeleton } from '../../../components/ui/skeleton';
import { RoleGuard } from '../../../components/shared/RoleGuard';
import { useAdminProperties, useAdminRentals, useAdminUsers } from '../../../hooks/useAdmin';

function AdminDashboardContent() {
  const { data: users, isLoading: usersLoading } = useAdminUsers();
  const { data: properties, isLoading: propertiesLoading } = useAdminProperties();
  const { data: rentals, isLoading: rentalsLoading } = useAdminRentals();

  const pendingRentals = rentals?.filter((r) => r.status === 'PENDING').length ?? 0;

  return (
    <div className="mx-auto max-w-6xl space-y-8 p-6">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <StatCard label="Total Users" value={users?.length} loading={usersLoading} />
        <StatCard label="Total Properties" value={properties?.length} loading={propertiesLoading} />
        <StatCard label="Total Rentals" value={rentals?.length} loading={rentalsLoading} />
        <StatCard label="Pending Requests" value={pendingRentals} loading={rentalsLoading} />
      </div>

      <div className="flex gap-3">
        <Link href="/dashboard/admin/users">
          <Button variant="outline">Manage Users</Button>
        </Link>
        <Link href="/dashboard/admin/categories">
          <Button variant="outline">Manage Categories</Button>
        </Link>
      </div>
    </div>
  );
}

function StatCard({ label, value, loading }: { label: string; value?: number; loading: boolean }) {
  return (
    <Card>
      <CardContent className="pt-4">
        <p className="text-sm text-muted-foreground">{label}</p>
        {loading ? <Skeleton className="mt-2 h-8 w-16" /> : <p className="text-3xl font-bold">{value ?? 0}</p>}
      </CardContent>
    </Card>
  );
}

export default function AdminDashboardPage() {
  return (
    <RoleGuard role="ADMIN">
      <AdminDashboardContent />
    </RoleGuard>
  );
}