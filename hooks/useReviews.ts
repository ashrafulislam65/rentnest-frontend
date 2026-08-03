'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { apiClient, getApiErrorMessage } from '@/lib/api-client';
import type { ApiResponse, Review } from '@/types';

export function usePropertyReviews(propertyId: string) {
  return useQuery({
    queryKey: ['reviews', propertyId],
    queryFn: async () => {
      const res = await apiClient.get<ApiResponse<Review[]>>(`/reviews/${propertyId}`);
      return res.data.data;
    },
    enabled: !!propertyId,
  });
}

export function useCreateReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { propertyId: string; rating: number; comment: string }) => {
      const res = await apiClient.post<ApiResponse<Review>>('/reviews', payload);
      return res.data.data;
    },
    onSuccess: (_data, variables) => {
      toast.success('Review submitted');
      queryClient.invalidateQueries({ queryKey: ['reviews', variables.propertyId] });
      queryClient.invalidateQueries({ queryKey: ['tenant-rentals'] });
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });
}