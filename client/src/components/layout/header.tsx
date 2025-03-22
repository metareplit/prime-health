import { Link } from "wouter";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";

export default function Header() {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/">
          <a className="text-2xl font-bold text-primary">Saç Ekimi Kliniği</a>
        </Link>

        <NavigationMenu>
          <NavigationMenuList className="space-x-2">
            <NavigationMenuItem>
              <Link href="/">
                <a className="px-4 py-2 rounded-md hover:bg-accent hover:text-accent-foreground">
                  Anasayfa
                </a>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/hizmetler">
                <a className="px-4 py-2 rounded-md hover:bg-accent hover:text-accent-foreground">
                  Hizmetlerimiz
                </a>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/galeri">
                <a className="px-4 py-2 rounded-md hover:bg-accent hover:text-accent-foreground">
                  Hasta Sonuçları
                </a>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/urunler">
                <a className="px-4 py-2 rounded-md hover:bg-accent hover:text-accent-foreground">
                  Bakım Ürünleri
                </a>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/iletisim">
                <a className="px-4 py-2 rounded-md hover:bg-accent hover:text-accent-foreground">
                  İletişim
                </a>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/randevu">
                <Button variant="default">
                  Ücretsiz Danışma
                </Button>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </header>
  );
}