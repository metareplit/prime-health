import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Metadata } from "@/components/ui/metadata";
import BeforeAfterSlider from "@/components/gallery/before-after-slider";
import { Badge } from "@/components/ui/badge";
import { Clock, Star, Users, CheckCircle, Share2, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Link } from "wouter";
import { ArrowRight } from 'lucide-react';

const galleryItems = [
  {
    category: "sac-ekimi",
    title: "Saç Ekimi Öncesi/Sonrası",
    description: "Modern FUE ve DHI teknikleriyle yapılan saç ekimi operasyonlarının etkileyici sonuçları",
    items: [
      {
        id: 1,
        beforeImage: "/images/gallery/hair-before-1.jpg",
        afterImage: "/images/gallery/hair-after-1.jpg",
        description: "6 ay sonrası sonuç",
        patientDetails: {
          age: "35",
          gender: "Erkek",
          problemArea: "Ön saç çizgisi ve tepe bölgesi",
          diagnosis: "Androgenetic alopecia",
          hairLossStage: "Norwood Scale 4"
        },
        procedureDetails: {
          technique: "Safir FUE",
          grafts: "4500",
          duration: "8 saat",
          anesthesia: "Lokal anestezi",
          recoveryTime: "12 ay"
        },
        results: {
          satisfaction: "Çok memnun",
          density: "55 grafs/cm²",
          survivalRate: "95%",
          naturalness: "Doğal görünüm",
          finalResult: "Doğal ve sık görünüm"
        },
        testimonial: "Operasyon öncesi endişelerim vardı ancak süreç çok profesyonel ilerledi. Sonuçtan çok memnunum.",
        doctorNote: "Hasta için özel tasarlanan saç çizgisi ve yoğunluk planlaması ile optimal sonuç elde edildi."
      },
      {
        id: 2,
        beforeImage: "/images/gallery/hair-before-2.jpg",
        afterImage: "/images/gallery/hair-after-2.jpg",
        description: "8 ay sonrası sonuç",
        patientDetails: {
          age: "42",
          gender: "Erkek",
          problemArea: "Tepe bölgesi",
          diagnosis: "Diffuse thinning",
          hairLossStage: "Norwood Scale 3V"
        },
        procedureDetails: {
          technique: "DHI",
          grafts: "3800",
          duration: "7 saat",
          anesthesia: "Lokal anestezi",
          recoveryTime: "10 ay"
        },
        results: {
          satisfaction: "Memnun",
          density: "48 grafs/cm²",
          survivalRate: "92%",
          naturalness: "Çok doğal görünüm",
          finalResult: "Yoğun ve doğal görünüm"
        },
        testimonial: "DHI tekniği ile yapılan operasyon sonrası iyileşme sürecim çok rahat geçti.",
        doctorNote: "DHI tekniği ile tek tek yapılan ekim sayesinde maksimum doğallık sağlandı."
      }
    ]
  },
  {
    category: "sakal-ekimi",
    title: "Sakal Ekimi Öncesi/Sonrası",
    description: "Yüz hatlarını belirginleştiren ve estetik bir görünüm kazandıran sakal ekimi sonuçlarımız.",
    items: [
      {
        id: 1,
        beforeImage: "/images/gallery/beard-before-1.jpg",
        afterImage: "/images/gallery/beard-after-1.jpg",
        description: "3 ay sonrası sonuç",
        patientDetails: {
          age: "28",
          gender: "Erkek",
          problemArea: "Yanak ve çene bölgesi",
          diagnosis: "Partial beard loss"
        },
        procedureDetails: {
          technique: "DHI",
          grafts: "2500",
          duration: "5 saat",
          anesthesia: "Lokal anestezi",
          recoveryTime: "4 ay"
        },
        results: {
          satisfaction: "Çok memnun",
          density: "40 grafs/cm²",
          survivalRate: "90%",
          naturalness: "Doğal görünüm",
          finalResult: "Doğal ve sık sakal görünümü"
        },
        testimonial: "Beklentilerimin üzerinde bir sonuç aldım. Çok teşekkür ederim.",
        doctorNote: "Hasta memnuniyetini en üst düzeyde tutarak doğal bir sakal görünümü elde edildi."
      }
    ]
  },
  {
    category: "kas-ekimi",
    title: "Kaş Ekimi Öncesi/Sonrası",
    description: "Yüz ifadesini güzelleştiren ve daha etkileyici bir görünüm sağlayan kaş ekimi sonuçlarımız.",
    items: [
      {
        id: 1,
        beforeImage: "/images/gallery/eyebrow-before-1.jpg",
        afterImage: "/images/gallery/eyebrow-after-1.jpg",
        description: "4 ay sonrası sonuç",
        patientDetails: {
          age: "32",
          gender: "Kadın",
          problemArea: "Seyrek kaşlar",
          diagnosis: "Sparse eyebrows"
        },
        procedureDetails: {
          technique: "DHI",
          grafts: "350",
          duration: "2 saat",
          anesthesia: "Lokal anestezi",
          recoveryTime: "3 ay"
        },
        results: {
          satisfaction: "Çok memnun",
          density: "30 grafs/cm²",
          survivalRate: "98%",
          naturalness: "Doğal görünüm",
          finalResult: "Doğal ve kalın kaşlar"
        },
        testimonial: "Kaşlarımın dolgunluğu ve doğal görünümü beni çok mutlu etti.",
        doctorNote: "Hasta isteği doğrultusunda doğal ve simetrik bir kaş tasarımı oluşturuldu."
      }
    ]
  }
];

