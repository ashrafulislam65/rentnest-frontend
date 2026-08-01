

import { RentalStatus } from '../../types';
import { Badge } from '../ui/badge';

const STATUS_MAP: Record<RentalStatus, { label: string; variant: 'amber' | 'blue' | 'red' | 'green' | 'gray' }> = {
  PENDING: { label: 'Pending', variant: 'amber' },
  APPROVED: { label: 'Approved', variant: 'blue' },
  REJECTED: { label: 'Rejected', variant: 'red' },
  ACTIVE: { label: 'Active', variant: 'green' },
  COMPLETED: { label: 'Completed', variant: 'gray' },
};

export function StatusBadge({ status }: { status: RentalStatus }) {
  const { label, variant } = STATUS_MAP[status];
  return <Badge variant={variant}>{label}</Badge>;
}