'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { apiClient, getApiErrorMessage } from '../lib/api-client';
import { decodeJwtPayload } from '../lib/jwt';
import { useAuthStore } from '../store/auth-store';
import type { ApiResponse, User, UserRole } from '../types';

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

interface TokenResponse {
  token: string;
}

interface JwtPayload {
  id: string;
  email: string;
  role: UserRole;
  isBanned: boolean;
}

function userFromToken(token: string, fallbackName = ''): User | null {
  const payload = decodeJwtPayload<JwtPayload>(token);
  if (!payload) return null;
  return {
    id: payload.id,
    email: payload.email,
    role: payload.role,
    isBanned: payload.isBanned,
    name: fallbackName,
  };
}

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
      // Prefer /auth/me for full profile (name, etc). Fall back to token if it fails.
      try {
        const res = await apiClient.get<ApiResponse<User>>('/auth/me');
        setUser(res.data.data);
        return res.data.data;
      } catch {
        const fallback = userFromToken(token);
        setUser(fallback);
        return fallback;
      }
    },
  });
}

export function useLogin() {
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: LoginPayload) => {
      const res = await apiClient.post<ApiResponse<TokenResponse>>('/auth/login', payload);
      return res.data.data;
    },
    onSuccess: (data) => {
      Cookies.set('accessToken', data.token, { expires: 7 });

      const user = userFromToken(data.token);
      if (!user) {
        toast.error('Logged in, but could not read your account info.');
        return;
      }

      setUser(user);
      queryClient.invalidateQueries({ queryKey: ['me'] });
      toast.success('Logged in successfully');

      const destination =
        user.role === 'ADMIN'
          ? '/dashboard/admin'
          : user.role === 'LANDLORD'
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
      const res = await apiClient.post<ApiResponse<TokenResponse>>('/auth/register', payload);
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