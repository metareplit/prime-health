import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Metadata } from "@/components/ui/metadata";
import BeforeAfterSlider from "@/components/gallery/before-after-slider";
import { Badge } from "@/components/ui/badge";
import { Clock, Star, Users, CheckCircle } from "lucide-react";

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
        title="Hasta Sonuçları ve Öncesi/Sonrası Görseller | Hair Clinic Tiflis"
        description="Saç ekimi, sakal ekimi ve kaş ekimi öncesi ve sonrası hasta sonuçlarımız. Gerçek hasta deneyimleri ve profesyonel sonuçlarımızı inceleyin."
        keywords="saç ekimi öncesi sonrası, sakal ekimi öncesi sonrası, hasta sonuçları, tiflis saç ekimi sonuçları, öncesi sonrası fotoğraflar"
      />

      <section className="relative overflow-hidden py-16">
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
            <h1 className="text-3xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
              Hasta Sonuçları Galerisi
            </h1>
            <p className="text-lg text-gray-600">
              Gerçek hasta sonuçlarımız ve profesyonel öncesi/sonrası fotoğraflarımızı inceleyin. Her hasta için özel planlama ve en uygun teknik kullanılmıştır.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <Tabs defaultValue="sac-ekimi" className="w-full">
          <TabsList className="flex justify-center mb-8">
            <TabsTrigger value="sac-ekimi">Saç Ekimi</TabsTrigger>
            <TabsTrigger value="sakal-ekimi">Sakal Ekimi</TabsTrigger>
            <TabsTrigger value="kas-ekimi">Kaş Ekimi</TabsTrigger>
          </TabsList>

          {galleryItems.map((category) => (
            <TabsContent key={category.category} value={category.category}>
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-2">{category.title}</h2>
                <p className="text-gray-600">{category.description}</p>
              </div>

              <div className="grid gap-16">
                {category.items.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white rounded-xl shadow-lg overflow-hidden"
                  >
                    <div className="p-6 bg-gradient-to-r from-primary/5 to-transparent">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-2xl font-bold">{item.description}</h3>
                        <Badge variant="secondary" className="text-primary">
                          {item.procedureDetails.technique}
                        </Badge>
                      </div>
                    </div>

                    <BeforeAfterSlider
                      beforeImage={item.beforeImage}
                      afterImage={item.afterImage}
                    />

                    <div className="p-8">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="space-y-4">
                          <h4 className="text-lg font-semibold flex items-center gap-2 text-primary">
                            <Users className="h-5 w-5" />
                            Hasta Bilgileri
                          </h4>
                          <div className="space-y-2 text-sm">
                            {Object.entries(item.patientDetails).map(([key, value]) => (
                              <div key={key} className="flex justify-between items-center p-2 rounded bg-gray-50">
                                <span className="font-medium">{key.charAt(0).toUpperCase() + key.slice(1)}:</span>
                                <span>{value}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-4">
                          <h4 className="text-lg font-semibold flex items-center gap-2 text-primary">
                            <Clock className="h-5 w-5" />
                            İşlem Detayları
                          </h4>
                          <div className="space-y-2 text-sm">
                            {Object.entries(item.procedureDetails).map(([key, value]) => (
                              <div key={key} className="flex justify-between items-center p-2 rounded bg-gray-50">
                                <span className="font-medium">{key.charAt(0).toUpperCase() + key.slice(1)}:</span>
                                <span>{value}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-4">
                          <h4 className="text-lg font-semibold flex items-center gap-2 text-primary">
                            <CheckCircle className="h-5 w-5" />
                            Sonuçlar
                          </h4>
                          <div className="space-y-2 text-sm">
                            {Object.entries(item.results).map(([key, value]) => (
                              <div key={key} className="flex justify-between items-center p-2 rounded bg-gray-50">
                                <span className="font-medium">{key.charAt(0).toUpperCase() + key.slice(1)}:</span>
                                <span>{value}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="mt-8 p-6 bg-primary/5 rounded-lg">
                        <div className="mb-4">
                          <h4 className="text-lg font-semibold flex items-center gap-2 text-primary mb-2">
                            <Star className="h-5 w-5" />
                            Hasta Yorumu
                          </h4>
                          <p className="text-gray-600 italic">"{item.testimonial}"</p>
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold flex items-center gap-2 text-primary mb-2">
                            <CheckCircle className="h-5 w-5" />
                            Doktor Notu
                          </h4>
                          <p className="text-gray-600">{item.doctorNote}</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}