'use client';

import Link from 'next/link';
import { useProperties } from '../hooks/useProperties';
import { Button } from '../components/ui/button';
import { Skeleton } from '../components/ui/skeleton';
import { PropertyCard } from '../components/shared/PropertyCard';


export default function HomePage() {
  const { data: properties, isLoading } = useProperties();
  const featured = properties?.slice(0, 6) ?? [];

  return (
    <div>
      <section className="border-b bg-secondary/50">
        <div className="mx-auto max-w-6xl px-4 py-16 text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Find your next <span className="text-primary">home</span>, without the hassle
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Browse verified listings, request a rental, and pay securely — all in one place.
          </p>
          <Link href="/properties">
            <Button size="lg" className="mt-6">
              Browse Properties
            </Button>
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="mb-6 text-2xl font-semibold">Featured Properties</h2>

        {isLoading && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-64 w-full" />
            ))}
          </div>
        )}

        {!isLoading && featured.length === 0 && (
          <p className="text-muted-foreground">No properties available right now. Check back soon.</p>
        )}

        {!isLoading && featured.length > 0 && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}