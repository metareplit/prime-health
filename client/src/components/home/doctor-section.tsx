import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Award, Calendar, Star, CheckCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function DoctorSection() {
  const { t } = useTranslation('common');

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background Elements */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="absolute -right-40 -top-40 w-96 h-96 bg-primary/5 rounded-full blur-3xl"
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="absolute -left-40 -bottom-40 w-96 h-96 bg-primary/5 rounded-full blur-3xl"
      />

      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Doctor Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="aspect-[3/4] rounded-2xl overflow-hidden">
              <img
                src="/images/doctors/alicaliskan-Photoroom.png"
                alt="Dr. Ali Çalışkan"
                className="w-full h-full object-cover"
                onError={(e) => {
                  console.error("Failed to load doctor image");
                  e.currentTarget.src = '/images/default-doctor.svg';
                }}
              />
            </div>
            <div className="absolute -bottom-6 -right-6 bg-white rounded-xl p-4 shadow-lg">
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-400 fill-current" />
                <span className="font-semibold">4.9/5</span>
                <span className="text-muted-foreground">({t('doctor.reviewCount')})</span>
              </div>
            </div>
          </motion.div>

          {/* Doctor Info */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-2">Dr. Ali Çalışkan</h2>
              <p className="text-xl text-primary font-medium">Saç Ekimi ve Estetik Cerrahi Uzmanı</p>
            </div>

            <p className="text-gray-600 text-lg">
              20 yılı aşkın deneyimi ile saç ekimi ve estetik cerrahi alanında uzmanlaşmış, 
              binlerce başarılı operasyona imza atmış değerli bir hekimdir.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <Award className="h-6 w-6 text-primary flex-shrink-0" />
                <div>
                  <h4 className="font-medium">Uzman Hekim</h4>
                  <p className="text-sm text-gray-600">20+ Yıl Deneyim</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-6 w-6 text-primary flex-shrink-0" />
                <div>
                  <h4 className="font-medium">10.000+ Operasyon</h4>
                  <p className="text-sm text-gray-600">Başarılı Sonuçlar</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button 
                size="lg" 
                className="group"
                asChild
              >
                <Link href="/randevu">
                  <Calendar className="mr-2 h-5 w-5" />
                  {t('buttons.appointment')}
                </Link>
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="group"
                asChild
              >
                <Link href="/hakkimizda">
                  Daha Fazla Bilgi
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}