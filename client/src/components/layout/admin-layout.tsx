import { Sidebar } from "./admin-sidebar";
import { Calendar, FileText, LogOut } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";

interface AdminLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export function AdminLayout({ children, title = "Dashboard" }: AdminLayoutProps) {
  const { logout, user, loading } = useAuth();
  const [location] = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Redirect if not authenticated or not admin
  if (!user || user.role !== "admin") {
    return <Redirect to="/admin/login" />;
  }

  const menuItems = [
    {
      title: "Dashboard",
      href: "/admin",
      icon: <FileText className="h-4 w-4" />,
    },
    {
      title: "Randevular",
      href: "/admin/appointments",
      icon: <Calendar className="h-4 w-4" />,
    },
    {
      title: "Blog Yazıları",
      href: "/admin/posts",
      icon: <FileText className="h-4 w-4" />,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 z-40 h-screen w-64 border-r bg-background">
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="border-b p-6">
            <h1 className="text-xl font-bold">Prime Health Admin</h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 p-4">
            {menuItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <a
                  className={`flex items-center rounded-lg px-4 py-2 text-sm ${
                    location === item.href
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted"
                  }`}
                >
                  {item.icon}
                  <span className="ml-3">{item.title}</span>
                </a>
              </Link>
            ))}
          </nav>

          {/* Logout Button */}
          <div className="border-t p-4">
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={logout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Çıkış Yap
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pl-64">
        <header className="border-b bg-background p-4">
          <h1 className="text-2xl font-bold">{title}</h1>
        </header>
        <main className="p-8">{children}</main>
      </div>
    </div>
  );
}