'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { MapPin } from 'lucide-react';
import { useProperty } from '../../../hooks/useProperties';
import { useAuthStore } from '../../../store/auth-store';
import { Skeleton } from '../../../components/ui/skeleton';
import { formatCurrency } from '../../../lib/utils';
import { Button } from '../../../components/ui/button';
import { useSubmitRentalRequest } from '../../../hooks/useRentals';



export default function PropertyDetailsPage({ params }: { params: { id: string } }) {
  const { data: property, isLoading } = useProperty(params.id);
  const { user } = useAuthStore();
  const router = useRouter();
  const { mutate: requestRental, isPending } = useSubmitRentalRequest();

  const handleRequest = () => {
    if (!user) {
      router.push(`/login?redirect=/properties/${params.id}`);
      return;
    }
    if (user.role !== 'TENANT') return;
    requestRental(params.id);
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl space-y-4 p-6">
        <Skeleton className="h-80 w-full" />
        <Skeleton className="h-6 w-1/2" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  if (!property) return null;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {(property.images.length ? property.images : ['/placeholder-property.jpg']).map((img, i) => (
          <div key={i} className="relative h-40 overflow-hidden rounded-md bg-muted">
            <Image src={img} alt={property.title} fill className="object-cover" />
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <h1 className="text-2xl font-bold">{property.title}</h1>
          <p className="mt-1 flex items-center gap-1 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            {property.location}
          </p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-primary">{formatCurrency(property.price)}/mo</p>
        </div>
      </div>

      <p className="mt-6 leading-relaxed text-foreground/90">{property.description}</p>

      <div className="mt-8">
        <Button
          size="lg"
          onClick={handleRequest}
          disabled={isPending || !property.isAvailable || (!!user && user.role !== 'TENANT')}
        >
          {isPending
            ? 'Submitting request...'
            : !property.isAvailable
            ? 'Not Available'
            : 'Request to Rent'}
        </Button>
        {user && user.role !== 'TENANT' && (
          <p className="mt-2 text-sm text-muted-foreground">Only tenant accounts can request rentals.</p>
        )}
      </div>
    </div>
  );
}