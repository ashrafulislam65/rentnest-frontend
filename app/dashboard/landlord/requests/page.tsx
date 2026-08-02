'use client';

import { RoleGuard } from '@/components/shared/RoleGuard';
import { DashboardShell } from '@/components/shared/DashboardShell';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useHandleRentalRequest, useLandlordRequests } from '@/hooks/useRentals';
import { formatDate } from '@/lib/utils';

function LandlordRequestsContent() {
  const { data: requests, isLoading } = useLandlordRequests();
  const { mutate: handleRequest, isPending } = useHandleRentalRequest();

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wider text-accent">Dashboard</p>
        <h1 className="font-display text-3xl">Rental Requests</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Incoming Requests</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading && <Skeleton className="h-32 w-full" />}
          {!isLoading && requests?.length === 0 && (
            <p className="text-muted-foreground">No rental requests yet.</p>
          )}
          {!isLoading && requests && requests.length > 0 && (
            <div className="divide-y divide-border">
              {requests.map((r) => (
                <div key={r.id} className="flex items-center justify-between py-4">
                  <div>
                    <p className="font-medium">{r.property?.title ?? 'Property'}</p>
                    <p className="text-sm text-muted-foreground">
                      Requested by {r.tenant?.name ?? 'Tenant'} · {formatDate(r.createdAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge status={r.status} />
                    {r.status === 'PENDING' && (
                      <>
                        <Button
                          size="sm"
                          variant="accent"
                          disabled={isPending}
                          onClick={() => handleRequest({ id: r.id, status: 'APPROVED' })}
                        >
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={isPending}
                          onClick={() => handleRequest({ id: r.id, status: 'REJECTED' })}
                        >
                          Reject
                        </Button>
                      </>
                    )}
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

export default function LandlordRequestsPage() {
  return (
    <RoleGuard role="LANDLORD">
      <DashboardShell role="LANDLORD">
        <LandlordRequestsContent />
      </DashboardShell>
    </RoleGuard>
  );
}