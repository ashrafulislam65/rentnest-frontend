import Image from 'next/image';
import Link from 'next/link';
import { MapPin } from 'lucide-react';


import { Property } from '../../types';
import { formatCurrency } from '../../lib/utils';
import { Card,CardContent, CardFooter } from '../ui/card';

export function PropertyCard({ property }: { property: Property }) {
  const image = property.images?.[0] || '/placeholder-property.jpg';

  return (
    <Link href={`/properties/${property.id}`}>
      <Card className="overflow-hidden transition-shadow hover:shadow-md">
        <div className="relative h-48 w-full bg-muted">
          <Image
            src={image}
            alt={property.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
          {!property.isAvailable && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <span className="rounded bg-white px-2 py-1 text-xs font-semibold">Not Available</span>
            </div>
          )}
        </div>
        <CardContent className="pt-4">
          <h3 className="line-clamp-1 font-semibold">{property.title}</h3>
          <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="h-3.5 w-3.5" />
            {property.location}
          </p>
        </CardContent>
        <CardFooter className="justify-between">
          <span className="font-bold text-primary">{formatCurrency(property.price)}/mo</span>
          {property.category?.name && (
            <span className="text-xs text-muted-foreground">{property.category.name}</span>
          )}
        </CardFooter>
      </Card>
    </Link>
  );
}