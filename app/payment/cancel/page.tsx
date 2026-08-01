import Link from 'next/link';
import { XCircle } from 'lucide-react';
import { Button } from '../../../components/ui/button';


export default function PaymentCancelPage() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center gap-4 p-6 text-center">
      <XCircle className="h-16 w-16 text-destructive" />
      <h1 className="text-2xl font-bold">Payment Cancelled</h1>
      <p className="text-muted-foreground">
        Your payment wasn&apos;t completed. No charge was made. You can try again from your dashboard.
      </p>
      <Link href="/dashboard/tenant">
        <Button variant="outline">Back to Dashboard</Button>
      </Link>
    </div>
  );
}