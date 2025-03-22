import { Link, useLocation } from "wouter";
import {
  LayoutDashboard,
  FileText,
  Package,
  Image,
  Settings,
  Users,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  active?: boolean;
}

function SidebarItem({ icon, label, href, active }: SidebarItemProps) {
  return (
    <Link href={href}>
      <a
        className={cn(
          "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
          active
            ? "bg-primary text-primary-foreground"
            : "hover:bg-accent hover:text-accent-foreground"
        )}
      >
        {icon}
        {label}
      </a>
    </Link>
  );
}

export function Sidebar() {
  const { logoutMutation } = useAuth();
  const [, location] = useLocation();

  return (
    <div className="w-64 border-r min-h-screen p-6 space-y-6">
      <div className="flex items-center gap-2 px-2">
        <span className="text-lg font-semibold">Yönetim Paneli</span>
      </div>

      <nav className="space-y-2">
        <SidebarItem
          icon={<LayoutDashboard className="h-4 w-4" />}
          label="Dashboard"
          href="/admin"
          active={location === "/admin"}
        />
        <SidebarItem
          icon={<FileText className="h-4 w-4" />}
          label="Blog Yazıları"
          href="/admin/posts"
          active={location.startsWith("/admin/posts")}
        />
        <SidebarItem
          icon={<Package className="h-4 w-4" />}
          label="Ürünler"
          href="/admin/products"
          active={location.startsWith("/admin/products")}
        />
        <SidebarItem
          icon={<Image className="h-4 w-4" />}
          label="Medya"
          href="/admin/media"
          active={location.startsWith("/admin/media")}
        />
        <SidebarItem
          icon={<Users className="h-4 w-4" />}
          label="Kullanıcılar"
          href="/admin/users"
          active={location.startsWith("/admin/users")}
        />
        <SidebarItem
          icon={<Settings className="h-4 w-4" />}
          label="Ayarlar"
          href="/admin/settings"
          active={location.startsWith("/admin/settings")}
        />
      </nav>

      <div className="absolute bottom-6 w-52">
        <button
          onClick={() => logoutMutation.mutate()}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-red-500 transition-colors hover:bg-red-50"
        >
          <LogOut className="h-4 w-4" />
          Çıkış Yap
        </button>
      </div>
    </div>
  );
}