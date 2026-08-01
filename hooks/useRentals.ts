'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { ApiResponse, Rental, RentalStatus } from '../types';
import { getApiErrorMessage } from '../lib/api-client';
import { apiClient } from '../lib/api-client';

// ---- Tenant side ----

export function useTenantRentals() {
  return useQuery({
    queryKey: ['tenant-rentals'],
    queryFn: async () => {
      const res = await apiClient.get<ApiResponse<Rental[]>>('/rentals');
      return res.data.data;
    },
  });
}

export function useRental(id: string) {
  return useQuery({
    queryKey: ['rental', id],
    queryFn: async () => {
      const res = await apiClient.get<ApiResponse<Rental>>(`/rentals/${id}`);
      return res.data.data;
    },
    enabled: !!id,
  });
}

export function useSubmitRentalRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (propertyId: string) => {
      const res = await apiClient.post<ApiResponse<Rental>>('/rentals', { propertyId });
      return res.data.data;
    },
    onSuccess: () => {
      toast.success('Rental request submitted');
      queryClient.invalidateQueries({ queryKey: ['tenant-rentals'] });
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });
}

// ---- Landlord side ----

export function useLandlordRequests() {
  return useQuery({
    queryKey: ['landlord-requests'],
    queryFn: async () => {
      const res = await apiClient.get<ApiResponse<Rental[]>>('/landlord/requests');
      return res.data.data;
    },
  });
}

export function useHandleRentalRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: RentalStatus }) => {
      const res = await apiClient.patch<ApiResponse<Rental>>(`/landlord/requests/${id}`, {
        status,
      });
      return res.data.data;
    },
    // Optimistic UI: flip the badge instantly, roll back on failure
    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({ queryKey: ['landlord-requests'] });
      const previous = queryClient.getQueryData<Rental[]>(['landlord-requests']);

      queryClient.setQueryData<Rental[]>(['landlord-requests'], (old) =>
        old?.map((r) => (r.id === id ? { ...r, status } : r))
      );

      return { previous };
    },
    onError: (error, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['landlord-requests'], context.previous);
      }
      toast.error(getApiErrorMessage(error));
    },
    onSuccess: (_data, variables) => {
      toast.success(
        variables.status === 'APPROVED' ? 'Request approved' : 'Request rejected'
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['landlord-requests'] });
    },
  });
}