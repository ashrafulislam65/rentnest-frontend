'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';



import { apiClient, getApiErrorMessage } from '../lib/api-client';
import { useAuthStore } from '../store/auth-store';
import { ApiResponse, User, UserRole } from '../types';

interface LoginPayload {
  email: string;
  password: string;
}

interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

interface AuthResponseData {
  accessToken: string;
  user: User;
}

// Call this once near the app root to hydrate auth state from the token.
export function useCurrentUser() {
  const setUser = useAuthStore((s) => s.setUser);

  return useQuery({
    queryKey: ['me'],
    queryFn: async () => {
      const token = Cookies.get('accessToken');
      if (!token) {
        setUser(null);
        return null;
      }
      const res = await apiClient.get<ApiResponse<User>>('/auth/me');
      setUser(res.data.data);
      return res.data.data;
    },
  });
}

export function useLogin() {
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: LoginPayload) => {
      const res = await apiClient.post<ApiResponse<AuthResponseData>>('/auth/login', payload);
      return res.data.data;
    },
    onSuccess: (data) => {
      Cookies.set('accessToken', data.accessToken, { expires: 7 });
      setUser(data.user);
      queryClient.invalidateQueries({ queryKey: ['me'] });
      toast.success('Logged in successfully');

      const destination =
        data.user.role === 'ADMIN'
          ? '/dashboard/admin'
          : data.user.role === 'LANDLORD'
          ? '/dashboard/landlord'
          : '/dashboard/tenant';
      router.push(destination);
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    },
  });
}

export function useRegister() {
  const router = useRouter();

  return useMutation({
    mutationFn: async (payload: RegisterPayload) => {
      const res = await apiClient.post<ApiResponse<AuthResponseData>>('/auth/register', payload);
      return res.data.data;
    },
    onSuccess: () => {
      toast.success('Account created. Please log in.');
      router.push('/login');
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    },
  });
}