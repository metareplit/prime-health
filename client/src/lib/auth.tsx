import { createContext, useContext, useState } from 'react';
import { useLocation } from 'wouter';
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

interface AuthContextType {
  isAdmin: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [, navigate] = useLocation();
  const { toast } = useToast();

  const loginMutation = useMutation({
    mutationFn: async ({ username, password }: { username: string, password: string }) => {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Giriş başarısız');
      }

      const data = await response.json();
      return data;
    },
    onSuccess: (data) => {
      if (data.role === 'admin') {
        setIsAdmin(true);
        // Ensure state is updated before navigation
        Promise.resolve().then(() => {
          // Using root admin path for dashboard
          navigate('/admin');
          toast({
            title: "Giriş başarılı",
            description: "Hoş geldiniz!",
          });
        });
      } else {
        toast({
          title: "Erişim reddedildi",
          description: "Yönetici yetkiniz bulunmuyor.",
          variant: "destructive",
        });
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Giriş başarısız",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const login = async (username: string, password: string) => {
    await loginMutation.mutateAsync({ username, password });
  };

  const logoutMutation = useMutation({
    mutationFn: async () => {
      setIsAdmin(false);
      navigate('/admin/login');
    },
    onSuccess: () => {
      toast({
        title: "Çıkış başarılı",
        description: "Güle güle!",
      });
    },
  });

  const logout = () => {
    logoutMutation.mutate();
  };

  return (
    <AuthContext.Provider value={{
      isAdmin,
      login,
      logout
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