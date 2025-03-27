import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "./language-switcher";
import { useRef, ReactNode } from "react";

// Language-aware link component
function LanguageLink({ href, children, onClick }: { href: string, children: ReactNode, onClick?: () => void }) {
  const { i18n } = useTranslation();
  const [, navigate] = useLocation();
  
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const lang = i18n.language || 'tr';
    
    // Don't add language prefix to admin routes
    if (href.startsWith('/admin')) {
      navigate(href);
    } else {
      navigate(`/${lang}${href}`);
    }
    
    if (onClick) onClick();
  };
  
  return (
    <a href={href} onClick={handleClick} className="cursor-pointer">
      {children}
    </a>
  );
}

interface HeaderProps {
  children?: React.ReactNode;
}

export default function Header({ children }: HeaderProps) {
  const { t } = useTranslation('common');
  const sheetTriggerRef = useRef<HTMLButtonElement>(null);

  const handleNavigate = () => {
    sheetTriggerRef.current?.click();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-4 md:gap-8">
            <LanguageLink href="/">
              <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent cursor-pointer">
                {t('nav.brand')}
              </span>
            </LanguageLink>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-4 md:gap-6">
              <LanguageLink href="/">
                <span className="text-sm font-medium transition-colors hover:text-primary cursor-pointer">
                  {t('nav.home')}
                </span>
              </LanguageLink>
              <LanguageLink href="/hizmetler">
                <span className="text-sm font-medium transition-colors hover:text-primary cursor-pointer">
                  {t('nav.services')}
                </span>
              </LanguageLink>
              <LanguageLink href="/galeri">
                <span className="text-sm font-medium transition-colors hover:text-primary cursor-pointer">
                  {t('nav.gallery')}
                </span>
              </LanguageLink>
              <LanguageLink href="/urunler">
                <span className="text-sm font-medium transition-colors hover:text-primary cursor-pointer">
                  {t('nav.products')}
                </span>
              </LanguageLink>
              <LanguageLink href="/blog">
                <span className="text-sm font-medium transition-colors hover:text-primary cursor-pointer">
                  {t('nav.blog')}
                </span>
              </LanguageLink>
              <LanguageLink href="/iletisim">
                <span className="text-sm font-medium transition-colors hover:text-primary cursor-pointer">
                  {t('nav.contact')}
                </span>
              </LanguageLink>
            </nav>
          </div>

          {/* Right Side: Language & Actions */}
          <div className="flex items-center gap-2 md:gap-4">
            <LanguageSwitcher />

            <LanguageLink href="/randevu">
              <Button variant="default" size="sm" className="hidden md:inline-flex px-4">
                {t('header.buttons.appointment')}
              </Button>
            </LanguageLink>

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" className="md:hidden h-9 w-9 p-0" ref={sheetTriggerRef}>
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
                      <LanguageLink href="/" onClick={handleNavigate}>
                        <span className="block text-sm font-medium cursor-pointer hover:text-primary">{t('nav.home')}</span>
                      </LanguageLink>
                      <LanguageLink href="/hizmetler" onClick={handleNavigate}>
                        <span className="block text-sm font-medium cursor-pointer hover:text-primary">{t('nav.services')}</span>
                      </LanguageLink>
                      <LanguageLink href="/galeri" onClick={handleNavigate}>
                        <span className="block text-sm font-medium cursor-pointer hover:text-primary">{t('nav.gallery')}</span>
                      </LanguageLink>
                      <LanguageLink href="/urunler" onClick={handleNavigate}>
                        <span className="block text-sm font-medium cursor-pointer hover:text-primary">{t('nav.products')}</span>
                      </LanguageLink>
                      <LanguageLink href="/blog" onClick={handleNavigate}>
                        <span className="block text-sm font-medium cursor-pointer hover:text-primary">{t('nav.blog')}</span>
                      </LanguageLink>
                      <LanguageLink href="/iletisim" onClick={handleNavigate}>
                        <span className="block text-sm font-medium cursor-pointer hover:text-primary">{t('nav.contact')}</span>
                      </LanguageLink>
                    </div>
                  </nav>
                  <div className="p-6 border-t">
                    <LanguageLink href="/randevu" onClick={handleNavigate}>
                      <Button variant="default" className="w-full">
                        {t('header.buttons.appointment')}
                      </Button>
                    </LanguageLink>
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