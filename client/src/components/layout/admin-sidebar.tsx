import { Link, useLocation } from "wouter";
import {
  LayoutDashboard,
  FileText,
  Package,
  Image,
  Settings,
  Users,
  LogOut,
  LineChart,
  Globe,
  Search,
  Calendar,
  MessageSquare,
  BellRing,
  Activity,
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
  const [location] = useLocation();
  const pathname = location || '';

  return (
    <div className="w-64 border-r min-h-screen p-6 space-y-6">
      <div className="flex items-center gap-2 px-2">
        <span className="text-lg font-semibold">Yönetim Paneli</span>
      </div>

      <nav className="space-y-1">
        {/* Ana Sayfa ve Analitikler */}
        <div className="mb-4">
          <div className="text-xs font-semibold text-muted-foreground mb-2 px-2">
            GENEL BAKIŞ
          </div>
          <SidebarItem
            icon={<LayoutDashboard className="h-4 w-4" />}
            label="Dashboard"
            href="/admin"
            active={pathname === "/admin"}
          />
          <SidebarItem
            icon={<LineChart className="h-4 w-4" />}
            label="Analitikler"
            href="/admin/analytics"
            active={pathname === "/admin/analytics"}
          />
          <SidebarItem
            icon={<Globe className="h-4 w-4" />}
            label="SEO Yönetimi"
            href="/admin/seo"
            active={pathname === "/admin/seo"}
          />
        </div>

        {/* İçerik Yönetimi */}
        <div className="mb-4">
          <div className="text-xs font-semibold text-muted-foreground mb-2 px-2">
            İÇERİK YÖNETİMİ
          </div>
          <SidebarItem
            icon={<FileText className="h-4 w-4" />}
            label="Blog Yazıları"
            href="/admin/posts"
            active={pathname.startsWith("/admin/posts")}
          />
          <SidebarItem
            icon={<Package className="h-4 w-4" />}
            label="Ürünler"
            href="/admin/products"
            active={pathname.startsWith("/admin/products")}
          />
          <SidebarItem
            icon={<Image className="h-4 w-4" />}
            label="Medya"
            href="/admin/media"
            active={pathname.startsWith("/admin/media")}
          />
        </div>

        {/* Kullanıcı ve Randevu Yönetimi */}
        <div className="mb-4">
          <div className="text-xs font-semibold text-muted-foreground mb-2 px-2">
            KULLANICI YÖNETİMİ
          </div>
          <SidebarItem
            icon={<Users className="h-4 w-4" />}
            label="Kullanıcılar"
            href="/admin/users"
            active={pathname.startsWith("/admin/users")}
          />
          <SidebarItem
            icon={<Calendar className="h-4 w-4" />}
            label="Randevular"
            href="/admin/appointments"
            active={pathname.startsWith("/admin/appointments")}
          />
          <SidebarItem
            icon={<MessageSquare className="h-4 w-4" />}
            label="Mesajlar"
            href="/admin/messages"
            active={pathname.startsWith("/admin/messages")}
          />
        </div>

        {/* Sistem */}
        <div className="mb-4">
          <div className="text-xs font-semibold text-muted-foreground mb-2 px-2">
            SİSTEM
          </div>
          <SidebarItem
            icon={<BellRing className="h-4 w-4" />}
            label="Bildirimler"
            href="/admin/notifications"
            active={pathname.startsWith("/admin/notifications")}
          />
          <SidebarItem
            icon={<Activity className="h-4 w-4" />}
            label="Sistem Durumu"
            href="/admin/system"
            active={pathname.startsWith("/admin/system")}
          />
          <SidebarItem
            icon={<Settings className="h-4 w-4" />}
            label="Ayarlar"
            href="/admin/settings"
            active={pathname.startsWith("/admin/settings")}
          />
        </div>
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