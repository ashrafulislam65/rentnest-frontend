'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { ApiResponse, Category, Property, Rental, User } from '../types';
import { getApiErrorMessage } from '../lib/api-client';
import { apiClient } from '../lib/api-client';


export function useAdminUsers() {
  return useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const res = await apiClient.get<ApiResponse<User[]>>('/admin/users');
      return res.data.data;
    },
  });
}

export function useToggleUserBan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ userId, isBanned }: { userId: string; isBanned: boolean }) => {
      const res = await apiClient.patch<ApiResponse<User>>(`/admin/users/${userId}/ban`, { isBanned });
      return res.data.data;
    },
    onMutate: async ({ userId, isBanned }) => {
      await queryClient.cancelQueries({ queryKey: ['admin-users'] });
      const previous = queryClient.getQueryData<User[]>(['admin-users']);
      queryClient.setQueryData<User[]>(['admin-users'], (old) =>
        old?.map((u) => (u.id === userId ? { ...u, isBanned } : u))
      );
      return { previous };
    },
    onError: (error, _vars, context) => {
      if (context?.previous) queryClient.setQueryData(['admin-users'], context.previous);
      toast.error(getApiErrorMessage(error));
    },
    onSuccess: () => toast.success('User status updated'),
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['admin-users'] }),
  });
}

export function useAdminProperties() {
  return useQuery({
    queryKey: ['admin-properties'],
    queryFn: async () => {
      const res = await apiClient.get<ApiResponse<Property[]>>('/admin/properties');
      return res.data.data;
    },
  });
}

export function useAdminRentals() {
  return useQuery({
    queryKey: ['admin-rentals'],
    queryFn: async () => {
      const res = await apiClient.get<ApiResponse<Rental[]>>('/admin/rentals');
      return res.data.data;
    },
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (name: string) => {
      const res = await apiClient.post<ApiResponse<Category>>('/admin/categories', { name });
      return res.data.data;
    },
    onSuccess: () => {
      toast.success('Category created');
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/admin/categories/${id}`);
      return id;
    },
    onSuccess: () => {
      toast.success('Category deleted');
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });
}
export function useUpdateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, name }: { id: string; name: string }) => {
      const res = await apiClient.put<ApiResponse<Category>>(`/admin/categories/${id}`, { name });
      return res.data.data;
    },
    onSuccess: () => {
      toast.success('Category updated');
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });
}