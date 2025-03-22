import { Link } from "wouter";
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t">
      <div className="container mx-auto px-4">
        {/* Üst Footer */}
        <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Kurumsal */}
          <div>
            <h3 className="font-bold text-lg mb-4">Kurumsal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/hakkimizda">
                  <a className="text-gray-600 hover:text-primary transition-colors">Hakkımızda</a>
                </Link>
              </li>
              <li>
                <Link href="/doktorlarimiz">
                  <a className="text-gray-600 hover:text-primary transition-colors">Doktorlarımız</a>
                </Link>
              </li>
              <li>
                <Link href="/basin">
                  <a className="text-gray-600 hover:text-primary transition-colors">Basında Biz</a>
                </Link>
              </li>
              <li>
                <Link href="/blog">
                  <a className="text-gray-600 hover:text-primary transition-colors">Blog</a>
                </Link>
              </li>
            </ul>
          </div>

          {/* Hizmetler */}
          <div>
            <h3 className="font-bold text-lg mb-4">Hizmetlerimiz</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/hizmetler#sac-ekimi">
                  <a className="text-gray-600 hover:text-primary transition-colors">Saç Ekimi</a>
                </Link>
              </li>
              <li>
                <Link href="/hizmetler#sakal-ekimi">
                  <a className="text-gray-600 hover:text-primary transition-colors">Sakal Ekimi</a>
                </Link>
              </li>
              <li>
                <Link href="/hizmetler#kas-ekimi">
                  <a className="text-gray-600 hover:text-primary transition-colors">Kaş Ekimi</a>
                </Link>
              </li>
              <li>
                <Link href="/hizmetler#prp">
                  <a className="text-gray-600 hover:text-primary transition-colors">PRP Tedavisi</a>
                </Link>
              </li>
            </ul>
          </div>

          {/* İletişim */}
          <div>
            <h3 className="font-bold text-lg mb-4">İletişim</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-gray-600">
                <MapPin className="h-4 w-4" />
                <span>Tiflis, Gürcistan</span>
              </li>
              <li className="flex items-center gap-2 text-gray-600">
                <Phone className="h-4 w-4" />
                <a href="tel:+995123456789" className="hover:text-primary transition-colors">
                  +995 123 456 789
                </a>
              </li>
              <li className="flex items-center gap-2 text-gray-600">
                <Mail className="h-4 w-4" />
                <a href="mailto:info@hairclinic.com" className="hover:text-primary transition-colors">
                  info@hairclinic.com
                </a>
              </li>
            </ul>
          </div>

          {/* Sosyal Medya & Randevu */}
          <div>
            <h3 className="font-bold text-lg mb-4">Sosyal Medya</h3>
            <div className="flex gap-3 mb-6">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-gray-100 hover:bg-primary hover:text-white transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-gray-100 hover:bg-primary hover:text-white transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-gray-100 hover:bg-primary hover:text-white transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
            </div>
            <Button asChild className="w-full">
              <Link href="/randevu">Ücretsiz Danışmanlık</Link>
            </Button>
          </div>
        </div>

        {/* Alt Footer */}
        <div className="py-6 border-t text-center text-sm text-gray-500">
          <p className="mb-2">&copy; 2024 Hair Clinic. Tüm hakları saklıdır.</p>
          <div className="flex justify-center gap-4">
            <Link href="/gizlilik">
              <a className="hover:text-primary transition-colors">Gizlilik Politikası</a>
            </Link>
            <Link href="/kullanim-kosullari">
              <a className="hover:text-primary transition-colors">Kullanım Koşulları</a>
            </Link>
            <Link href="/cerez-politikasi">
              <a className="hover:text-primary transition-colors">Çerez Politikası</a>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}