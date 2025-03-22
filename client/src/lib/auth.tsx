import { createContext, useContext, useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "./queryClient";
import type { User } from '@shared/schema';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => Promise<void>;
  loginMutation: any;
  logoutMutation: any;
  registerMutation: any;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Check if user is already logged in
    fetch('/api/user/profile')
      .then(res => {
        if (res.ok) return res.json();
        throw new Error('Not authenticated');
      })
      .then(user => setUser(user))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const loginMutation = useMutation({
    mutationFn: async ({ username, password }: { username: string; password: string }) => {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message);
      }

      const user = await res.json();
      setUser(user);
      return user;
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (userData: any) => {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message);
      }

      const user = await res.json();
      setUser(user);
      return user;
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
      queryClient.clear();
      setLocation('/');
    },
  });

  const login = async (username: string, password: string) => {
    try {
      await loginMutation.mutateAsync({ username, password });
      setLocation('/');
    } catch (error) {
      throw error;
    }
  };

  const register = async (userData: any) => {
    try {
      await registerMutation.mutateAsync(userData);
      setLocation('/');
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await logoutMutation.mutateAsync();
    } catch (error) {
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      login, 
      register, 
      logout,
      loginMutation,
      registerMutation,
      logoutMutation
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}