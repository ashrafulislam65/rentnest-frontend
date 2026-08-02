'use client';

import { use } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { MapPin, Check } from 'lucide-react';
import { useProperty } from '@/hooks/useProperties';
import { useAuthStore } from '@/store/auth-store';
import { useSubmitRentalRequest } from '@/hooks/useRentals';
import { Skeleton } from '@/components/ui/skeleton';
import { formatCurrency, PLACEHOLDER_IMAGE } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export default function PropertyDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: property, isLoading } = useProperty(id);
  const { user } = useAuthStore();
  const router = useRouter();
  const { mutate: requestRental, isPending } = useSubmitRentalRequest();

  const handleRequest = () => {
    if (!user) {
      router.push(`/login?redirect=/properties/${id}`);
      return;
    }
    if (user.role !== 'TENANT') return;
    requestRental(id);
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-5xl space-y-4 p-6">
        <Skeleton className="h-96 w-full" />
        <Skeleton className="h-6 w-1/2" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  if (!property) return null;

  const hasImages = property.images && property.images.length > 0;
  const images = hasImages ? property.images : [PLACEHOLDER_IMAGE];

  return (
    <div className="mx-auto max-w-5xl px-6 py-14">
      {images.length === 1 ? (
        <div className="relative h-96 w-full overflow-hidden rounded-md bg-muted">
          <Image src={images[0]} alt={property.title} fill className="object-cover" unoptimized={!hasImages} />
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {images.map((img, i) => (
            <div key={i} className="relative h-44 overflow-hidden rounded-md bg-muted">
              <Image src={img} alt={property.title} fill className="object-cover" unoptimized={!hasImages} />
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 flex flex-col justify-between gap-4 border-b border-border pb-8 sm:flex-row sm:items-start">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-accent">
            {property.category?.name ?? 'Property'}
          </p>
          <h1 className="font-display text-4xl">{property.title}</h1>
          <p className="mt-2 flex items-center gap-1 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            {property.location}
          </p>
        </div>
        <div className="text-right">
          <p className="font-display text-3xl">{formatCurrency(property.price)}</p>
          <p className="text-sm text-muted-foreground">per month</p>
        </div>
      </div>

      <p className="mt-8 max-w-3xl leading-relaxed text-foreground/90">{property.description}</p>

      {property.amenities && property.amenities.length > 0 && (
        <div className="mt-8">
          <h2 className="font-display text-xl">Amenities</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {property.amenities.map((item) => (
              <span
                key={item}
                className="flex items-center gap-1.5 rounded-md border border-border bg-secondary px-3 py-1.5 text-sm"
              >
                <Check className="h-3.5 w-3.5 text-accent" />
                {item}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="mt-10">
        <Button
          variant="accent"
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