import { create } from 'zustand';
import Cookies from 'js-cookie';
import { User } from '../types';


interface AuthState {
  user: User | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  setUser: (user) => set({ user, isLoading: false }),
  logout: () => {
    Cookies.remove('accessToken');
    set({ user: null, isLoading: false });
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  },
}));