import { Sidebar } from "./admin-sidebar";
import { AdminHeader } from "./admin-header";
import { useAuth } from "@/lib/auth";
import { Redirect } from "wouter";
import { Loader2 } from "lucide-react";

interface AdminLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export function AdminLayout({ children, title = "Dashboard" }: AdminLayoutProps) {
  const { user, loading } = useAuth();

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
      <Sidebar />
      <div className="pl-64">
        <AdminHeader title={title} />
        <main className="p-8 max-w-7xl mx-auto">{children}</main>
      </div>
    </div>
  );
}