import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
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
import { Menu, User, LogOut, Settings, Shield } from "lucide-react";

export default function Header() {
  const { user, logoutMutation } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/">
              <a className="flex items-center space-x-2">
                <span className="text-2xl font-bold bg-gradient 
                  bg-gradient-to-r from-primary to-primary/60 
                  bg-clip-text text-transparent">
                  Prime Health
                </span>
              </a>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex">
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger>Hizmetlerimiz</NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px]">
                        <li className="row-span-3">
                          <Link href="/hizmetler/sac-ekimi">
                            <NavigationMenuLink className="flex h-full w-full select-none 
                              flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md">
                              <div className="mb-2 text-lg font-medium">
                                Saç Ekimi
                              </div>
                              <p className="text-sm leading-tight text-muted-foreground">
                                Modern tekniklerle doğal ve kalıcı saç ekimi çözümleri
                              </p>
                            </NavigationMenuLink>
                          </Link>
                        </li>
                        <li>
                          <Link href="/hizmetler/sakal-ekimi">
                            <a className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                              <div className="text-sm font-medium leading-none">Sakal Ekimi</div>
                              <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                Yüz hatlarınıza uygun doğal sakal görünümü
                              </p>
                            </a>
                          </Link>
                        </li>
                        <li>
                          <Link href="/hizmetler/kas-ekimi">
                            <a className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                              <div className="text-sm font-medium leading-none">Kaş Ekimi</div>
                              <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                Yüz ifadenizi tamamlayan kaş tasarımı
                              </p>
                            </a>
                          </Link>
                        </li>
                        <li>
                          <Link href="/hizmetler/pip-ekimi">
                            <a className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                              <div className="text-sm font-medium leading-none">PRP Tedavisi</div>
                              <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                Saç dökülmesine karşı etkili PRP tedavisi
                              </p>
                            </a>
                          </Link>
                        </li>
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <Link href="/galeri">
                      <NavigationMenuLink className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50">
                        Hasta Sonuçları
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger>Ürünler</NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px]">
                        <li className="row-span-3">
                          <Link href="/urunler/sac-bakim">
                            <NavigationMenuLink className="flex h-full w-full select-none 
                              flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md">
                              <div className="mb-2 text-lg font-medium">
                                Saç Bakım Ürünleri
                              </div>
                              <p className="text-sm leading-tight text-muted-foreground">
                                Saç sağlığınız için özel olarak seçilmiş bakım ürünleri
                              </p>
                            </NavigationMenuLink>
                          </Link>
                        </li>
                        <li>
                          <Link href="/urunler/sampuanlar">
                            <a className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                              <div className="text-sm font-medium leading-none">Şampuanlar</div>
                              <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                Saç tipinize uygun özel şampuanlar
                              </p>
                            </a>
                          </Link>
                        </li>
                        <li>
                          <Link href="/urunler/vitaminler">
                            <a className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                              <div className="text-sm font-medium leading-none">Vitamin Takviyeleri</div>
                              <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                Saç sağlığı için vitamin ve mineraller
                              </p>
                            </a>
                          </Link>
                        </li>
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger>Blog</NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px]">
                        <li>
                          <Link href="/blog/sac-ekimi">
                            <a className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                              <div className="text-sm font-medium leading-none">Saç Ekimi Makaleleri</div>
                              <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                Saç ekimi hakkında detaylı bilgiler
                              </p>
                            </a>
                          </Link>
                        </li>
                        <li>
                          <Link href="/blog/bakim-onerileri">
                            <a className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                              <div className="text-sm font-medium leading-none">Bakım Önerileri</div>
                              <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                Saç bakımı için profesyonel öneriler
                              </p>
                            </a>
                          </Link>
                        </li>
                        <li>
                          <Link href="/blog/basari-hikayeleri">
                            <a className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                              <div className="text-sm font-medium leading-none">Başarı Hikayeleri</div>
                              <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                Hasta deneyimleri ve sonuç hikayeleri
                              </p>
                            </a>
                          </Link>
                        </li>
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <Link href="/iletisim">
                      <NavigationMenuLink className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50">
                        İletişim
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            </nav>
          </div>

          {/* Right Side: Auth & Actions */}
          <div className="flex items-center gap-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                    <User className="h-5 w-5" />
                    <span className="sr-only">Kullanıcı menüsü</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
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
              <div className="hidden md:flex items-center gap-2">
                <Link href="/auth/login">
                  <Button variant="ghost">Giriş Yap</Button>
                </Link>
                <Link href="/auth/register">
                  <Button variant="secondary">Kayıt Ol</Button>
                </Link>
              </div>
            )}

            <Link href="/randevu">
              <Button className="hidden md:inline-flex">
                Ücretsiz Danışma
              </Button>
            </Link>

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" className="md:hidden h-9 w-9 p-0">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Menü</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <div className="grid gap-6 py-6">
                  <Link href="/hizmetler">
                    <a className="text-sm font-medium">Hizmetlerimiz</a>
                  </Link>
                  <Link href="/galeri">
                    <a className="text-sm font-medium">Hasta Sonuçları</a>
                  </Link>
                  <Link href="/urunler">
                    <a className="text-sm font-medium">Ürünler</a>
                  </Link>
                  <Link href="/blog">
                    <a className="text-sm font-medium">Blog</a>
                  </Link>
                  <Link href="/iletisim">
                    <a className="text-sm font-medium">İletişim</a>
                  </Link>
                  {!user && (
                    <>
                      <Link href="/auth/login">
                        <Button variant="ghost" className="w-full justify-start">
                          Giriş Yap
                        </Button>
                      </Link>
                      <Link href="/auth/register">
                        <Button variant="secondary" className="w-full justify-start">
                          Kayıt Ol
                        </Button>
                      </Link>
                    </>
                  )}
                  <Link href="/randevu">
                    <Button className="w-full">Ücretsiz Danışma</Button>
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