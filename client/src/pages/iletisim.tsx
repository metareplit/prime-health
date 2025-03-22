import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Clock, MessageSquare } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-transparent py-20">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h1 className="text-4xl font-bold mb-6">İletişim</h1>
          <p className="text-lg text-gray-600">
            Size yardımcı olmaktan mutluluk duyarız. Bizimle iletişime geçin.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-semibold mb-6">İletişim Bilgileri</h2>
                
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-3 rounded-lg">
                      <MapPin className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">Adres</h3>
                      <p className="text-gray-600">
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
                      <h3 className="font-medium mb-1">Telefon</h3>
                      <p className="text-gray-600">+90 (212) 123 45 67</p>
                      <p className="text-gray-600">+90 (532) 123 45 67</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-3 rounded-lg">
                      <Mail className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">E-posta</h3>
                      <p className="text-gray-600">info@sacekimi.com</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-3 rounded-lg">
                      <Clock className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">Çalışma Saatleri</h3>
                      <p className="text-gray-600">
                        Pazartesi - Cumartesi: 09:00 - 18:00
                        <br />
                        Pazar: Kapalı
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Map */}
            <Card>
              <CardContent className="p-0">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3008.232948447819!2d28.987875815415816!3d41.052587579297466!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cab703f3ea0007%3A0xe81c3e8f8ef5e926!2zxZ5pxZ9saSwgxLBzdGFuYnVs!5e0!3m2!1str!2str!4v1645789056789!5m2!1str!2str"
                  width="100%"
                  height="300"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  className="rounded-lg"
                ></iframe>
              </CardContent>
            </Card>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <MessageSquare className="h-6 w-6 text-primary" />
                  <h2 className="text-2xl font-semibold">Bize Mesaj Gönderin</h2>
                </div>

                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Ad Soyad</label>
                      <Input placeholder="Ad Soyad" className="bg-white/50 backdrop-blur-sm" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Telefon</label>
                      <Input placeholder="Telefon" className="bg-white/50 backdrop-blur-sm" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">E-posta</label>
                    <Input type="email" placeholder="E-posta" className="bg-white/50 backdrop-blur-sm" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Konu</label>
                    <Input placeholder="Mesajınızın konusu" className="bg-white/50 backdrop-blur-sm" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Mesaj</label>
                    <Textarea 
                      placeholder="Mesajınız..." 
                      className="min-h-[150px] bg-white/50 backdrop-blur-sm" 
                    />
                  </div>

                  <Button type="submit" className="w-full">
                    Mesaj Gönder
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
