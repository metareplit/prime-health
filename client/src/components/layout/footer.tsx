import { Link } from "wouter";
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

export default function Footer() {
  const { t } = useTranslation('common');
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 border-t">
      <div className="container mx-auto px-4">
        {/* Üst Footer */}
        <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Kurumsal */}
          <div>
            <h3 className="font-bold text-lg mb-4">{t('footer.company.title')}</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/hakkimizda">
                  <a className="text-gray-600 hover:text-primary transition-colors">{t('footer.company.about')}</a>
                </Link>
              </li>
              <li>
                <Link href="/doktorlarimiz">
                  <a className="text-gray-600 hover:text-primary transition-colors">{t('nav.doctors')}</a>
                </Link>
              </li>
              <li>
                <Link href="/basin">
                  <a className="text-gray-600 hover:text-primary transition-colors">{t('nav.press')}</a>
                </Link>
              </li>
              <li>
                <Link href="/blog">
                  <a className="text-gray-600 hover:text-primary transition-colors">{t('nav.blog')}</a>
                </Link>
              </li>
            </ul>
          </div>

          {/* Hizmetler */}
          <div>
            <h3 className="font-bold text-lg mb-4">{t('nav.services')}</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/hizmetler#sac-ekimi">
                  <a className="text-gray-600 hover:text-primary transition-colors">{t('services.categories.hair.title')}</a>
                </Link>
              </li>
              <li>
                <Link href="/hizmetler#sakal-ekimi">
                  <a className="text-gray-600 hover:text-primary transition-colors">{t('services.categories.beard.title')}</a>
                </Link>
              </li>
              <li>
                <Link href="/hizmetler#kas-ekimi">
                  <a className="text-gray-600 hover:text-primary transition-colors">{t('services.categories.eyebrow.title')}</a>
                </Link>
              </li>
              <li>
                <Link href="/hizmetler#prp">
                  <a className="text-gray-600 hover:text-primary transition-colors">{t('services.categories.prp.title')}</a>
                </Link>
              </li>
            </ul>
          </div>

          {/* İletişim */}
          <div>
            <h3 className="font-bold text-lg mb-4">{t('footer.contact.title')}</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-gray-600">
                <MapPin className="h-4 w-4" />
                <span>Tsotne Dadiani 59, Tbilisi, Georgia</span>
              </li>
              <li className="flex items-center gap-2 text-gray-600">
                <Phone className="h-4 w-4" />
                <a href="tel:+995555003044" className="hover:text-primary transition-colors">
                  +995 555 003 044
                </a>
              </li>
              <li className="flex items-center gap-2 text-gray-600">
                <Mail className="h-4 w-4" />
                <a href="mailto:primehealthtblisi@gmail.com" className="hover:text-primary transition-colors">
                  primehealthtblisi@gmail.com
                </a>
              </li>
            </ul>
          </div>

          {/* Sosyal Medya & Randevu */}
          <div>
            <h3 className="font-bold text-lg mb-4">{t('footer.social.title')}</h3>
            <div className="flex gap-3 mb-6">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-gray-100 hover:bg-primary hover:text-white transition-colors"
                aria-label={t('footer.social.facebook')}
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-gray-100 hover:bg-primary hover:text-white transition-colors"
                aria-label={t('footer.social.twitter')}
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-gray-100 hover:bg-primary hover:text-white transition-colors"
                aria-label={t('footer.social.instagram')}
              >
                <Instagram className="h-5 w-5" />
              </a>
            </div>
            <Button asChild className="w-full">
              <Link href="/randevu">{t('services.consultation.title')}</Link>
            </Button>
          </div>
        </div>

        {/* Alt Footer */}
        <div className="py-6 border-t text-center text-sm text-gray-500">
          <p className="mb-2">© {currentYear} Prime Health. Tüm hakları saklıdır.</p>
          <div className="flex justify-center gap-4">
            <Link href="/gizlilik">
              <a className="hover:text-primary transition-colors">{t('footer.company.privacy')}</a>
            </Link>
            <Link href="/kullanim-kosullari">
              <a className="hover:text-primary transition-colors">{t('footer.company.terms')}</a>
            </Link>
            <Link href="/cerez-politikasi">
              <a className="hover:text-primary transition-colors">{t('cookies.title')}</a>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}