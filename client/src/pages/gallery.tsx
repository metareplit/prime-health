import { useState } from "react";
import { motion } from "framer-motion";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Star, Share2, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { Metadata } from "@/components/ui/metadata";

import BeforeAfterSlider from "@/components/gallery/before-after-slider";
import ThreeDComparison from "@/components/gallery/three-d-comparison";
import { SuccessStories } from "@/components/gallery/success-stories";

// Galeri öğeleri veri yapısı
const galleryItems = [
  {
    category: "sac-ekimi",
    title: "Saç Ekimi Sonuçları",
    description: "DHI ve Safir FUE teknikleriyle gerçekleştirilen saç ekimi operasyonlarının etkileyici sonuçları",
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
    title: "Sakal Ekimi Sonuçları",
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
    title: "Kaş Ekimi Sonuçları",
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
  const [selectedCase, setSelectedCase] = useState(null);
  const [show3D, setShow3D] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Metadata
        title="Hasta Sonuçları Galerisi | Hair Clinic Tiflis"
        description="Profesyonel saç ekimi kliniğimizde gerçekleştirilen operasyonların öncesi ve sonrası sonuçları. Modern teknoloji ve uzman kadromuzla doğal ve kalıcı sonuçlar."
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
              Hasta Sonuçlarımız
            </h1>
            <p className="text-sm md:text-base text-gray-600 mb-6">
              Uzman ekibimiz tarafından gerçekleştirilen operasyonların öncesi ve sonrası görüntüleri
            </p>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        {/* Kategoriler ve Sonuçlar */}
        <Tabs defaultValue="sac-ekimi" className="w-full">
          <TabsList className="flex justify-center mb-8 overflow-x-auto">
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {category.items.map((item) => (
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
          ))}
        </Tabs>

        {/* Başarı Hikayeleri */}
        <SuccessStories />
      </div>

      {/* Detay Modal */}
      <Dialog open={!!selectedCase} onOpenChange={() => setSelectedCase(null)}>
        <DialogContent className="max-w-4xl w-full">
          <ScrollArea className="max-h-[80vh]">
            {selectedCase && (
              <div className="space-y-6">
                {/* 3D/2D Görünüm Geçişi */}
                <div className="flex justify-end mb-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShow3D(!show3D)}
                  >
                    {show3D ? "2D Görünüm" : "3D Görünüm"}
                  </Button>
                </div>

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

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Sol Kolon */}
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Hasta Bilgileri</h3>
                      <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                        {Object.entries(selectedCase.patientDetails).map(([key, value]) => (
                          <div key={key} className="flex justify-between text-sm">
                            <span className="text-gray-600">{key}</span>
                            <span className="font-medium">{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-2">İşlem Detayları</h3>
                      <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                        {Object.entries(selectedCase.procedureDetails).map(([key, value]) => (
                          <div key={key} className="flex justify-between text-sm">
                            <span className="text-gray-600">{key}</span>
                            <span className="font-medium">{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Sağ Kolon */}
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Sonuçlar</h3>
                      <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                        {Object.entries(selectedCase.results).map(([key, value]) => (
                          <div key={key} className="flex justify-between text-sm">
                            <span className="text-gray-600">{key}</span>
                            <span className="font-medium">{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-2">Hasta Yorumu</h3>
                      <div className="bg-primary/5 rounded-lg p-4">
                        <p className="text-sm italic text-gray-600">"{selectedCase.testimonial}"</p>
                        <div className="mt-4 pt-4 border-t">
                          <h4 className="font-medium mb-2">Doktor Notu:</h4>
                          <p className="text-sm text-gray-600">{selectedCase.doctorNote}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Share2 className="h-4 w-4" />
                    Paylaş
                  </Button>
                  <Button asChild>
                    <Link href="/randevu" className="gap-2">
                      Danışmanlık Al
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
}