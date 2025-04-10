import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Award, Calendar, CheckCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function DoctorSection() {
  const { t } = useTranslation('common');

  return (
    <section className="py-12 relative overflow-hidden">
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
          {/* Doctor Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="aspect-[3/4] rounded-2xl overflow-hidden max-w-md mx-auto">
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
          </motion.div>

          {/* Doctor Info */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-2">{t('home.doctor.title')}</h2>
              <p className="text-lg text-primary font-medium">{t('home.doctor.position')}</p>
            </div>

            <p className="text-gray-600">
              {t('home.doctor.description')}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex items-start gap-2">
                <Award className="h-5 w-5 text-primary flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-sm">{t('home.doctor.expert')}</h4>
                  <p className="text-xs text-gray-600">{t('home.doctor.experience')}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-sm">{t('home.doctor.operations')}</h4>
                  <p className="text-xs text-gray-600">{t('home.doctor.results')}</p>
                </div>
              </div>
            </div>

            <div className="flex justify-center pt-6">
              <Button 
                size="lg" 
                className="group relative overflow-hidden px-8 py-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                asChild
              >
                <Link href="/randevu">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent group-hover:translate-x-full transition-transform duration-300" />
                  <Calendar className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                  <span className="text-lg">{t('home.doctor.appointment')}</span>
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}