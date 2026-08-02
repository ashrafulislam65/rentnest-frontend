'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Home, ListChecks, Users, Tag, LogOut, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/auth-store';

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

const NAV_ITEMS: Record<'TENANT' | 'LANDLORD' | 'ADMIN', NavItem[]> = {
  TENANT: [{ label: 'Overview', href: '/dashboard/tenant', icon: LayoutDashboard }],
  LANDLORD: [
    { label: 'Overview', href: '/dashboard/landlord', icon: LayoutDashboard },
    { label: 'Add Property', href: '/dashboard/landlord/properties/new', icon: Home },
    { label: 'Requests', href: '/dashboard/landlord/requests', icon: ListChecks },
  ],
  ADMIN: [
    { label: 'Overview', href: '/dashboard/admin', icon: LayoutDashboard },
    { label: 'Users', href: '/dashboard/admin/users', icon: Users },
    { label: 'Categories', href: '/dashboard/admin/categories', icon: Tag },
  ],
};

export function DashboardShell({
  role,
  children,
}: {
  role: 'TENANT' | 'LANDLORD' | 'ADMIN';
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const items = NAV_ITEMS[role];

  return (
    <div className="mx-auto flex max-w-7xl">
      <aside className="hidden w-64 shrink-0 border-r border-border px-4 py-8 sm:block">
        <div className="mb-8 px-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {role === 'TENANT' ? 'Tenant' : role === 'LANDLORD' ? 'Landlord' : 'Admin'} Panel
          </p>
          <p className="mt-1 truncate font-display text-lg">{user?.name || user?.email}</p>
        </div>

        <nav className="space-y-1">
          {items.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  active
                    ? 'bg-accent text-accent-foreground'
                    : 'text-foreground/70 hover:bg-secondary hover:text-foreground'
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <button
          onClick={logout}
          className="mt-8 flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground"
        >
          <LogOut className="h-4 w-4" />
          Log out
        </button>
      </aside>

      <div className="min-w-0 flex-1 px-6 py-8 sm:px-10">{children}</div>
    </div>
  );
}