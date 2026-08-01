'use client';

import { RoleGuard } from "../../../../components/shared/RoleGuard";
import { StatusBadge } from "../../../../components/shared/StatusBadge";
import { Button } from "../../../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card";
import { Skeleton } from "../../../../components/ui/skeleton";
import { useHandleRentalRequest, useLandlordRequests } from "../../../../hooks/useRentals";



function LandlordRequestsContent() {
  const { data: requests, isLoading } = useLandlordRequests();
  const { mutate: handleRequest, isPending } = useHandleRentalRequest();

  return (
    <div className="mx-auto max-w-4xl p-6">
      <h1 className="mb-6 text-2xl font-bold">Rental Requests</h1>

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
            <div className="divide-y">
              {requests.map((r) => (
                <div key={r.id} className="flex items-center justify-between py-3">
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
      <LandlordRequestsContent />
    </RoleGuard>
  );
}