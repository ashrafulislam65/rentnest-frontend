'use client';

import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { ApiResponse, Payment } from '../types';
import { apiClient, getApiErrorMessage } from '../lib/api-client';


interface CreatePaymentResponse {
  clientSecret: string;
  paymentId: string;
}

export function useCreatePaymentIntent() {
  return useMutation({
    mutationFn: async (rentalId: string) => {
      const res = await apiClient.post<ApiResponse<CreatePaymentResponse>>('/payments/create', {
        rentalId,
      });
      return res.data.data;
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });
}

export function useConfirmPayment() {
  return useMutation({
    mutationFn: async (paymentId: string) => {
      const res = await apiClient.post<ApiResponse<Payment>>('/payments/confirm', { paymentId });
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