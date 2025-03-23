import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Clock, Facebook, Instagram, Youtube, Twitter } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Metadata } from "@/components/ui/metadata";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-transparent">
      <Metadata 
        title="İletişim - Saç Ekimi ve Estetik Kliniği"
        description="Saç ekimi ve estetik tedaviler için ücretsiz danışmanlık alın. İstanbul'daki kliniğimize ulaşın, randevu oluşturun veya sorularınızı sorun."
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
            <h1 className="text-4xl font-bold mb-6">İletişim</h1>
            <p className="text-lg text-gray-600">
              Size yardımcı olmaktan mutluluk duyarız. İstediğiniz zaman bizimle iletişime geçebilirsiniz.
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
                      <h3 className="font-medium text-lg mb-2">Adres</h3>
                      <p className="text-gray-600 text-lg">
                        Merkez Mahallesi, Şişli Caddesi No:123
                        <br />
                        Şişli, İstanbul
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-3 rounded-lg">
                      <Phone className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium text-lg mb-2">Telefon</h3>
                      <p className="text-gray-600 text-lg">+90 (212) 123 45 67</p>
                      <p className="text-gray-600 text-lg">+90 (532) 123 45 67</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-3 rounded-lg">
                      <Mail className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium text-lg mb-2">E-posta</h3>
                      <p className="text-gray-600 text-lg">info@sacekimi.com</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-3 rounded-lg">
                      <Clock className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium text-lg mb-2">Çalışma Saatleri</h3>
                      <p className="text-gray-600 text-lg">
                        Pazartesi - Cumartesi: 09:00 - 18:00
                        <br />
                        Pazar: Kapalı
                      </p>
                    </div>
                  </div>

                  <div className="pt-8 border-t">
                    <h3 className="font-medium text-lg mb-4">Sosyal Medya</h3>
                    <div className="flex gap-4">
                      <a 
                        href="#" 
                        className="bg-primary/10 p-4 rounded-lg hover:bg-primary/20 transition-colors"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Facebook className="h-6 w-6 text-primary" />
                      </a>
                      <a 
                        href="#" 
                        className="bg-primary/10 p-4 rounded-lg hover:bg-primary/20 transition-colors"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Instagram className="h-6 w-6 text-primary" />
                      </a>
                      <a 
                        href="#" 
                        className="bg-primary/10 p-4 rounded-lg hover:bg-primary/20 transition-colors"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Youtube className="h-6 w-6 text-primary" />
                      </a>
                      <a 
                        href="#" 
                        className="bg-primary/10 p-4 rounded-lg hover:bg-primary/20 transition-colors"
                        target="_blank"
                        rel="noopener noreferrer"
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
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3008.232948447819!2d28.987875815415816!3d41.052587579297466!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cab703f3ea0007%3A0xe81c3e8f8ef5e926!2zxZ5pxZ9saSwgxLBzdGFuYnVs!5e0!3m2!1str!2str!4v1645789056789!5m2!1str!2str"
                  width="100%"
                  height="100%"
                  style={{ border: 0, minHeight: "600px" }}
                  allowFullScreen
                  loading="lazy"
                  className="rounded-lg"
                ></iframe>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}