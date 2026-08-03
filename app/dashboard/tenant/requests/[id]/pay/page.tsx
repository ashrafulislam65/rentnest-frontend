'use client';

import { use, useEffect } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { RoleGuard } from '@/components/shared/RoleGuard';
import { DashboardShell } from '@/components/shared/DashboardShell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { StripeCheckoutForm } from '@/components/forms/StripeCheckoutForm';
import { useCreatePaymentIntent } from '@/hooks/usePayments';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

function PayPageContent({ rentalRequestId }: { rentalRequestId: string }) {
  const { mutate: createIntent, data, isPending, isError } = useCreatePaymentIntent();

  useEffect(() => {
    createIntent(rentalRequestId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rentalRequestId]);

  return (
    <div className="max-w-md">
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-wider text-accent">Dashboard</p>
        <h1 className="font-display text-3xl">Complete Payment</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Payment Details</CardTitle>
        </CardHeader>
        <CardContent>
          {isPending && <Skeleton className="h-40 w-full" />}
          {isError && (
            <p className="text-sm text-destructive">
              Couldn&apos;t start the payment. Please try again from your dashboard.
            </p>
          )}
          {data && (
            <Elements stripe={stripePromise} options={{ clientSecret: data.clientSecret }}>
              <StripeCheckoutForm clientSecret={data.clientSecret} rentalRequestId={rentalRequestId} />
            </Elements>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function TenantPayPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return (
    <RoleGuard role="TENANT">
      <DashboardShell role="TENANT">
        <PayPageContent rentalRequestId={id} />
      </DashboardShell>
    </RoleGuard>
  );
}