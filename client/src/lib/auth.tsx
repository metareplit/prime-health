import { createContext, useContext, useState } from 'react';
import { useLocation } from 'wouter';
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

interface AuthContextType {
  isAdmin: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
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
  });

  const login = async (username: string, password: string) => {
    const result = await loginMutation.mutateAsync({ username, password });

    if (result.role === 'admin') {
      setIsAdmin(true);
      navigate('/admin');
      toast({
        title: "Giriş başarılı",
        description: "Hoş geldiniz!",
      });
    } else {
      toast({
        title: "Erişim reddedildi",
        description: "Yönetici yetkiniz bulunmuyor.",
        variant: "destructive",
      });
    }
  };

  const logout = () => {
    setIsAdmin(false);
    navigate('/admin/login');
    toast({
      title: "Çıkış başarılı",
      description: "Güle güle!",
    });
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