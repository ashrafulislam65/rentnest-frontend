'use client';

import Link from 'next/link';
import { RoleGuard } from '@/components/shared/RoleGuard';
import { DashboardShell } from '@/components/shared/DashboardShell';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { useTenantRentals } from '@/hooks/useRentals';
import { useMyPayments } from '@/hooks/usePayments';
import { formatCurrency, formatDate } from '@/lib/utils';

function TenantDashboardContent() {
  const { data: rentals, isLoading: rentalsLoading } = useTenantRentals();
  const { data: payments, isLoading: paymentsLoading } = useMyPayments();

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wider text-accent">Dashboard</p>
        <h1 className="font-display text-3xl">My Rentals</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Rental Requests</CardTitle>
        </CardHeader>
        <CardContent>
          {rentalsLoading && <Skeleton className="h-32 w-full" />}
          {!rentalsLoading && rentals?.length === 0 && (
            <p className="text-muted-foreground">
              You haven&apos;t requested any rentals yet.{' '}
              <Link href="/properties" className="text-accent hover:underline">
                Browse properties
              </Link>
            </p>
          )}
          {!rentalsLoading && rentals && rentals.length > 0 && (
            <div className="divide-y divide-border">
              {rentals.map((rental) => (
                <div key={rental.id} className="flex items-center justify-between py-4">
                  <div>
                    <p className="font-medium">{rental.property?.title ?? 'Property'}</p>
                    <p className="text-sm text-muted-foreground">{formatDate(rental.createdAt)}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge status={rental.status} />
                    {rental.status === 'APPROVED' && (
                      <Link href={`/dashboard/tenant/requests/${rental.id}/pay`}>
                        <Button size="sm" variant="accent">
                          Pay Now
                        </Button>
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
            <div className="divide-y divide-border">
              {payments.map((p) => (
                <div key={p.id} className="flex items-center justify-between py-3">
                  <span className="text-sm text-muted-foreground">{formatDate(p.createdAt ?? '')}</span>
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
      <DashboardShell role="TENANT">
        <TenantDashboardContent />
      </DashboardShell>
    </RoleGuard>
  );
}