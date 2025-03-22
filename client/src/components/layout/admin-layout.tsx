import { Sidebar } from "./admin-sidebar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { Redirect } from "wouter";
import { Loader2, LogOut } from "lucide-react";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const { user, loading, logoutMutation } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Kullanıcı giriş yapmamışsa veya admin değilse yönlendir
  if (!user || user.role !== "admin") {
    return <Redirect to="/admin/login" />;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <Sidebar />
        <div className="flex-1">
          <header className="border-b">
            <div className="flex h-16 items-center px-8 gap-8">
              <div className="ml-auto flex items-center gap-4">
                <span className="text-sm text-muted-foreground">
                  {user.name || user.username}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => logoutMutation.mutate()}
                >
                  <LogOut className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </header>
          <main className="p-8">{children}</main>
        </div>
      </div>
    </div>
  );
}