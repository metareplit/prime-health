import { useState } from "react";
import { motion } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar, Star, Share2, ArrowRight, Camera, Users, Clock, CheckCircle } from "lucide-react";
import { Link } from "wouter";
import { Metadata } from "@/components/ui/metadata";
import { useTranslation } from "react-i18next";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

import BeforeAfterSlider from "@/components/gallery/before-after-slider";
import ThreeDComparison from "@/components/gallery/three-d-comparison";
import { SuccessStories } from "@/components/gallery/success-stories";
import { ClinicGallery } from "@/components/gallery/clinic-gallery";

// Define case interface
interface Case {
  id: number;
  beforeImage: string;
  afterImage: string;
  description: string;
  patientDetails: Record<string, string>;
  procedureDetails: {
    technique: string;
    grafts?: string;
    duration: string;
    anesthesia: string;
    recoveryTime: string;
  };
  results: Record<string, string>;
  testimonial: string;
  doctorNote: string;
}

// Category icons with proper type
const categoryIcons: Record<string, JSX.Element> = {
  "sac-ekimi": <Camera className="h-4 w-4" />,
  "sakal-ekimi": <Users className="h-4 w-4" />,
  "kas-ekimi": <Clock className="h-4 w-4" />
};

export default function Gallery() {
  const [selectedCase, setSelectedCase] = useState<Case | null>(null);
  const [show3D, setShow3D] = useState(false);
  const { t } = useTranslation('common');

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Metadata
        title={t('gallery.title')}
        description={t('gallery.subtitle')}
        keywords="saç ekimi öncesi sonrası, sakal ekimi sonuçları, kaş ekimi sonuçları, hasta yorumları, tiflis saç ekimi"
      />

      {/* Hero Section */}
      <section className="relative overflow-hidden py-8 md:py-12">
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
              {t('gallery.title')}
            </h1>
            <p className="text-sm md:text-base text-gray-600 mb-6">
              {t('gallery.subtitle')}
            </p>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        {/* Kategoriler ve Sonuçlar */}
        <Tabs defaultValue="oncesi-sonrasi" className="w-full">
          <TabsList className="relative flex justify-center mb-8 p-1 bg-white rounded-full shadow-sm border overflow-x-auto">
            <TabsTrigger
              value="oncesi-sonrasi"
              className="relative rounded-full px-6 py-2 text-sm font-medium transition-all data-[state=active]:bg-primary data-[state=active]:text-white"
            >
              Öncesi ve Sonrası
            </TabsTrigger>
            <TabsTrigger
              value="klinik"
              className="relative rounded-full px-6 py-2 text-sm font-medium transition-all data-[state=active]:bg-primary data-[state=active]:text-white"
            >
              Klinik Görselleri
            </TabsTrigger>
          </TabsList>

          <TabsContent value="oncesi-sonrasi">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {galleryItems.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="group cursor-pointer"
                  onClick={() => setSelectedCase(item)}
                >
                  <div className="relative overflow-hidden rounded-xl bg-white shadow-sm hover:shadow-md transition-all duration-300">
                    <div className="relative aspect-[4/3]">
                      <BeforeAfterSlider
                        beforeImage={item.beforeImage}
                        afterImage={item.afterImage}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-lg">{item.description}</h3>
                        <Badge variant="secondary" className="text-xs">
                          {item.procedureDetails.technique}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>{item.procedureDetails.duration}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-500" />
                          <span>{item.results.satisfaction}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="klinik">
            <ClinicGallery />
          </TabsContent>
        </Tabs>

        {/* Başarı Hikayeleri */}
        <SuccessStories />
      </div>

      {/* Detay Modal */}
      {selectedCase && (
        <Dialog open={!!selectedCase} onOpenChange={() => setSelectedCase(null)}>
          <DialogContent className="max-w-4xl w-full p-0">
            <ScrollArea className="max-h-[80vh]">
              <div>
                {/* Modal Header */}
                <DialogHeader className="p-6 bg-gradient-to-r from-primary/5 to-transparent">
                  <div className="flex items-center justify-between">
                    <DialogTitle className="text-2xl font-bold">{selectedCase.description}</DialogTitle>
                    <Badge variant="secondary" className="text-primary">
                      {selectedCase.procedureDetails.technique}
                    </Badge>
                  </div>
                </DialogHeader>

                <div className="p-6 space-y-6">
                  {/* Görsel Karşılaştırma */}
                  <div className="relative">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShow3D(!show3D)}
                      className="absolute top-4 right-4 z-10"
                    >
                      {show3D ? t('gallery.buttons.view2d') : t('gallery.buttons.view3d')}
                    </Button>

                    {show3D ? (
                      <ThreeDComparison
                        beforeImage={selectedCase.beforeImage}
                        afterImage={selectedCase.afterImage}
                      />
                    ) : (
                      <BeforeAfterSlider
                        beforeImage={selectedCase.beforeImage}
                        afterImage={selectedCase.afterImage}
                      />
                    )}
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Sol Kolon */}
                    <div className="space-y-4">
                      <div className="bg-white rounded-xl shadow-sm p-4">
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                          <Users className="h-5 w-5 text-primary" />
                          {t('gallery.patientDetails.title')}
                        </h3>
                        <div className="space-y-2">
                          {Object.entries(selectedCase.patientDetails).map(([key, value]) => (
                            <div key={key} className="flex justify-between items-center py-2 border-b last:border-0">
                              <span className="text-gray-600">{t(`gallery.patientDetails.${key}`)}</span>
                              <span className="font-medium">{value}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="bg-white rounded-xl shadow-sm p-4">
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                          <Clock className="h-5 w-5 text-primary" />
                          {t('gallery.procedureDetails.title')}
                        </h3>
                        <div className="space-y-2">
                          {Object.entries(selectedCase.procedureDetails).map(([key, value]) => (
                            <div key={key} className="flex justify-between items-center py-2 border-b last:border-0">
                              <span className="text-gray-600">{t(`gallery.procedureDetails.${key}`)}</span>
                              <span className="font-medium">{value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Sağ Kolon */}
                    <div className="space-y-4">
                      <div className="bg-white rounded-xl shadow-sm p-4">
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                          <CheckCircle className="h-5 w-5 text-primary" />
                          {t('gallery.results.title')}
                        </h3>
                        <div className="space-y-2">
                          {Object.entries(selectedCase.results).map(([key, value]) => (
                            <div key={key} className="flex justify-between items-center py-2 border-b last:border-0">
                              <span className="text-gray-600">{t(`gallery.results.${key}`)}</span>
                              <span className="font-medium">{value}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="bg-white rounded-xl shadow-sm p-4">
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                          <Star className="h-5 w-5 text-primary" />
                          {t('gallery.testimonial.title')}
                        </h3>
                        <div className="space-y-4">
                          <p className="italic text-gray-600">"{selectedCase.testimonial}"</p>
                          <div className="pt-4 border-t">
                            <h4 className="font-medium mb-2">{t('gallery.doctorNote.title')}:</h4>
                            <p className="text-gray-600">{selectedCase.doctorNote}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Modal Footer */}
                  <div className="flex justify-between items-center pt-4 border-t mt-6">
                    <Button variant="outline" size="sm" className="gap-2">
                      <Share2 className="h-4 w-4" />
                      {t('gallery.buttons.share')}
                    </Button>
                    <Button asChild>
                      <Link href="/randevu" className="gap-2">
                        {t('gallery.buttons.consult')}
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

const galleryItems = [
  {
    category: "sac-ekimi",
    title: "Saç Ekimi Sonuçları",
    description: "DHI ve Safir FUE teknikleriyle gerçekleştirilen saç ekimi operasyonlarının etkileyici sonuçları",
    items: [
      {
        id: 1,
        beforeImage: "https://images.unsplash.com/photo-1582751324471-8417778b8164",
        afterImage: "https://images.unsplash.com/photo-1622286342621-4bd786c2447c",
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
        beforeImage: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70",
        afterImage: "https://images.unsplash.com/photo-1633364428037-497362c84eda",
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
      },
      {
        id: 3,
        beforeImage: "https://images.unsplash.com/photo-1599666433232-2dd6176cfd0f",
        afterImage: "https://images.unsplash.com/photo-1633364449571-a8c4cd7261ed",
        description: "12 ay sonrası sonuç",
        patientDetails: {
          age: "38",
          gender: "Erkek",
          problemArea: "Ön saç çizgisi",
          diagnosis: "Male pattern baldness",
          hairLossStage: "Norwood Scale 3"
        },
        procedureDetails: {
          technique: "Safir FUE",
          grafts: "3200",
          duration: "6 saat",
          anesthesia: "Lokal anestezi",
          recoveryTime: "12 ay"
        },
        results: {
          satisfaction: "Çok memnun",
          density: "52 grafs/cm²",
          survivalRate: "94%",
          naturalness: "Doğal görünüm",
          finalResult: "Mükemmel sonuç"
        },
        testimonial: "Saç ekimi sonrası özgüvenim tamamen yerine geldi. Çok mutluyum.",
        doctorNote: "Doğal saç çizgisi ve optimal greft dağılımı ile başarılı sonuç elde edildi."
      }
    ]
  },
  {
    category: "sakal-ekimi",
    title: "Sakal Ekimi Sonuçları",
    description: "Yüz hatlarını belirginleştiren ve estetik bir görünüm kazandıran sakal ekimi sonuçlarımız",
    items: [
      {
        id: 1,
        beforeImage: "https://images.unsplash.com/photo-1586610724704-aef83d8917f3",
        afterImage: "https://images.unsplash.com/photo-1600845264496-786c8c6a7b50",
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
      },
      {
        id: 2,
        beforeImage: "https://images.unsplash.com/photo-1595152772835-219674b2a8a6",
        afterImage: "https://images.unsplash.com/photo-1597633425046-08f5110420b5",
        description: "4 ay sonrası sonuç",
        patientDetails: {
          age: "32",
          gender: "Erkek",
          problemArea: "Çene ve boyun bölgesi",
          diagnosis: "Sparse beard growth"
        },
        procedureDetails: {
          technique: "FUE",
          grafts: "2200",
          duration: "4 saat",
          anesthesia: "Lokal anestezi",
          recoveryTime: "3 ay"
        },
        results: {
          satisfaction: "Memnun",
          density: "38 grafs/cm²",
          survivalRate: "92%",
          naturalness: "Çok doğal görünüm",
          finalResult: "Dolgun sakal görünümü"
        },
        testimonial: "FUE tekniği ile yapılan sakal ekimi sonrası çok doğal bir görünüm elde ettim.",
        doctorNote: "Simetrik ve doğal görünümlü sakal ekimi başarıyla tamamlandı."
      }
    ]
  },
  {
    category: "kas-ekimi",
    title: "Kaş Ekimi Sonuçları",
    description: "Yüz ifadesini güzelleştiren ve daha etkileyici bir görünüm sağlayan kaş ekimi sonuçlarımız",
    items: [
      {
        id: 1,
        beforeImage: "https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec",
        afterImage: "https://images.unsplash.com/photo-1619764243330-ba31697e8a36",
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
      },
      {
        id: 2,
        beforeImage: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e",
        afterImage: "https://images.unsplash.com/photo-1522337094846-8a992d63659e",
        description: "3 ay sonrası sonuç",
        patientDetails: {
          age: "28",
          gender: "Kadın",
          problemArea: "İnce kaşlar",
          diagnosis: "Thin eyebrows"
        },
        procedureDetails: {
          technique: "DHI",
          grafts: "300",
          duration: "2 saat",
          anesthesia: "Lokal anestezi",
          recoveryTime: "3 ay"
        },
        results: {
          satisfaction: "Çok memnun",
          density: "28 grafs/cm²",
          survivalRate: "95%",
          naturalness: "Doğal görünüm",
          finalResult: "Dolgun ve doğal kaşlar"
        },
        testimonial: "Kaş ekimi sonrası yüz ifadem tamamen değişti, çok mutluyum.",
        doctorNote: "Yüz hatlarıyla uyumlu, doğal görünümlü kaş tasarımı uygulandı."
      }
    ]
  }
];