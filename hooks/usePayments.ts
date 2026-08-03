'use client';

import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { apiClient, getApiErrorMessage } from '@/lib/api-client';
import type { ApiResponse, Payment } from '@/types';

interface CreatePaymentResponse {
  clientSecret: string;
}

interface ConfirmPaymentPayload {
  rentalRequestId: string;
  transactionId: string;
  amount: number;
}

export function useCreatePaymentIntent() {
  return useMutation({
    mutationFn: async (rentalRequestId: string) => {
      const res = await apiClient.post<ApiResponse<CreatePaymentResponse>>('/payments/create', {
        rentalRequestId,
      });
      return res.data.data;
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });
}

export function useConfirmPayment() {
  return useMutation({
    mutationFn: async (payload: ConfirmPaymentPayload) => {
      const res = await apiClient.post<ApiResponse<Payment>>('/payments/confirm', payload);
      return res.data.data;
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });
}

export function useMyPayments() {
  return useQuery({
    queryKey: ['my-payments'],
    queryFn: async () => {
      const res = await apiClient.get<ApiResponse<Payment[]>>('/payments');
      return res.data.data;
    },
  });
}