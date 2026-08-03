'use client';

import { use } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { RoleGuard } from '@/components/shared/RoleGuard';
import { DashboardShell } from '@/components/shared/DashboardShell';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCategories, useProperty, useUpdateProperty } from '@/hooks/useProperties';
import { createPropertySchema } from '@/lib/validations';

function EditPropertyContent({ propertyId }: { propertyId: string }) {
  const router = useRouter();
  const { data: property, isLoading } = useProperty(propertyId);
  const { data: categories } = useCategories();
  const { mutate: updateProperty, isPending } = useUpdateProperty(propertyId);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.input<typeof createPropertySchema>, unknown, z.output<typeof createPropertySchema>>({
    resolver: zodResolver(createPropertySchema),
    values: property
      ? {
          title: property.title,
          description: property.description,
          price: property.price,
          location: property.location,
          categoryId: property.categoryId,
          images: property.images?.join(', ') ?? '',
          amenities: property.amenities?.join(', ') ?? '',
        }
      : undefined,
  });

  const onSubmit = (values: z.output<typeof createPropertySchema>) => {
    updateProperty(
      {
        title: values.title,
        description: values.description,
        price: values.price,
        location: values.location,
        categoryId: values.categoryId,
        images: values.images.split(',').map((url) => url.trim()).filter(Boolean),
        amenities: values.amenities.split(',').map((item) => item.trim()).filter(Boolean),
      },
      { onSuccess: () => router.push('/dashboard/landlord') }
    );
  };

  if (isLoading || !property) {
    return <Skeleton className="h-96 w-full max-w-xl" />;
  }

  return (
    <div className="max-w-xl">
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-wider text-accent">Dashboard</p>
        <h1 className="font-display text-3xl">Edit Property</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Property Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="title">Title</Label>
              <Input id="title" {...register('title')} />
              {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                rows={4}
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                {...register('description')}
              />
              {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="price">Price / month</Label>
                <Input id="price" type="number" {...register('price')} />
                {errors.price && <p className="text-sm text-destructive">{errors.price.message}</p>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="location">Location</Label>
                <Input id="location" {...register('location')} />
                {errors.location && <p className="text-sm text-destructive">{errors.location.message}</p>}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="categoryId">Category</Label>
              <select
                id="categoryId"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                {...register('categoryId')}
              >
                <option value="">Select a category</option>
                {categories?.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              {errors.categoryId && <p className="text-sm text-destructive">{errors.categoryId.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="images">Image URLs (comma separated)</Label>
              <Input id="images" {...register('images')} />
              {errors.images && <p className="text-sm text-destructive">{errors.images.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="amenities">Amenities (comma separated)</Label>
              <Input id="amenities" {...register('amenities')} />
              {errors.amenities && <p className="text-sm text-destructive">{errors.amenities.message}</p>}
            </div>

            <Button type="submit" variant="accent" className="w-full" disabled={isPending}>
              {isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default function EditPropertyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return (
    <RoleGuard role="LANDLORD">
      <DashboardShell role="LANDLORD">
        <EditPropertyContent propertyId={id} />
      </DashboardShell>
    </RoleGuard>
  );
}