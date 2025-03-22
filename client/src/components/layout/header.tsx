import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function Header() {
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