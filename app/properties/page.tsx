'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import { PropertyCard } from '@/components/shared/PropertyCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { PropertyFilters, useCategories, useProperties } from '@/hooks/useProperties';

export default function PropertiesPage() {
  const [filters, setFilters] = useState<PropertyFilters>({});
  const [draft, setDraft] = useState<PropertyFilters>({});

  const { data: properties, isLoading } = useProperties(filters);
  const { data: categories } = useCategories();

  return (
    <div className="mx-auto max-w-7xl px-6 py-14">
      <div className="mb-10">
        <p className="text-sm font-semibold uppercase tracking-wider text-accent">Listings</p>
        <h1 className="font-display text-4xl">Browse Properties</h1>
      </div>

      <div className="mb-10 grid grid-cols-1 gap-4 rounded-md border border-border bg-card p-5 sm:grid-cols-5">
        <div className="space-y-1.5">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            placeholder="e.g. Dhaka"
            value={draft.location ?? ''}
            onChange={(e) => setDraft((d) => ({ ...d, location: e.target.value }))}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="priceMin">Min price</Label>
          <Input
            id="priceMin"
            type="number"
            value={draft.priceMin ?? ''}
            onChange={(e) => setDraft((d) => ({ ...d, priceMin: Number(e.target.value) || undefined }))}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="priceMax">Max price</Label>
          <Input
            id="priceMax"
            type="number"
            value={draft.priceMax ?? ''}
            onChange={(e) => setDraft((d) => ({ ...d, priceMax: Number(e.target.value) || undefined }))}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="category">Category</Label>
          <select
            id="category"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            value={draft.categoryId ?? ''}
            onChange={(e) => setDraft((d) => ({ ...d, categoryId: e.target.value || undefined }))}
          >
            <option value="">All</option>
            {categories?.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-end">
          <Button variant="accent" className="w-full" onClick={() => setFilters(draft)}>
            <Search className="h-4 w-4" />
            Search
          </Button>
        </div>
      </div>

      {isLoading && (
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-80 w-full" />
          ))}
        </div>
      )}

      {!isLoading && properties?.length === 0 && (
        <p className="text-muted-foreground">No properties match your filters.</p>
      )}

      {!isLoading && properties && properties.length > 0 && (
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      )}
    </div>
  );
}