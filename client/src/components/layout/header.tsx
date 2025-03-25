import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { useTranslation } from "react-i18next";

interface HeaderProps {
  children?: React.ReactNode;
}

export default function Header({ children }: HeaderProps) {
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

          {/* Right Side: Language & Actions */}
          <div className="flex items-center gap-2 md:gap-4">
            <div className="relative flex items-center mr-2 md:mr-4">
              {children} {/* Language Switcher */}
            </div>

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
                  <div className="p-6 border-t">
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