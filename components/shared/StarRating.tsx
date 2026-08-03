'use client';

import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

export function StarRating({
  value,
  onChange,
}: {
  value: number;
  onChange: (rating: number) => void;
}) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          className="p-0.5"
          aria-label={`${star} star`}
        >
          <Star
            className={cn(
              'h-6 w-6 transition-colors',
              star <= value ? 'fill-accent text-accent' : 'fill-none text-muted-foreground'
            )}
          />
        </button>
      ))}
    </div>
  );
}