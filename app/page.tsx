'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Search, ShieldCheck, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PropertyCard } from '@/components/shared/PropertyCard';
import { Skeleton } from '@/components/ui/skeleton';
import { useProperties } from '@/hooks/useProperties';

const STEPS = [
  { icon: Search, title: 'Browse & Filter', desc: 'Search verified listings by location, price, and category.' },
  { icon: ShieldCheck, title: 'Request & Get Approved', desc: 'Submit a request, landlords respond fast.' },
  { icon: CreditCard, title: 'Pay Securely', desc: 'Complete payment through Stripe, no cash hassle.' },
];

export default function HomePage() {
  const { data: properties, isLoading } = useProperties();
  const featured = properties?.slice(0, 6) ?? [];

  return (
    <div>
      <section className="relative h-[560px] w-full overflow-hidden bg-secondary">
        <Image
          src="https://images.unsplash.com/photo-1594484208280-efa00f96fc21?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Modern home exterior"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10" />

        <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
          <h1 className="font-display text-5xl leading-tight text-white sm:text-6xl">
            Find a place<br />you&apos;ll love to call home
          </h1>
          <p className="mt-4 max-w-md text-white/85">
            Browse verified listings, request a rental, and pay securely — all in one place.
          </p>

          <div className="mt-8 flex w-full max-w-xl items-center gap-2 rounded-md bg-white p-2 shadow-xl">
            <Search className="ml-2 h-5 w-5 shrink-0 text-muted-foreground" />
            <Input
              placeholder="Search by location..."
              className="border-0 shadow-none focus-visible:ring-0"
            />
            <Link href="/properties">
              <Button variant="accent">Search</Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-accent">Featured</p>
            <h2 className="font-display text-3xl">Popular Properties</h2>
          </div>
          <Link href="/properties" className="text-sm font-semibold text-accent hover:underline">
            View all listings →
          </Link>
        </div>

        {isLoading && (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-80 w-full" />
            ))}
          </div>
        )}

        {!isLoading && featured.length === 0 && (
          <p className="text-muted-foreground">No properties available right now.</p>
        )}

        {!isLoading && featured.length > 0 && (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
      </section>

      <section className="border-t border-border bg-secondary/30">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="mb-12 text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-accent">Process</p>
            <h2 className="font-display text-3xl">How RentNest Works</h2>
          </div>
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-3">
            {STEPS.map((step) => (
              <div key={step.title} className="text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-accent/10 text-accent">
                  <step.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 font-display text-lg">{step.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 text-center">
        <h2 className="font-display text-3xl">Have a property to rent out?</h2>
        <p className="mx-auto mt-3 max-w-md text-muted-foreground">
          Join hundreds of landlords listing on RentNest — manage requests and payments in one dashboard.
        </p>
        <Link href="/register">
          <Button variant="accent" size="lg" className="mt-6">
            Get Started as a Landlord
          </Button>
        </Link>
      </section>
    </div>
  );
}