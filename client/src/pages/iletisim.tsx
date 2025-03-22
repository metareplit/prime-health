import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Clock, MessageSquare, Facebook, Instagram, Youtube, Twitter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

export default function ContactPage() {
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Başarılı!",
      description: "Mesajınız başarıyla gönderildi. En kısa sürede size dönüş yapacağız.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-transparent">
      {/* Hero Section */}
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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-5 space-y-6"
          >
            <Card className="overflow-hidden">
              <CardHeader>
                <CardTitle className="text-2xl">İletişim Bilgileri</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
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

                {/* Social Media Links */}
                <div className="pt-6 border-t">
                  <h3 className="font-medium mb-4">Sosyal Medya</h3>
                  <div className="flex gap-4">
                    <a href="#" className="bg-primary/10 p-3 rounded-lg hover:bg-primary/20 transition-colors">
                      <Facebook className="h-6 w-6 text-primary" />
                    </a>
                    <a href="#" className="bg-primary/10 p-3 rounded-lg hover:bg-primary/20 transition-colors">
                      <Instagram className="h-6 w-6 text-primary" />
                    </a>
                    <a href="#" className="bg-primary/10 p-3 rounded-lg hover:bg-primary/20 transition-colors">
                      <Youtube className="h-6 w-6 text-primary" />
                    </a>
                    <a href="#" className="bg-primary/10 p-3 rounded-lg hover:bg-primary/20 transition-colors">
                      <Twitter className="h-6 w-6 text-primary" />
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <MessageSquare className="h-6 w-6 text-primary" />
                  <span>Bize Mesaj Gönderin</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Ad Soyad</label>
                    <Input placeholder="Ad Soyad" className="bg-white/50 backdrop-blur-sm" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Telefon</label>
                    <PhoneInput
                      country={'tr'}
                      inputClass="w-full !h-10 !bg-white/50 backdrop-blur-sm !border-input !pl-[48px]"
                      containerClass="!w-full"
                      buttonClass="!border-input !h-10 !bg-white/50"
                      searchClass="!bg-white"
                      dropdownClass="!bg-white"
                    />
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

                  <Button type="submit" className="w-full bg-primary/90 hover:bg-primary">
                    Mesaj Gönder
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          {/* Map */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-7"
          >
            <Card className="h-full">
              <CardContent className="p-0 h-full">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3008.232948447819!2d28.987875815415816!3d41.052587579297466!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cab703f3ea0007%3A0xe81c3e8f8ef5e926!2zxZ5pxZ9saSwgxLBzdGFuYnVs!5e0!3m2!1str!2str!4v1645789056789!5m2!1str!2str"
                  width="100%"
                  height="100%"
                  style={{ border: 0, minHeight: "700px" }}
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