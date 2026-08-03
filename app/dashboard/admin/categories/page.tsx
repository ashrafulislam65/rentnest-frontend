'use client';

import { useState } from 'react';
import { RoleGuard } from '@/components/shared/RoleGuard';
import { DashboardShell } from '@/components/shared/DashboardShell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useCategories } from '@/hooks/useProperties';
import { useCreateCategory, useDeleteCategory, useUpdateCategory } from '@/hooks/useAdmin';

function AdminCategoriesContent() {
  const { data: categories, isLoading } = useCategories();
  const { mutate: createCategory, isPending: isCreating } = useCreateCategory();
  const { mutate: deleteCategory } = useDeleteCategory();
  const { mutate: updateCategory, isPending: isUpdating } = useUpdateCategory();
  const [name, setName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  const handleAdd = () => {
    if (!name.trim()) return;
    createCategory(name.trim(), { onSuccess: () => setName('') });
  };

  const startEdit = (id: string, currentName: string) => {
    setEditingId(id);
    setEditName(currentName);
  };

  const saveEdit = () => {
    if (!editingId || !editName.trim()) return;
    updateCategory(
      { id: editingId, name: editName.trim() },
      { onSuccess: () => setEditingId(null) }
    );
  };

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wider text-accent">Dashboard</p>
        <h1 className="font-display text-3xl">Category Management</h1>
      </div>

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
            <Button variant="accent" onClick={handleAdd} disabled={isCreating}>
              Add
            </Button>
          </div>

          {isLoading && <Skeleton className="h-32 w-full" />}
          {!isLoading && (
            <div className="divide-y divide-border">
              {categories?.map((c) => (
                <div key={c.id} className="flex items-center justify-between gap-2 py-2">
                  {editingId === c.id ? (
                    <>
                      <Input
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && saveEdit()}
                        className="max-w-xs"
                        autoFocus
                      />
                      <div className="flex gap-2">
                        <Button size="sm" variant="accent" onClick={saveEdit} disabled={isUpdating}>
                          Save
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => setEditingId(null)}>
                          Cancel
                        </Button>
                      </div>
                    </>
                  ) : (
                    <>
                      <span>{c.name}</span>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => startEdit(c.id, c.name)}>
                          Edit
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => deleteCategory(c.id)}>
                          Delete
                        </Button>
                      </div>
                    </>
                  )}
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
      <DashboardShell role="ADMIN">
        <AdminCategoriesContent />
      </DashboardShell>
    </RoleGuard>
  );
}