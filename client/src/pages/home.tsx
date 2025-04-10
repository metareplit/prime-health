import { useQuery } from "@tanstack/react-query";
import ServiceCard from "@/components/services/service-card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import HeroSlider from "@/components/home/hero-slider";
import DoctorSection from "@/components/home/doctor-section"; 
import { motion } from "framer-motion";
import { Shield, Users, Stethoscope, Clock, Award, HeartHandshake, Building2, Map, ArrowRight, CheckCircle, PlusCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useTranslation } from "react-i18next";
import Features from "@/components/home/features";
import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";

const features = [
  {
    icon: <Shield className="h-8 w-8 text-primary" />,
    titleKey: "home.features.expertise.title",
    descriptionKey: "home.features.expertise.description"
  },
  {
    icon: <Users className="h-8 w-8 text-primary" />,
    titleKey: "home.features.technology.title",
    descriptionKey: "home.features.technology.description"
  },
  {
    icon: <Stethoscope className="h-8 w-8 text-primary" />,
    titleKey: "home.features.care.title",
    descriptionKey: "home.features.care.description"
  },
  {
    icon: <Clock className="h-8 w-8 text-primary" />,
    titleKey: "home.features.recovery.title",
    descriptionKey: "home.features.recovery.description"
  },
  {
    icon: <Award className="h-8 w-8 text-primary" />,
    titleKey: "home.features.guarantee.title",
    descriptionKey: "home.features.guarantee.description"
  },
  {
    icon: <HeartHandshake className="h-8 w-8 text-primary" />,
    titleKey: "home.features.approach.title",
    descriptionKey: "home.features.approach.description"
  },
  {
    icon: <Building2 className="h-8 w-8 text-primary" />,
    titleKey: "home.features.clinic.title",
    descriptionKey: "home.features.clinic.description"
  },
  {
    icon: <Map className="h-8 w-8 text-primary" />,
    titleKey: "home.features.location.title",
    descriptionKey: "home.features.location.description"
  }
];

const faqItems = [
  {
    questionKey: "faq.items.0.question",
    answerKey: "faq.items.0.answer"
  },
  {
    questionKey: "faq.items.1.question",
    answerKey: "faq.items.1.answer"
  },
  {
    questionKey: "faq.items.2.question",
    answerKey: "faq.items.2.answer"
  },
  {
    questionKey: "faq.items.3.question",
    answerKey: "faq.items.3.answer"
  },
  {
    questionKey: "faq.items.4.question",
    answerKey: "faq.items.4.answer"
  }
];

export default function Home() {
  const { t } = useTranslation('common');
  interface Service {
    id: number;
    name: string;
    description: string;
    imageUrl?: string;
    slug: string;
    featured?: boolean;
    process?: string[];
  }

  // Locale servislerini kullanmak için state değişkeni
  const { i18n } = useTranslation('common');
  const currentLanguage = i18n.language;

  // API'den gelen orjinal servisleri al
  const { data: apiServices = [], isLoading: isApiServicesLoading } = useQuery<Service[]>({
    queryKey: ["/api/services"],
  });

  // Çeviri dosyalarından gelen servisler
  const [services, setServices] = useState<Service[]>([]);
  
  useEffect(() => {
    // Tüm servis öğelerini çeviri dosyasından al
    const serviceItems = Array.from({ length: 5 }, (_, i) => {
      const serviceIndex = i + 1;
      
      // process array'ini oluştur
      let processArray: string[] = [];
      try {
        const processObj = t(`services.serviceItems.${serviceIndex}.process`, { returnObjects: true });
        if (Array.isArray(processObj)) {
          processArray = processObj.map(item => String(item));
        }
      } catch (error) {
        console.error("Process array error:", error);
      }
      
      return {
        id: serviceIndex,
        name: t(`services.serviceItems.${serviceIndex}.name`),
        description: t(`services.serviceItems.${serviceIndex}.description`),
        process: processArray,
        imageUrl: apiServices.find(s => s.id === serviceIndex)?.imageUrl || `/images/services/primehealth${serviceIndex}.png`,
        slug: apiServices.find(s => s.id === serviceIndex)?.slug || 
              (serviceIndex === 1 ? 'sac-ekimi' : 
               serviceIndex === 2 ? 'sakal-ekimi' : 
               serviceIndex === 3 ? 'kas-ekimi' : 
               serviceIndex === 4 ? 'prp-tedavisi' : 'mezoterapi'),
        featured: apiServices.find(s => s.id === serviceIndex)?.featured || (serviceIndex <= 3)
      };
    });
    
    setServices(serviceItems);
  }, [t, apiServices, currentLanguage]);
  
  const isLoading = isApiServicesLoading;

  return (
    <div className="min-h-screen">
      <Helmet>
        <title>{t('slider.title1')} | Prime Health</title>
        <meta name="description" content={t('slider.description1')} />
        <meta name="keywords" content={t('services.metaKeywords')} />
      </Helmet>
      
      {/* Hero Slider Section */}
      <HeroSlider />

      {/* Features Section */}
      <Features />

      {/* Doctor Section */}
      <DoctorSection />

      {/* Services Section */}
      <section className="relative overflow-hidden py-20 bg-gradient-to-b from-primary/5 to-transparent">
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

        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h1 className="text-3xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
              {t('home.services.title')}
            </h1>
            <p className="text-lg text-gray-600">
              {t('home.services.subtitle')}
            </p>
          </motion.div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-[500px] bg-gray-100 animate-pulse rounded-xl"
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services?.map((service, index) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="group relative bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
                >
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={service.imageUrl || '/images/hair-transplant.svg'}
                      alt={service.name}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/images/hair-transplant.svg';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>

                  <div className="p-6">
                    <h3 className="text-2xl font-semibold mb-3 group-hover:text-primary transition-colors">
                      {service.name}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {service.description}
                    </p>

                    <div className="space-y-2 mb-6">
                      {service.process?.slice(0, 3).map((step: string, idx: number) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2 text-sm text-gray-600 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <CheckCircle className="h-4 w-4 text-primary" />
                          <span>{step}</span>
                        </div>
                      ))}
                    </div>

                    {/* Daha fazla bilgi butonu kaldırıldı */}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gradient-to-b from-transparent to-primary/5">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              {t('faq.title')}
            </h2>
            <p className="text-lg text-gray-600">
              {t('faq.subtitle')}
            </p>
          </motion.div>

          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4">
              {faqItems.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <AccordionItem value={`item-${index}`} className="bg-white rounded-lg border">
                    <AccordionTrigger className="px-6 py-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-3 text-left">
                        <PlusCircle className="h-5 w-5 text-primary flex-shrink-0" />
                        <span className="font-medium">{t(item.questionKey)}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-4">
                      <div className="pl-8 text-gray-600">
                        {t(item.answerKey)}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>
              ))}
            </Accordion>
          </div>
        </div>
      </section>
    </div>
  );
}