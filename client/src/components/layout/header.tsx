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
          <div className="flex items-center gap-4 md:gap-8">
            <Link href="/">
              <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent cursor-pointer">
                {t('nav.brand')}
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-4 md:gap-6">
              <Link href="/">
                <span className="text-sm font-medium transition-colors hover:text-primary cursor-pointer">
                  {t('nav.home')}
                </span>
              </Link>
              <Link href="/hizmetler">
                <span className="text-sm font-medium transition-colors hover:text-primary cursor-pointer">
                  {t('nav.services')}
                </span>
              </Link>
              <Link href="/galeri">
                <span className="text-sm font-medium transition-colors hover:text-primary cursor-pointer">
                  {t('nav.gallery')}
                </span>
              </Link>
              <Link href="/urunler">
                <span className="text-sm font-medium transition-colors hover:text-primary cursor-pointer">
                  {t('nav.products')}
                </span>
              </Link>
              <Link href="/blog">
                <span className="text-sm font-medium transition-colors hover:text-primary cursor-pointer">
                  {t('nav.blog')}
                </span>
              </Link>
              <Link href="/iletisim">
                <span className="text-sm font-medium transition-colors hover:text-primary cursor-pointer">
                  {t('nav.contact')}
                </span>
              </Link>
            </nav>
          </div>

          {/* Right Side: Auth, Language & Actions */}
          <div className="flex items-center gap-2 md:gap-4">
            <div className="relative flex items-center mr-2 md:mr-4">
              {children} {/* Language Switcher */}
            </div>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 md:h-9 md:w-9 rounded-full">
                    <User className="h-4 w-4 md:h-5 md:w-5" />
                    <span className="sr-only">{t('header.menu.user')}</span>
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
                  <DropdownMenuItem>
                    <Link href="/hasta-portali">
                      <span className="flex w-full items-center cursor-pointer">
                        <Settings className="mr-2 h-4 w-4" />
                        {t('nav.patientPortal')}
                      </span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-red-600 focus:bg-red-50 focus:text-red-600 cursor-pointer"
                    onClick={() => logoutMutation.mutate()}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    {t('header.userMenu.logout')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden md:flex items-center space-x-3">
                <Link href="/auth/login">
                  <Button variant="ghost" size="sm" className="px-4">
                    {t('auth.login')}
                  </Button>
                </Link>
                <Link href="/auth/register">
                  <Button variant="outline" size="sm" className="px-4">
                    {t('auth.register')}
                  </Button>
                </Link>
              </div>
            )}

            <Link href="/randevu">
              <Button variant="default" size="sm" className="hidden md:inline-flex px-4">
                {t('header.buttons.appointment')}
              </Button>
            </Link>

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" className="md:hidden h-9 w-9 p-0">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">{t('header.menu.open')}</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[85vw] sm:w-[350px] p-0">
                <div className="flex flex-col h-full">
                  <div className="p-6 border-b">
                    <span className="text-lg font-semibold">
                      {t('nav.brand')}
                    </span>
                  </div>
                  <nav className="flex-1 overflow-y-auto">
                    <div className="grid gap-4 p-6">
                      <Link href="/">
                        <span className="block text-sm font-medium cursor-pointer hover:text-primary">{t('nav.home')}</span>
                      </Link>
                      <Link href="/hizmetler">
                        <span className="block text-sm font-medium cursor-pointer hover:text-primary">{t('nav.services')}</span>
                      </Link>
                      <Link href="/galeri">
                        <span className="block text-sm font-medium cursor-pointer hover:text-primary">{t('nav.gallery')}</span>
                      </Link>
                      <Link href="/urunler">
                        <span className="block text-sm font-medium cursor-pointer hover:text-primary">{t('nav.products')}</span>
                      </Link>
                      <Link href="/blog">
                        <span className="block text-sm font-medium cursor-pointer hover:text-primary">{t('nav.blog')}</span>
                      </Link>
                      <Link href="/iletisim">
                        <span className="block text-sm font-medium cursor-pointer hover:text-primary">{t('nav.contact')}</span>
                      </Link>
                    </div>
                  </nav>
                  <div className="p-6 border-t space-y-4">
                    {!user && (
                      <>
                        <Link href="/auth/login">
                          <Button variant="ghost" className="w-full justify-start">
                            {t('auth.login')}
                          </Button>
                        </Link>
                        <Link href="/auth/register">
                          <Button variant="outline" className="w-full justify-start">
                            {t('auth.register')}
                          </Button>
                        </Link>
                      </>
                    )}
                    <Link href="/randevu">
                      <Button variant="default" className="w-full">
                        {t('header.buttons.appointment')}
                      </Button>
                    </Link>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}