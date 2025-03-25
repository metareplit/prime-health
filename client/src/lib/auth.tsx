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

async function handleResponse(response: Response) {
  const contentType = response.headers.get("content-type");
  if (!contentType || !contentType.includes("application/json")) {
    // If response is not JSON, log the response for debugging
    const text = await response.text();
    console.error('Invalid response type:', contentType, 'Response:', text.substring(0, 200));
    throw new Error("Sunucu yanıtı geçersiz. Lütfen daha sonra tekrar deneyin.");
  }
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'İşlem başarısız');
  }
  return data;
}

function useLoginMutation() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ username, password }: { username: string; password: string }) => {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
        credentials: 'include'
      });
      return handleResponse(response);
    },
    onSuccess: (user) => {
      queryClient.setQueryData(['/api/user/profile'], user);
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
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
        credentials: 'include'
      });
      return handleResponse(response);
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
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });
      return handleResponse(response);
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
        const response = await fetch('/api/user/profile', {
          credentials: 'include'
        });
        if (response.status === 401) {
          return null;
        }
        return handleResponse(response);
      } catch (error) {
        console.error('Profile fetch error:', error);
        if (error instanceof Error) {
          toast({
            title: "Oturum hatası",
            description: error.message,
            variant: "destructive",
          });
        }
        return null;
      }
    },
  });

  useEffect(() => {
    setIsLoading(queryLoading);
  }, [queryLoading]);

  return (
    <AuthContext.Provider value={{
      user: user ?? null,
      loading: isLoading,
      loginMutation: useLoginMutation(),
      registerMutation: useRegisterMutation(),
      logoutMutation: useLogoutMutation()
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