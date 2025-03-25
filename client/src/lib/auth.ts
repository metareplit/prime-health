import { createContext, ReactNode, useContext } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { User } from "@shared/schema";
import { apiRequest, queryClient } from "./queryClient";
import { useToast } from "@/hooks/use-toast";

type LoginCredentials = {
  username: string;
  password: string;
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
  loginMutation: ReturnType<typeof useLoginMutation>;
  logoutMutation: ReturnType<typeof useLogoutMutation>;
};

const AuthContext = createContext<AuthContextType | null>(null);

function useLoginMutation() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const response = await apiRequest("POST", "/api/auth/login", credentials);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Giriş başarısız");
      }
      return response.json();
    },
    onSuccess: (user: User) => {
      // Sadece admin rolünü kabul et
      if (user.role !== "admin") {
        throw new Error("Bu panel sadece yöneticiler içindir");
      }
      queryClient.setQueryData(["/api/auth/user"], user);
      toast({
        title: "Giriş başarılı",
        description: "Yönlendiriliyorsunuz...",
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Giriş başarısız",
        description: error.message,
      });
    },
  });
}

function useLogoutMutation() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/auth/logout");
      if (!response.ok) {
        throw new Error("Çıkış yapılamadı");
      }
      queryClient.setQueryData(["/api/auth/user"], null);
    },
    onSuccess: () => {
      toast({
        title: "Çıkış başarılı",
        description: "Güvenli bir şekilde çıkış yaptınız",
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Çıkış başarısız",
        description: error.message,
      });
    },
  });
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const {
    data: user,
    error,
    isLoading,
  } = useQuery<User>({
    queryKey: ["/api/auth/user"],
    retry: false,
  });

  const loginMutation = useLoginMutation();
  const logoutMutation = useLogoutMutation();

  const contextValue: AuthContextType = {
    user: user || null,
    isLoading,
    error: error || null,
    loginMutation,
    logoutMutation,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth hook AuthProvider içinde kullanılmalıdır");
  }
  return context;
}