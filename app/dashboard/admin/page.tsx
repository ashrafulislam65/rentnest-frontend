'use client';

import { useState } from 'react';
import { RoleGuard } from '@/components/shared/RoleGuard';
import { DashboardShell } from '@/components/shared/DashboardShell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAdminUsers, useToggleUserBan } from '@/hooks/useAdmin';

const PAGE_SIZE = 10;

function AdminUsersContent() {
  const { data: users, isLoading } = useAdminUsers();
  const { mutate: toggleBan, isPending } = useToggleUserBan();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const filtered = users?.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.max(1, Math.ceil((filtered?.length ?? 0) / PAGE_SIZE));
  const paginated = filtered?.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wider text-accent">Dashboard</p>
        <h1 className="font-display text-3xl">User Management</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
          <Input
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="mt-2 max-w-sm"
          />
        </CardHeader>
        <CardContent>
          {isLoading && <Skeleton className="h-64 w-full" />}

          {!isLoading && filtered?.length === 0 && (
            <p className="py-8 text-center text-muted-foreground">No users match your search.</p>
          )}

          {!isLoading && filtered && filtered.length > 0 && (
            <>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-muted-foreground">
                    <th className="py-2">Name</th>
                    <th className="py-2">Email</th>
                    <th className="py-2">Role</th>
                    <th className="py-2">Status</th>
                    <th className="py-2 text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated?.map((u) => (
                    <tr key={u.id} className="border-b border-border last:border-0">
                      <td className="py-3">{u.name}</td>
                      <td className="py-3">{u.email}</td>
                      <td className="py-3">{u.role}</td>
                      <td className="py-3">
                        <Badge variant={u.isBanned ? 'red' : 'green'}>
                          {u.isBanned ? 'Banned' : 'Active'}
                        </Badge>
                      </td>
                      <td className="py-3 text-right">
                        <Button
                          size="sm"
                          variant={u.isBanned ? 'outline' : 'destructive'}
                          disabled={isPending}
                          onClick={() => toggleBan({ userId: u.id, isBanned: !u.isBanned })}
                        >
                          {u.isBanned ? 'Unban' : 'Ban'}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="mt-4 flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Page {page} of {totalPages}
                </p>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
                    Previous
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={page === totalPages}
                    onClick={() => setPage((p) => p + 1)}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function AdminUsersPage() {
  return (
    <RoleGuard role="ADMIN">
      <DashboardShell role="ADMIN">
        <AdminUsersContent />
      </DashboardShell>
    </RoleGuard>
  );
}