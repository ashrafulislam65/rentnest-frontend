'use client';

import { useEffect, useState } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useCreatePaymentIntent } from '../../../../../../hooks/usePayments';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../../../components/ui/card';
import { Skeleton } from '../../../../../../components/ui/skeleton';
import { StripeCheckoutForm } from '../../../../../../components/forms/StripeCheckoutForm';
import { RoleGuard } from '../../../../../../components/shared/RoleGuard';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

function PayPageContent({ rentalId }: { rentalId: string }) {
  const { mutate: createIntent, data, isPending, isError } = useCreatePaymentIntent();

  useEffect(() => {
    createIntent(rentalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rentalId]);

  return (
    <div className="mx-auto max-w-md p-6">
      <Card>
        <CardHeader>
          <CardTitle>Complete Payment</CardTitle>
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
              <StripeCheckoutForm clientSecret={data.clientSecret} paymentId={data.paymentId} />
            </Elements>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function TenantPayPage({ params }: { params: { id: string } }) {
  return (
    <RoleGuard role="TENANT">
      <PayPageContent rentalId={params.id} />
    </RoleGuard>
  );
}