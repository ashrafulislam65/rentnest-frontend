'use client';

import { useState } from 'react';
import Link from 'next/link';
import { RoleGuard } from '@/components/shared/RoleGuard';
import { DashboardShell } from '@/components/shared/DashboardShell';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { StarRating } from '@/components/shared/StarRating';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { useTenantRentals } from '@/hooks/useRentals';
import { useMyPayments } from '@/hooks/usePayments';
import { useCreateReview } from '@/hooks/useReviews';
import { formatCurrency, formatDate } from '@/lib/utils';

function ReviewForm({ propertyId, onDone }: { propertyId: string; onDone: () => void }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const { mutate: submitReview, isPending } = useCreateReview();

  const handleSubmit = () => {
    if (rating === 0) return;
    submitReview(
      { propertyId, rating, comment },
      { onSuccess: onDone }
    );
  };

  return (
    <div className="mt-3 space-y-3 rounded-md border border-border bg-secondary/40 p-4">
      <div>
        <p className="mb-1.5 text-sm font-medium">Your rating</p>
        <StarRating value={rating} onChange={setRating} />
      </div>
      <textarea
        rows={3}
        placeholder="Share your experience..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
      />
      <div className="flex gap-2">
        <Button size="sm" variant="accent" onClick={handleSubmit} disabled={isPending || rating === 0}>
          {isPending ? 'Submitting...' : 'Submit Review'}
        </Button>
        <Button size="sm" variant="outline" onClick={onDone}>
          Cancel
        </Button>
      </div>
    </div>
  );
}

function TenantDashboardContent() {
  const { data: rentals, isLoading: rentalsLoading } = useTenantRentals();
  const { data: payments, isLoading: paymentsLoading } = useMyPayments();
  const [reviewingId, setReviewingId] = useState<string | null>(null);

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
                <div key={rental.id} className="py-4">
                  <div className="flex items-center justify-between">
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
                      {(rental.status === 'ACTIVE' || rental.status === 'COMPLETED') &&
                        reviewingId !== rental.id && (
                          <Button size="sm" variant="outline" onClick={() => setReviewingId(rental.id)}>
                            Leave Review
                          </Button>
                        )}
                    </div>
                  </div>

                  {reviewingId === rental.id && (
                    <ReviewForm
                      propertyId={rental.propertyId}
                      onDone={() => setReviewingId(null)}
                    />
                  )}
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