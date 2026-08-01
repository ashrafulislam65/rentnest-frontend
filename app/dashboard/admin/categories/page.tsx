'use client';

import { useState } from 'react';
import { useCategories } from '../../../../hooks/useProperties';
import { useCreateCategory, useDeleteCategory } from '../../../../hooks/useAdmin';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/card';
import { Input } from '../../../../components/ui/input';
import { Button } from '../../../../components/ui/button';
import { Skeleton } from '../../../../components/ui/skeleton';
import { RoleGuard } from '../../../../components/shared/RoleGuard';


function AdminCategoriesContent() {
  const { data: categories, isLoading } = useCategories();
  const { mutate: createCategory, isPending: isCreating } = useCreateCategory();
  const { mutate: deleteCategory } = useDeleteCategory();
  const [name, setName] = useState('');

  const handleAdd = () => {
    if (!name.trim()) return;
    createCategory(name.trim(), { onSuccess: () => setName('') });
  };

  return (
    <div className="mx-auto max-w-2xl p-6">
      <h1 className="mb-6 text-2xl font-bold">Category Management</h1>

      <Card>
        <CardHeader>
          <CardTitle>Categories</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="New category name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            />
            <Button onClick={handleAdd} disabled={isCreating}>
              Add
            </Button>
          </div>

          {isLoading && <Skeleton className="h-32 w-full" />}
          {!isLoading && (
            <div className="divide-y">
              {categories?.map((c) => (
                <div key={c.id} className="flex items-center justify-between py-2">
                  <span>{c.name}</span>
                  <Button size="sm" variant="outline" onClick={() => deleteCategory(c.id)}>
                    Delete
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function AdminCategoriesPage() {
  return (
    <RoleGuard role="ADMIN">
      <AdminCategoriesContent />
    </RoleGuard>
  );
}