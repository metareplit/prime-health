import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Lock, User } from "lucide-react";

export default function AdminLogin() {
  const { loginMutation } = useAuth();
  const [, setLocation] = useLocation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const user = await loginMutation.mutateAsync({ username, password });
      console.log("Login response:", user); // Debug için

      if (user && user.role === "admin") {
        setLocation("/admin"); // AdminDashboard'a yönlendir
      } else {
        console.log("User is not admin:", user); // Debug için
        setLocation("/"); // Admin değilse ana sayfaya yönlendir
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-white">
      <div className="w-full max-w-md px-4">
        <div className="text-center mb-8">
          <div className="inline-block p-2 bg-primary/10 rounded-xl mb-4">
            <Lock className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Prime Health Admin</h1>
          <p className="text-sm text-gray-600 mt-2">
            Yönetim paneline erişmek için giriş yapın
          </p>
        </div>

        <Card className="p-6 shadow-lg border-0">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pl-10"
                  placeholder="Kullanıcı adı"
                  required
                  autoComplete="username"
                  autoFocus
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  placeholder="Şifre"
                  required
                  autoComplete="current-password"
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90"
              size="lg"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Giriş yapılıyor...
                </>
              ) : (
                "Giriş Yap"
              )}
            </Button>

            {loginMutation.isError && (
              <Alert variant="destructive" className="mt-4">
                <AlertDescription>
                  Kullanıcı adı veya şifre hatalı. Lütfen bilgilerinizi kontrol edip tekrar deneyin.
                </AlertDescription>
              </Alert>
            )}
          </form>
        </Card>

        <p className="text-center text-sm text-gray-600 mt-4">
          © {new Date().getFullYear()} Prime Health. Tüm hakları saklıdır.
        </p>
      </div>
    </div>
  );
}