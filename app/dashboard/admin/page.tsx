'use client';

import { RoleGuard } from '@/components/shared/RoleGuard';
import { DashboardShell } from '@/components/shared/DashboardShell';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useAdminProperties, useAdminRentals, useAdminUsers } from '@/hooks/useAdmin';

function AdminDashboardContent() {
  const { data: users, isLoading: usersLoading } = useAdminUsers();
  const { data: properties, isLoading: propertiesLoading } = useAdminProperties();
  const { data: rentals, isLoading: rentalsLoading } = useAdminRentals();

  const pendingRentals = rentals?.filter((r) => r.status === 'PENDING').length ?? 0;

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wider text-accent">Dashboard</p>
        <h1 className="font-display text-3xl">Platform Overview</h1>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <StatCard label="Total Users" value={users?.length} loading={usersLoading} />
        <StatCard label="Total Properties" value={properties?.length} loading={propertiesLoading} />
        <StatCard label="Total Rentals" value={rentals?.length} loading={rentalsLoading} />
        <StatCard label="Pending Requests" value={pendingRentals} loading={rentalsLoading} />
      </div>
    </div>
  );
}

function StatCard({ label, value, loading }: { label: string; value?: number; loading: boolean }) {
  return (
    <Card>
      <CardContent className="pt-5">
        <p className="text-sm text-muted-foreground">{label}</p>
        {loading ? <Skeleton className="mt-2 h-8 w-16" /> : <p className="font-display text-3xl">{value ?? 0}</p>}
      </CardContent>
    </Card>
  );
}

export default function AdminDashboardPage() {
  return (
    <RoleGuard role="ADMIN">
      <DashboardShell role="ADMIN">
        <AdminDashboardContent />
      </DashboardShell>
    </RoleGuard>
  );
}