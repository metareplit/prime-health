import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { useTranslation } from "react-i18next";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, User, LogOut, Settings } from "lucide-react";

interface HeaderProps {
  children?: React.ReactNode;
}

export default function Header({ children }: HeaderProps) {
  const { user, logoutMutation } = useAuth();
  const { t } = useTranslation('common');

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/">
              <a className="flex items-center space-x-2">
                <span className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  Prime Health
                </span>
              </a>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/">
                <a className="text-sm font-medium transition-colors hover:text-primary">
                  {t('nav.home')}
                </a>
              </Link>
              <Link href="/hizmetler">
                <a className="text-sm font-medium transition-colors hover:text-primary">
                  {t('nav.services')}
                </a>
              </Link>
              <Link href="/galeri">
                <a className="text-sm font-medium transition-colors hover:text-primary">
                  {t('nav.gallery')}
                </a>
              </Link>
              <Link href="/urunler">
                <a className="text-sm font-medium transition-colors hover:text-primary">
                  {t('nav.products')}
                </a>
              </Link>
              <Link href="/blog">
                <a className="text-sm font-medium transition-colors hover:text-primary">
                  {t('nav.blog')}
                </a>
              </Link>
              <Link href="/iletisim">
                <a className="text-sm font-medium transition-colors hover:text-primary">
                  {t('nav.contact')}
                </a>
              </Link>
            </nav>
          </div>

          {/* Right Side: Auth, Language & Actions */}
          <div className="flex items-center gap-2">
            <div className="relative flex items-center mr-4">
              {children} {/* Language Switcher */}
            </div>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                    <User className="h-5 w-5" />
                    <span className="sr-only">{t('nav.userMenu')}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      {user.firstName && user.lastName && (
                        <p className="font-medium">{`${user.firstName} ${user.lastName}`}</p>
                      )}
                      <p className="w-[200px] truncate text-sm text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/hasta-portali">
                      <a className="flex w-full items-center">
                        <Settings className="mr-2 h-4 w-4" />
                        {t('nav.patientPortal')}
                      </a>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-red-600 focus:bg-red-50 focus:text-red-600"
                    onClick={() => logoutMutation.mutate()}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    {t('auth.logout')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link href="/auth/login">
                  <Button variant="ghost">{t('auth.login')}</Button>
                </Link>
                <Link href="/auth/register">
                  <Button variant="secondary">{t('auth.register')}</Button>
                </Link>
              </div>
            )}

            <Link href="/randevu">
              <Button className="hidden md:inline-flex">
                {t('nav.appointments')}
              </Button>
            </Link>

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" className="md:hidden h-9 w-9 p-0">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">{t('nav.menu')}</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <div className="grid gap-6 py-6">
                  <Link href="/">
                    <a className="text-sm font-medium">{t('nav.home')}</a>
                  </Link>
                  <Link href="/hizmetler">
                    <a className="text-sm font-medium">{t('nav.services')}</a>
                  </Link>
                  <Link href="/galeri">
                    <a className="text-sm font-medium">{t('nav.gallery')}</a>
                  </Link>
                  <Link href="/urunler">
                    <a className="text-sm font-medium">{t('nav.products')}</a>
                  </Link>
                  <Link href="/blog">
                    <a className="text-sm font-medium">{t('nav.blog')}</a>
                  </Link>
                  <Link href="/iletisim">
                    <a className="text-sm font-medium">{t('nav.contact')}</a>
                  </Link>
                  {!user && (
                    <>
                      <Link href="/auth/login">
                        <Button variant="ghost" className="w-full justify-start">
                          {t('auth.login')}
                        </Button>
                      </Link>
                      <Link href="/auth/register">
                        <Button variant="secondary" className="w-full justify-start">
                          {t('auth.register')}
                        </Button>
                      </Link>
                    </>
                  )}
                  <Link href="/randevu">
                    <Button className="w-full">{t('nav.appointments')}</Button>
                  </Link>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}