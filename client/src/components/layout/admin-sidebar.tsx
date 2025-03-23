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
  Mail,
  Split,
  Images,
  Stethoscope, // Added for services icon
  Contact,
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
          "flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200",
          active
            ? "bg-primary/10 text-primary hover:bg-primary/15"
            : "text-muted-foreground hover:bg-muted hover:text-foreground"
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
    <div className="fixed inset-y-0 left-0 w-64 bg-card border-r border-border">
      <div className="flex flex-col h-full">
        <div className="flex items-center gap-2 p-6 border-b border-border">
          <span className="text-xl font-semibold tracking-tight">Admin Panel</span>
        </div>

        <nav className="flex-1 p-4 space-y-6 overflow-y-auto">
          <div>
            <div className="mb-3 px-4 text-xs font-semibold tracking-wider text-muted-foreground/70 uppercase">
              Genel Bakış
            </div>
            <div className="space-y-1">
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
          </div>

          <div>
            <div className="mb-3 px-4 text-xs font-semibold tracking-wider text-muted-foreground/70 uppercase">
              İçerik Yönetimi
            </div>
            <div className="space-y-1">
              <SidebarItem
                icon={<Stethoscope className="h-4 w-4" />}
                label="Hizmetler"
                href="/admin/services"
                active={pathname.startsWith("/admin/services")}
              />
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
                icon={<Split className="h-4 w-4" />}
                label="Öncesi ve Sonrası"
                href="/admin/before-after"
                active={pathname.startsWith("/admin/before-after")}
              />
              <SidebarItem
                icon={<Images className="h-4 w-4" />}
                label="Sliderlar"
                href="/admin/sliders"
                active={pathname.startsWith("/admin/sliders")}
              />
              <SidebarItem
                icon={<Image className="h-4 w-4" />}
                label="Medya"
                href="/admin/media"
                active={pathname.startsWith("/admin/media")}
              />
            </div>
          </div>

          <div>
            <div className="mb-3 px-4 text-xs font-semibold tracking-wider text-muted-foreground/70 uppercase">
              Kullanıcı Yönetimi
            </div>
            <div className="space-y-1">
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
          </div>

          <div>
            <div className="mb-3 px-4 text-xs font-semibold tracking-wider text-muted-foreground/70 uppercase">
              Sistem
            </div>
            <div className="space-y-1">
              <SidebarItem
                icon={<BellRing className="h-4 w-4" />}
                label="Bildirimler"
                href="/admin/notifications"
                active={pathname.startsWith("/admin/notifications")}
              />
              <SidebarItem
                icon={<Mail className="h-4 w-4" />}
                label="Email Şablonları"
                href="/admin/email-templates"
                active={pathname.startsWith("/admin/email-templates")}
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
              <SidebarItem
                icon={<Contact className="h-4 w-4" />}
                label="İletişim Bilgileri"
                href="/admin/contact"
                active={pathname.startsWith("/admin/contact")}
              />
            </div>
          </div>
        </nav>

        <div className="p-4 border-t border-border">
          <button
            onClick={() => logoutMutation.mutate()}
            className="flex w-full items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-500 rounded-lg transition-colors hover:bg-red-500/10"
          >
            <LogOut className="h-4 w-4" />
            Çıkış Yap
          </button>
        </div>
      </div>
    </div>
  );
}