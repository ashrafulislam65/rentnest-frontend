'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useCategories } from '../../../../../hooks/useProperties';
import { CreatePropertyFormValues, createPropertySchema } from '../../../../../lib/validations';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../../components/ui/card';
import { Label } from '../../../../../components/ui/label';
import { Input } from '../../../../../components/ui/input';
import { Button } from '../../../../../components/ui/button';
import { RoleGuard } from '../../../../../components/shared/RoleGuard';
import { useCreateProperty } from '../../../../../hooks/useProperties';



function NewPropertyContent() {
  const router = useRouter();
  const { data: categories } = useCategories();
  const { mutate: createProperty, isPending } = useCreateProperty();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreatePropertyFormValues>({ resolver: zodResolver(createPropertySchema) });

  const onSubmit = (values: CreatePropertyFormValues) => {
    createProperty(
      { ...values, images: values.images.split(',').map((url) => url.trim()) as unknown as string[] },
      { onSuccess: () => router.push('/dashboard/landlord') }
    );
  };

  return (
    <div className="mx-auto max-w-xl p-6">
      <Card>
        <CardHeader>
          <CardTitle>List a New Property</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="title">Title</Label>
              <Input id="title" placeholder="Cozy 2-bed apartment" {...register('title')} />
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
                <Input id="location" placeholder="Dhaka, Bangladesh" {...register('location')} />
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
              <Input id="images" placeholder="https://..., https://..." {...register('images')} />
              {errors.images && <p className="text-sm text-destructive">{errors.images.message}</p>}
            </div>

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? 'Creating...' : 'Create Property'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default function NewPropertyPage() {
  return (
    <RoleGuard role="LANDLORD">
      <NewPropertyContent />
    </RoleGuard>
  );
}