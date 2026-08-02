import Link from 'next/link';
import Image from 'next/image';
import { MapPin } from 'lucide-react';
import { formatCurrency, PLACEHOLDER_IMAGE } from '@/lib/utils';
import type { Property } from '@/types';

export function PropertyCard({ property }: { property: Property }) {
  const hasImage = property.images && property.images.length > 0;
  const image = hasImage ? property.images[0] : PLACEHOLDER_IMAGE;

  return (
    <Link href={`/properties/${property.id}`} className="group block">
      <div className="relative h-56 w-full overflow-hidden rounded-md bg-muted">
        <Image
          src={image}
          alt={property.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 33vw"
          unoptimized={!hasImage}
        />
        <span className="absolute right-3 top-3 rounded-md bg-white px-3 py-1 text-sm font-semibold shadow-md">
          {formatCurrency(property.price)}
          <span className="font-normal text-muted-foreground">/mo</span>
        </span>
      </div>
      <div className="pt-3">
        <h3 className="line-clamp-1 font-display text-lg">{property.title}</h3>
        <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
          <MapPin className="h-3.5 w-3.5 shrink-0 text-accent" />
          {property.location}
        </p>
      </div>
    </Link>
  );
}