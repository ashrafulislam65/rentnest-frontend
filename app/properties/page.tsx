'use client';

import { useState } from 'react';

import { useCategories, useProperties, type PropertyFilters } from '@/hooks/useProperties';
import { Label } from '../../components/ui/label';
import { Input } from '../../components/ui/input';
import { Skeleton } from '../../components/ui/skeleton';
import { Button } from '../../components/ui/button';
import { PropertyCard } from '../../components/shared/PropertyCard';

export default function PropertiesPage() {
  const [filters, setFilters] = useState<PropertyFilters>({});
  const [draft, setDraft] = useState<PropertyFilters>({});

  const { data: properties, isLoading } = useProperties(filters);
  const { data: categories } = useCategories();

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">Browse Properties</h1>

      <div className="mb-8 grid grid-cols-1 gap-4 rounded-lg border p-4 sm:grid-cols-4">
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
          <Label htmlFor="minPrice">Min price</Label>
          <Input
            id="minPrice"
            type="number"
            value={draft.minPrice ?? ''}
            onChange={(e) => setDraft((d) => ({ ...d, minPrice: Number(e.target.value) || undefined }))}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="maxPrice">Max price</Label>
          <Input
            id="maxPrice"
            type="number"
            value={draft.maxPrice ?? ''}
            onChange={(e) => setDraft((d) => ({ ...d, maxPrice: Number(e.target.value) || undefined }))}
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

        <div className="sm:col-span-4">
          <Button onClick={() => setFilters(draft)}>Apply Filters</Button>
        </div>
      </div>

      {isLoading && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-64 w-full" />
          ))}
        </div>
      )}

      {!isLoading && properties?.length === 0 && (
        <p className="text-muted-foreground">No properties match your filters.</p>
      )}

      {!isLoading && properties && properties.length > 0 && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      )}
    </div>
  );
}