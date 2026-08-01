'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { toast } from 'sonner';
import { useConfirmPayment } from '../../hooks/usePayments';
import { Button } from '../ui/button';


export function StripeCheckoutForm({
  clientSecret,
  paymentId,
}: {
  clientSecret: string;
  paymentId: string;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const { mutateAsync: confirmPayment } = useConfirmPayment();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setIsProcessing(false);
      return;
    }

    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: { card: cardElement },
    });

    if (error) {
      toast.error(error.message ?? 'Payment failed. Please try again.');
      setIsProcessing(false);
      router.push('/payment/cancel');
      return;
    }

    if (paymentIntent?.status === 'succeeded') {
      try {
        await confirmPayment(paymentId);
        router.push('/payment/success');
      } catch {
        // useConfirmPayment already toasts the error
        router.push('/payment/cancel');
      }
    }

    setIsProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="rounded-md border p-3">
        <CardElement
          options={{
            style: {
              base: { fontSize: '16px', color: '#1a1a1a', '::placeholder': { color: '#9ca3af' } },
            },
          }}
        />
      </div>
      <Button type="submit" className="w-full" disabled={!stripe || isProcessing}>
        {isProcessing ? 'Processing payment...' : 'Pay Now'}
      </Button>
    </form>
  );
}