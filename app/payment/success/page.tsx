import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';
import { Button } from '../../../components/ui/button';


export default function PaymentSuccessPage() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center gap-4 p-6 text-center">
      <CheckCircle2 className="h-16 w-16 text-green-600" />
      <h1 className="text-2xl font-bold">Payment Successful</h1>
      <p className="text-muted-foreground">
        Your payment has been confirmed. Your rental is now active.
      </p>
      <Link href="/dashboard/tenant">
        <Button>Go to Dashboard</Button>
      </Link>
    </div>
  );
}