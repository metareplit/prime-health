import { createContext, useContext, useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "./queryClient";
import { useToast } from "@/hooks/use-toast";
import type { User } from '@shared/schema';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  loginMutation: ReturnType<typeof useLoginMutation>;
  logoutMutation: ReturnType<typeof useLogoutMutation>;
  registerMutation: ReturnType<typeof useRegisterMutation>;
}

const AuthContext = createContext<AuthContextType | null>(null);

function useLoginMutation() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ username, password }: { username: string; password: string }) => {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
        credentials: 'include' // Important for session cookies
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Giriş başarısız');
      }

      const user = await res.json();
      return user;
    },
    onSuccess: (user) => {
      queryClient.setQueryData(['/api/user/profile'], user);
      // Admin users should be redirected to admin dashboard
      if (user.role === 'admin') {
        setLocation('/admin');
      } else {
        setLocation('/');
      }
      toast({
        title: "Giriş başarılı",
        description: "Hoş geldiniz!",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Giriş başarısız",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

function useRegisterMutation() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (userData: Partial<User>) => {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
        credentials: 'include'
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Kayıt başarısız');
      }

      const user = await res.json();
      return user;
    },
    onSuccess: (user) => {
      queryClient.setQueryData(['/api/user/profile'], user);
      setLocation('/');
      toast({
        title: "Kayıt başarılı",
        description: "Hesabınız oluşturuldu!",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Kayıt başarısız",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

function useLogoutMutation() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async () => {
      const res = await fetch('/api/auth/logout', { 
        method: 'POST',
        credentials: 'include'
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Çıkış başarısız');
      }
    },
    onSuccess: () => {
      queryClient.setQueryData(['/api/user/profile'], null);
      setLocation('/');
      toast({
        title: "Çıkış başarılı",
        description: "Güle güle!",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Çıkış başarısız",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const { data: user, isLoading: queryLoading, error } = useQuery<User | null>({
    queryKey: ['/api/user/profile'],
    queryFn: async () => {
      try {
        const res = await fetch('/api/user/profile', {
          credentials: 'include'
        });
        if (!res.ok) {
          if (res.status !== 401) {
            const error = await res.json();
            toast({
              title: "Oturum hatası",
              description: error.message,
              variant: "destructive",
            });
          }
          return null;
        }
        return res.json();
      } catch (error) {
        console.error('Profile fetch error:', error);
        return null;
      }
    },
  });

  const loginMutation = useLoginMutation();
  const registerMutation = useRegisterMutation();
  const logoutMutation = useLogoutMutation();

  useEffect(() => {
    setIsLoading(queryLoading);
  }, [queryLoading]);

  return (
    <AuthContext.Provider value={{ 
      user: user ?? null,
      loading: isLoading,
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