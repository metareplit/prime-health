import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, LogOut, Settings, Shield } from "lucide-react";

export default function Header() {
  const { user, logoutMutation } = useAuth();

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/">
          <a className="text-2xl font-bold text-primary">Saç Ekimi Kliniği</a>
        </Link>

        <nav className="flex items-center gap-6">
          <Link href="/">
            <a className="text-sm font-medium text-foreground/60 transition-colors hover:text-foreground">
              Anasayfa
            </a>
          </Link>
          <Link href="/hizmetler">
            <a className="text-sm font-medium text-foreground/60 transition-colors hover:text-foreground">
              Hizmetlerimiz
            </a>
          </Link>
          <Link href="/galeri">
            <a className="text-sm font-medium text-foreground/60 transition-colors hover:text-foreground">
              Hasta Sonuçları
            </a>
          </Link>
          <Link href="/urunler">
            <a className="text-sm font-medium text-foreground/60 transition-colors hover:text-foreground">
              Bakım Ürünleri
            </a>
          </Link>
          <Link href="/blog">
            <a className="text-sm font-medium text-foreground/60 transition-colors hover:text-foreground">
              Blog
            </a>
          </Link>
          <Link href="/iletisim">
            <a className="text-sm font-medium text-foreground/60 transition-colors hover:text-foreground">
              İletişim
            </a>
          </Link>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative">
                  <User className="h-5 w-5" />
                  <span className="sr-only">Kullanıcı menüsü</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    {user.fullName && (
                      <p className="font-medium">{user.fullName}</p>
                    )}
                    <p className="w-[200px] truncate text-sm text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/hasta-portali/profil">
                    <a className="flex w-full items-center">
                      <Settings className="mr-2 h-4 w-4" />
                      Profil Ayarları
                    </a>
                  </Link>
                </DropdownMenuItem>
                {user.role === "admin" && (
                  <DropdownMenuItem asChild>
                    <Link href="/admin">
                      <a className="flex w-full items-center">
                        <Shield className="mr-2 h-4 w-4" />
                        Yönetim Paneli
                      </a>
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-red-600 focus:bg-red-50 focus:text-red-600"
                  onClick={() => logoutMutation.mutate()}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Çıkış Yap
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/auth/login">
                <Button variant="ghost">Giriş Yap</Button>
              </Link>
              <Link href="/auth/register">
                <Button>Kayıt Ol</Button>
              </Link>
            </div>
          )}

          <Link href="/randevu">
            <Button variant="default">
              Ücretsiz Danışma
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  );
}