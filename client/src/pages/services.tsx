import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, Check, HelpCircle, ArrowRight, ListChecks, Info } from "lucide-react";
import { motion } from "framer-motion";
import type { Service } from "@shared/schema";
import { Metadata } from "@/components/ui/metadata";
import { useTranslation } from "react-i18next";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 }
};

const ServiceCard = ({ service }: { service: Service }) => {
  const { t, i18n } = useTranslation('common');
  const currentLang = i18n.language;
  // Fallback image for services that don't have an image
  const fallbackImage = "/images/services/primehealth1.png";

  // Get the localized service name and description based on current language
  const getLocalizedServiceName = () => {
    if (currentLang === 'tr') return service.name;
    if (currentLang === 'en' && t(`services.serviceItems.${service.id}.name`)) 
      return t(`services.serviceItems.${service.id}.name`);
    if (currentLang === 'ru' && t(`services.serviceItems.${service.id}.name`)) 
      return t(`services.serviceItems.${service.id}.name`);
    if (currentLang === 'ka' && t(`services.serviceItems.${service.id}.name`)) 
      return t(`services.serviceItems.${service.id}.name`);
    return service.name;
  };

  const getLocalizedServiceDescription = () => {
    if (currentLang === 'tr') return service.description;
    if (currentLang === 'en' && t(`services.serviceItems.${service.id}.description`)) 
      return t(`services.serviceItems.${service.id}.description`);
    if (currentLang === 'ru' && t(`services.serviceItems.${service.id}.description`)) 
      return t(`services.serviceItems.${service.id}.description`);
    if (currentLang === 'ka' && t(`services.serviceItems.${service.id}.description`)) 
      return t(`services.serviceItems.${service.id}.description`);
    return service.description;
  };

  const getLocalizedProcess = (index: number) => {
    const defaultValue = service.process?.[index];
    if (!defaultValue) return '';

    if (currentLang === 'tr') return defaultValue;
    if (currentLang !== 'tr' && t(`services.serviceItems.${service.id}.process.${index}`)) 
      return t(`services.serviceItems.${service.id}.process.${index}`);
    
    // Fallback to translation based on process array
    const translatedProcess = t(`services.serviceItems.${service.id}.process`);
    if (translatedProcess && Array.isArray(translatedProcess) && translatedProcess[index]) {
      return translatedProcess[index];
    }
    
    return defaultValue;
  };
  
  const getLocalizedBenefit = (index: number) => {
    const defaultValue = service.benefits?.[index];
    if (!defaultValue) return '';

    if (currentLang === 'tr') return defaultValue;
    if (currentLang !== 'tr' && t(`services.serviceItems.${service.id}.benefits.${index}`)) 
      return t(`services.serviceItems.${service.id}.benefits.${index}`);
    
    return defaultValue;
  };
  
  const getLocalizedFaq = (faq: string) => {
    if (!faq) return { question: '', answer: '' };
    
    const [question, answer] = faq.split("|");
    
    if (currentLang === 'tr') return { question, answer };
    
    // Try to get translated FAQ
    const faqIndex = service.faqs?.indexOf(faq);
    if (faqIndex !== undefined && faqIndex >= 0) {
      const translatedQuestion = t(`services.serviceItems.${service.id}.faqs.${faqIndex}.question`);
      const translatedAnswer = t(`services.serviceItems.${service.id}.faqs.${faqIndex}.answer`);
      
      if (translatedQuestion && translatedAnswer) {
        return { 
          question: translatedQuestion, 
          answer: translatedAnswer 
        };
      }
    }
    
    return { question, answer };
  };

  return (
    <Card className="h-full flex flex-col overflow-hidden hover:shadow-lg transition-all duration-300 relative">
      <div className="relative overflow-hidden aspect-video">
        <img
          src={service.imageUrl || fallbackImage}
          alt={getLocalizedServiceName()}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = fallbackImage;
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <Button 
            variant="secondary" 
            size="sm" 
            className="w-full bg-white/90 hover:bg-white"
            asChild
          >
            <Link href={`/randevu?service=${service.slug}`}>
              {t('buttons.appointment')}
            </Link>
          </Button>
        </div>
      </div>

      <CardHeader className="flex-grow">
        <CardTitle className="text-xl font-bold flex items-center justify-between">
          {getLocalizedServiceName()}
          <span className="flex items-center text-sm font-normal text-primary">
            <Clock className="h-4 w-4 mr-1" />
            {service.duration}
          </span>
        </CardTitle>
        <p className="text-gray-600 text-sm mt-2">{getLocalizedServiceDescription()}</p>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="details" className="text-xs">
              <Info className="h-3 w-3 mr-1" /> {t('services.tabs.details')}
            </TabsTrigger>
            <TabsTrigger value="benefits" className="text-xs">
              <Check className="h-3 w-3 mr-1" /> {t('services.tabs.benefits')}
            </TabsTrigger>
            <TabsTrigger value="faq" className="text-xs">
              <HelpCircle className="h-3 w-3 mr-1" /> {t('services.tabs.faq')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="mt-2">
            <div className="space-y-2">
              <h3 className="font-semibold text-sm mb-2 flex items-center gap-2">
                <ListChecks className="h-4 w-4 text-primary" />
                {t('services.processTitle')}
              </h3>
              <ol className="space-y-1 text-sm">
                {service.process?.slice(0, 4).map((step, idx) => (
                  <motion.li
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex items-center gap-2 p-2 rounded hover:bg-gray-50"
                  >
                    <span className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs flex-shrink-0">
                      {idx + 1}
                    </span>
                    <span className="text-gray-600">{getLocalizedProcess(idx)}</span>
                  </motion.li>
                ))}
              </ol>
            </div>
          </TabsContent>

          <TabsContent value="benefits" className="mt-2">
            <motion.ul 
              className="grid grid-cols-1 gap-2"
              variants={container}
              initial="hidden"
              animate="show"
            >
              {service.benefits?.slice(0, 4).map((benefit, idx) => (
                <motion.li
                  key={idx}
                  variants={item}
                  className="flex items-center gap-2 text-sm p-2 rounded hover:bg-gray-50"
                >
                  <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                  <span className="text-gray-600">{getLocalizedBenefit(idx)}</span>
                </motion.li>
              ))}
            </motion.ul>
          </TabsContent>

          <TabsContent value="faq" className="mt-2">
            <Accordion type="single" collapsible>
              {service.faqs?.slice(0, 3).map((faq, idx) => {
                const localizedFaq = getLocalizedFaq(faq);
                return (
                  <AccordionItem 
                    key={idx} 
                    value={`item-${idx}`}
                    className="border-b last:border-0"
                  >
                    <AccordionTrigger className="text-sm hover:text-primary transition-colors">
                      {localizedFaq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-sm text-gray-600">
                      {localizedFaq.answer}
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          </TabsContent>
        </Tabs>

        <div className="mt-4 pt-4 border-t">
          <Button 
            size="sm"
            className="w-full group hover:translate-y-[-1px] transition-all duration-300"
            asChild
          >
            <Link href="/iletisim">
              <span>{t('services.freeConsultation')}</span>
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default function Services() {
  const { t } = useTranslation('common');
  const { data: services, isLoading } = useQuery<Service[]>({
    queryKey: ["/api/services"],
  });

  return (
    <div className="min-h-screen">
      <Metadata
        title={t('services.metaTitle')}
        description={t('services.metaDescription')}
        keywords={t('services.metaKeywords')}
        type="website"
        image="/images/services/sapphire-fue.jpg"
      />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 to-transparent py-16">
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
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="text-3xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
              {t('services.title')}
            </h1>
            <p className="text-lg text-gray-600">
              {t('services.description')}
            </p>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 bg-gray-100 animate-pulse rounded-lg" />
            ))}
          </div>
        ) : (
          <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {services?.map((service) => (
              <motion.div
                key={service.id}
                variants={item}
                className="group"
              >
                <ServiceCard service={service} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}