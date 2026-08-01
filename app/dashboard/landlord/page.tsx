'use client';

import Link from 'next/link';
import { useLandlordProperties } from '../../../hooks/useProperties';
import { useLandlordRequests } from '../../../hooks/useRentals';
import { Button } from '../../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Skeleton } from '../../../components/ui/skeleton';
import { RoleGuard } from '../../../components/shared/RoleGuard';

function LandlordDashboardContent() {
  const { data: properties, isLoading: propertiesLoading } = useLandlordProperties();
  const { data: requests, isLoading: requestsLoading } = useLandlordRequests();

  // No dedicated backend stats endpoint — derived client-side from the lists we already fetch.
  const totalProperties = properties?.length ?? 0;
  const activeRequests = requests?.filter((r) => r.status === 'PENDING').length ?? 0;
  const activeRentals = requests?.filter((r) => r.status === 'ACTIVE').length ?? 0;

  return (
    <div className="mx-auto max-w-6xl space-y-8 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Landlord Dashboard</h1>
        <Link href="/dashboard/landlord/properties/new">
          <Button>+ New Property</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Total Properties" value={totalProperties} loading={propertiesLoading} />
        <StatCard label="Pending Requests" value={activeRequests} loading={requestsLoading} />
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
              <Link href="/dashboard/landlord/properties/new" className="text-primary hover:underline">
                Add your first one
              </Link>
              .
            </p>
          )}
          {!propertiesLoading && properties && properties.length > 0 && (
            <div className="divide-y">
              {properties.map((p) => (
                <div key={p.id} className="flex items-center justify-between py-3">
                  <div>
                    <p className="font-medium">{p.title}</p>
                    <p className="text-sm text-muted-foreground">{p.location}</p>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {p.isAvailable ? 'Available' : 'Unavailable'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div>
        <Link href="/dashboard/landlord/requests">
          <Button variant="outline">Manage Rental Requests →</Button>
        </Link>
      </div>
    </div>
  );
}

function StatCard({ label, value, loading }: { label: string; value: number; loading: boolean }) {
  return (
    <Card>
      <CardContent className="pt-4">
        <p className="text-sm text-muted-foreground">{label}</p>
        {loading ? <Skeleton className="mt-2 h-8 w-16" /> : <p className="text-3xl font-bold">{value}</p>}
      </CardContent>
    </Card>
  );
}

export default function LandlordDashboardPage() {
  return (
    <RoleGuard role="LANDLORD">
      <LandlordDashboardContent />
    </RoleGuard>
  );
}