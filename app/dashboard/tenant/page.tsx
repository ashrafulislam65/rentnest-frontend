'use client';

import Link from 'next/link';
import { useTenantRentals } from '../../../hooks/useRentals';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Skeleton } from '../../../components/ui/skeleton';
import { StatusBadge } from '../../../components/shared/StatusBadge';
import { Button } from '../../../components/ui/button';
import { formatCurrency, formatDate } from '../../../lib/utils';
import { RoleGuard } from '../../../components/shared/RoleGuard';
import { useMyPayments } from '../../../hooks/usePayments';


function TenantDashboardContent() {
  const { data: rentals, isLoading: rentalsLoading } = useTenantRentals();
  const { data: payments, isLoading: paymentsLoading } = useMyPayments();

  return (
    <div className="mx-auto max-w-6xl space-y-8 p-6">
      <h1 className="text-2xl font-bold">My Dashboard</h1>

      <Card>
        <CardHeader>
          <CardTitle>Rental Requests</CardTitle>
        </CardHeader>
        <CardContent>
          {rentalsLoading && <Skeleton className="h-32 w-full" />}
          {!rentalsLoading && rentals?.length === 0 && (
            <p className="text-muted-foreground">
              You haven&apos;t requested any rentals yet.{' '}
              <Link href="/properties" className="text-primary hover:underline">
                Browse properties
              </Link>
            </p>
          )}
          {!rentalsLoading && rentals && rentals.length > 0 && (
            <div className="divide-y">
              {rentals.map((rental) => (
                <div key={rental.id} className="flex items-center justify-between py-3">
                  <div>
                    <p className="font-medium">{rental.property?.title ?? 'Property'}</p>
                    <p className="text-sm text-muted-foreground">{formatDate(rental.createdAt)}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge status={rental.status} />
                    {rental.status === 'APPROVED' && (
                      <Link href={`/dashboard/tenant/requests/${rental.id}/pay`}>
                        <Button size="sm">Pay Now</Button>
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
        </CardHeader>
        <CardContent>
          {paymentsLoading && <Skeleton className="h-24 w-full" />}
          {!paymentsLoading && payments?.length === 0 && (
            <p className="text-muted-foreground">No payments yet.</p>
          )}
          {!paymentsLoading && payments && payments.length > 0 && (
            <div className="divide-y">
              {payments.map((p) => (
                <div key={p.id} className="flex items-center justify-between py-3">
                  <span>{formatDate(p.createdAt ?? '')}</span>
                  <span className="font-medium">{formatCurrency(p.amount)}</span>
                  <span className="text-sm text-muted-foreground">{p.status}</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function TenantDashboardPage() {
  return (
    <RoleGuard role="TENANT">
      <TenantDashboardContent />
    </RoleGuard>
  );
}