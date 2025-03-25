import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Clock, Facebook, Instagram, Youtube, Twitter } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Metadata } from "@/components/ui/metadata";
import { useTranslation } from "react-i18next";

export default function ContactPage() {
  const { t } = useTranslation('common');

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-transparent">
      <Metadata 
        title={t('contact.title') + " - " + t('nav.home')}
        description={t('contact.subtitle')}
        keywords="saç ekimi iletişim, estetik klinik iletişim, saç ekimi randevu, istanbul saç ekimi kliniği"
      />

      <div className="relative py-20 bg-primary/5">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl font-bold mb-6">{t('contact.title')}</h1>
            <p className="text-lg text-gray-600">
              {t('contact.subtitle')}
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="h-full">
              <CardContent className="p-8">
                <div className="space-y-8">
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-3 rounded-lg">
                      <MapPin className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium text-lg mb-2">{t('contact.address.title')}</h3>
                      <p className="text-gray-600 text-lg">
                        {t('contact.address.line1')}
                        <br />
                        {t('contact.address.line2')}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-3 rounded-lg">
                      <Phone className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium text-lg mb-2">{t('contact.phone.title')}</h3>
                      <p className="text-gray-600 text-lg">{t('contact.phone.number1')}</p>
                      <p className="text-gray-600 text-lg">{t('contact.phone.number2')}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-3 rounded-lg">
                      <Mail className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium text-lg mb-2">{t('contact.email.title')}</h3>
                      <p className="text-gray-600 text-lg">{t('contact.email.address')}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-3 rounded-lg">
                      <Clock className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium text-lg mb-2">{t('contact.workingHours.title')}</h3>
                      <p className="text-gray-600 text-lg">
                        {t('contact.workingHours.weekdays')}
                        <br />
                        {t('contact.workingHours.weekend')}
                      </p>
                    </div>
                  </div>

                  <div className="pt-8 border-t">
                    <h3 className="font-medium text-lg mb-4">{t('contact.socialMedia.title')}</h3>
                    <div className="flex gap-4">
                      <a 
                        href="#" 
                        className="bg-primary/10 p-4 rounded-lg hover:bg-primary/20 transition-colors"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Facebook"
                      >
                        <Facebook className="h-6 w-6 text-primary" />
                      </a>
                      <a 
                        href="#" 
                        className="bg-primary/10 p-4 rounded-lg hover:bg-primary/20 transition-colors"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Instagram"
                      >
                        <Instagram className="h-6 w-6 text-primary" />
                      </a>
                      <a 
                        href="#" 
                        className="bg-primary/10 p-4 rounded-lg hover:bg-primary/20 transition-colors"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Youtube"
                      >
                        <Youtube className="h-6 w-6 text-primary" />
                      </a>
                      <a 
                        href="#" 
                        className="bg-primary/10 p-4 rounded-lg hover:bg-primary/20 transition-colors"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Twitter"
                      >
                        <Twitter className="h-6 w-6 text-primary" />
                      </a>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="h-full">
              <CardContent className="p-0">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2978.5447754789347!2d44.784928715544385!3d41.71514097923691!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40440d4d840d70d9%3A0xc19f34f41e017af7!2s59%20Tsotne%20Dadiani%20St%2C%20T&#39;bilisi%2C%20Georgia!5e0!3m2!1sen!2sus!4v1616418919855!5m2!1sen!2sus"
                  width="100%"
                  height="100%"
                  style={{ border: 0, minHeight: "600px" }}
                  allowFullScreen
                  loading="lazy"
                  className="rounded-lg"
                  title="Google Maps - Prime Health Location"
                ></iframe>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}