export default function Gallery() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Metadata
        title="Saç Ekimi, Sakal Ekimi ve Kaş Ekimi Hasta Sonuçları | Hair Clinic Tiflis"
        description="Profesyonel saç ekimi kliniğimizde gerçekleştirilen saç ekimi, sakal ekimi ve kaş ekimi operasyonlarının öncesi ve sonrası hasta sonuçları. Modern teknoloji ve uzman kadromuzla doğal ve kalıcı sonuçlar elde ediyoruz."
        keywords="saç ekimi öncesi sonrası, sakal ekimi öncesi sonrası, kaş ekimi öncesi sonrası, saç ekimi hasta yorumları, sakal ekimi hasta yorumları, kaş ekimi hasta yorumları, tiflis saç ekimi sonuçları, saç ekimi başarı oranı"
      />

      <section className="relative overflow-hidden py-8 md:py-16">
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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
              Hasta Sonuçlarımız
            </h1>
            <p className="text-sm md:text-base text-gray-600 mb-4 md:mb-6">
              Gerçek hasta sonuçlarımız ve öncesi/sonrası fotoğraflarımızı inceleyin.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4 text-xs md:text-sm text-gray-500">
              <div className="flex items-center gap-1 md:gap-2 bg-white/50 p-2 rounded-full">
                <CheckCircle className="h-3 w-3 md:h-4 md:w-4 text-green-500" />
                <span>%98 Memnuniyet</span>
              </div>
              <div className="flex items-center gap-1 md:gap-2 bg-white/50 p-2 rounded-full">
                <Users className="h-3 w-3 md:h-4 md:w-4 text-blue-500" />
                <span>10.000+ Operasyon</span>
              </div>
              <div className="flex items-center gap-1 md:gap-2 bg-white/50 p-2 rounded-full">
                <Star className="h-3 w-3 md:h-4 md:w-4 text-yellow-500" />
                <span>9.8/10 Puan</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="sac-ekimi" className="w-full">
          <TabsList className="flex justify-center mb-6 md:mb-8 overflow-x-auto">
            {galleryItems.map((category) => (
              <TabsTrigger 
                key={category.category} 
                value={category.category}
                className="text-sm whitespace-nowrap"
              >
                {category.title}
              </TabsTrigger>
            ))}
          </TabsList>

          {galleryItems.map((category) => (
            <TabsContent key={category.category} value={category.category}>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="mb-6"
              >
                <h2 className="text-xl md:text-2xl font-bold mb-2">{category.title}</h2>
                <p className="text-sm md:text-base text-gray-600">{category.description}</p>
              </motion.div>

              <div className="grid gap-8">
                {category.items.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="p-4 bg-gradient-to-r from-primary/5 to-transparent">
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg md:text-xl font-bold">{item.description}</h3>
                          <Badge variant="secondary" className="text-primary text-xs">
                            {item.procedureDetails.technique}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-1">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8">
                                  <Share2 className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Sonucu Paylaş</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8">
                                  <Info className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Detaylı Bilgi</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </div>
                    </div>

                    <BeforeAfterSlider
                      beforeImage={item.beforeImage}
                      afterImage={item.afterImage}
                    />

                    <div className="p-4">
                      <Accordion type="single" collapsible className="space-y-2">
                        <AccordionItem value="patient-details">
                          <AccordionTrigger className="text-sm py-2">
                            <div className="flex items-center gap-2">
                              <Users className="h-4 w-4 text-primary" />
                              <span>Hasta Bilgileri</span>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="grid grid-cols-2 gap-2 text-xs md:text-sm">
                              {Object.entries(item.patientDetails).map(([key, value]) => (
                                <div key={key} className="p-2 rounded bg-gray-50">
                                  <span className="font-medium">{key}:</span>
                                  <span className="ml-1">{value}</span>
                                </div>
                              ))}
                            </div>
                          </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="procedure-details">
                          <AccordionTrigger className="text-sm py-2">
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-primary" />
                              <span>İşlem Detayları</span>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="grid grid-cols-2 gap-2 text-xs md:text-sm">
                              {Object.entries(item.procedureDetails).map(([key, value]) => (
                                <div key={key} className="p-2 rounded bg-gray-50">
                                  <span className="font-medium">{key}:</span>
                                  <span className="ml-1">{value}</span>
                                </div>
                              ))}
                            </div>
                          </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="results">
                          <AccordionTrigger className="text-sm py-2">
                            <div className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-primary" />
                              <span>Sonuçlar</span>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="grid grid-cols-2 gap-2 text-xs md:text-sm">
                              {Object.entries(item.results).map(([key, value]) => (
                                <div key={key} className="p-2 rounded bg-gray-50">
                                  <span className="font-medium">{key}:</span>
                                  <span className="ml-1">{value}</span>
                                </div>
                              ))}
                            </div>
                          </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="testimonial">
                          <AccordionTrigger className="text-sm py-2">
                            <div className="flex items-center gap-2">
                              <Star className="h-4 w-4 text-primary" />
                              <span>Hasta Yorumu</span>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent>
                            <p className="text-xs md:text-sm text-gray-600 italic">"{item.testimonial}"</p>
                            <div className="mt-2 pt-2 border-t">
                              <p className="text-xs md:text-sm text-gray-600">
                                <span className="font-medium">Doktor Notu:</span> {item.doctorNote}
                              </p>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-8 text-center">
                <Button
                  variant="outline"
                  size="lg"
                  className="group text-sm w-full md:w-auto"
                  asChild
                >
                  <Link href="/randevu">
                    <span>Ücretsiz Danışmanlık Alın</span>
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}