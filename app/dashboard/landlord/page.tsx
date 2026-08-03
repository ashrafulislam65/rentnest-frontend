'use client';

import Link from 'next/link';
import { RoleGuard } from '@/components/shared/RoleGuard';
import { DashboardShell } from '@/components/shared/DashboardShell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { useDeleteProperty, useLandlordProperties } from '@/hooks/useProperties';
import { useLandlordRequests } from '@/hooks/useRentals';

function LandlordDashboardContent() {
  const { data: properties, isLoading: propertiesLoading } = useLandlordProperties();
  const { data: requests, isLoading: requestsLoading } = useLandlordRequests();
  const { mutate: deleteProperty, isPending: isDeleting } = useDeleteProperty();

  const totalProperties = properties?.length ?? 0;
  const pendingRequests = requests?.filter((r) => r.status === 'PENDING').length ?? 0;
  const activeRentals = requests?.filter((r) => r.status === 'ACTIVE').length ?? 0;

  const handleDelete = (id: string, title: string) => {
    if (confirm(`Delete "${title}"? This cannot be undone.`)) {
      deleteProperty(id);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-accent">Dashboard</p>
          <h1 className="font-display text-3xl">Overview</h1>
        </div>
        <Link href="/dashboard/landlord/properties/new">
          <Button variant="accent">+ New Property</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Total Properties" value={totalProperties} loading={propertiesLoading} />
        <StatCard label="Pending Requests" value={pendingRequests} loading={requestsLoading} />
        <StatCard label="Active Rentals" value={activeRentals} loading={requestsLoading} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Properties</CardTitle>
        </CardHeader>
        <CardContent>
          {propertiesLoading && <Skeleton className="h-32 w-full" />}
          {!propertiesLoading && properties?.length === 0 && (
            <p className="text-muted-foreground">
              You haven&apos;t listed any properties yet.{' '}
              <Link href="/dashboard/landlord/properties/new" className="text-accent hover:underline">
                Add your first one
              </Link>
              .
            </p>
          )}
          {!propertiesLoading && properties && properties.length > 0 && (
            <div className="divide-y divide-border">
              {properties.map((p) => (
                <div key={p.id} className="flex items-center justify-between py-3">
                  <div>
                    <p className="font-medium">{p.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {p.location} · {p.isAvailable ? 'Available' : 'Unavailable'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link href={`/dashboard/landlord/properties/${p.id}/edit`}>
                      <Button size="sm" variant="outline">
                        Edit
                      </Button>
                    </Link>
                    <Button
                      size="sm"
                      variant="destructive"
                      disabled={isDeleting}
                      onClick={() => handleDelete(p.id, p.title)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({ label, value, loading }: { label: string; value: number; loading: boolean }) {
  return (
    <Card>
      <CardContent className="pt-5">
        <p className="text-sm text-muted-foreground">{label}</p>
        {loading ? <Skeleton className="mt-2 h-8 w-16" /> : <p className="font-display text-3xl">{value}</p>}
      </CardContent>
    </Card>
  );
}

export default function LandlordDashboardPage() {
  return (
    <RoleGuard role="LANDLORD">
      <DashboardShell role="LANDLORD">
        <LandlordDashboardContent />
      </DashboardShell>
    </RoleGuard>
  );
}