'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { ApiResponse, Category, Property } from '../types';
import { getApiErrorMessage } from '../lib/api-client';
import { apiClient } from '../lib/api-client';


export interface PropertyFilters {
  location?: string;
  priceMin?: number;
  priceMax?: number;
  categoryId?: string;
}

export function useProperties(filters: PropertyFilters = {}) {
  return useQuery({
    queryKey: ['properties', filters],
    queryFn: async () => {
      const res = await apiClient.get<ApiResponse<Property[]>>('/properties', {
        params: filters,
      });
      return res.data.data;
    },
  });
}

export function useProperty(id: string) {
  return useQuery({
    queryKey: ['property', id],
    queryFn: async () => {
      const res = await apiClient.get<ApiResponse<Property>>(`/properties/${id}`);
      return res.data.data;
    },
    enabled: !!id,
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await apiClient.get<ApiResponse<Category[]>>('/categories');
      return res.data.data;
    },
  });
}

// ---- Landlord property CRUD ----

export function useLandlordProperties() {
  return useQuery({
    queryKey: ['landlord-properties'],
    queryFn: async () => {
      const res = await apiClient.get<ApiResponse<Property[]>>('/landlord/properties');
      return res.data.data;
    },
  });
}

export function useCreateProperty() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Partial<Property>) => {
      const res = await apiClient.post<ApiResponse<Property>>('/landlord/properties', payload);
      return res.data.data;
    },
    onSuccess: () => {
      toast.success('Property created');
      queryClient.invalidateQueries({ queryKey: ['landlord-properties'] });
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });
}

export function useUpdateProperty(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Partial<Property>) => {
      const res = await apiClient.put<ApiResponse<Property>>(`/landlord/properties/${id}`, payload);
      return res.data.data;
    },
    onSuccess: () => {
      toast.success('Property updated');
      queryClient.invalidateQueries({ queryKey: ['landlord-properties'] });
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });
}

export function useDeleteProperty() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/landlord/properties/${id}`);
      return id;
    },
    onSuccess: () => {
      toast.success('Property removed');
      queryClient.invalidateQueries({ queryKey: ['landlord-properties'] });
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });
}