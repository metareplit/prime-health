import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Metadata } from "@/components/ui/metadata";
import BeforeAfterSlider from "@/components/gallery/before-after-slider";

const galleryItems = [
  {
    category: "sac-ekimi",
    title: "Saç Ekimi Öncesi/Sonrası",
    items: [
      {
        id: 1,
        beforeImage: "/images/gallery/hair-before-1.jpg",
        afterImage: "/images/gallery/hair-after-1.jpg",
        description: "6 ay sonrası sonuç",
        age: "35",
        gender: "Erkek",
        grafts: "4500",
        technique: "Safir FUE",
        problemArea: "Ön saç çizgisi ve tepe bölgesi",
        satisfaction: "Çok memnun",
        recoveryTime: "12 ay",
        finalResult: "Doğal ve sık görünüm"
      },
      {
        id: 2,
        beforeImage: "/images/gallery/hair-before-2.jpg",
        afterImage: "/images/gallery/hair-after-2.jpg",
        description: "8 ay sonrası sonuç",
        age: "42",
        gender: "Erkek",
        grafts: "3800",
        technique: "DHI",
        problemArea: "Tepe bölgesi",
        satisfaction: "Memnun",
        recoveryTime: "10 ay",
        finalResult: "Yoğun ve doğal görünüm"
      }
    ]
  },
  {
    category: "sakal-ekimi",
    title: "Sakal Ekimi Öncesi/Sonrası",
    items: [
      {
        id: 1,
        beforeImage: "/images/gallery/beard-before-1.jpg",
        afterImage: "/images/gallery/beard-after-1.jpg",
        description: "3 ay sonrası sonuç",
        age: "28",
        gender: "Erkek",
        grafts: "2500",
        technique: "DHI",
        problemArea: "Yanak ve çene bölgesi",
        satisfaction: "Çok memnun",
        recoveryTime: "4 ay",
        finalResult: "Doğal ve sık sakal görünümü"
      }
    ]
  },
  {
    category: "kas-ekimi",
    title: "Kaş Ekimi Öncesi/Sonrası",
    items: [
      {
        id: 1,
        beforeImage: "/images/gallery/eyebrow-before-1.jpg",
        afterImage: "/images/gallery/eyebrow-after-1.jpg",
        description: "4 ay sonrası sonuç",
        age: "32",
        gender: "Kadın",
        grafts: "350",
        technique: "DHI",
        problemArea: "Seyrek kaşlar",
        satisfaction: "Çok memnun",
        recoveryTime: "3 ay",
        finalResult: "Doğal ve kalın kaşlar"
      }
    ]
  }
];

export default function Gallery() {
  return (
    <div className="min-h-screen">
      <Metadata
        title="Saç Ekimi Öncesi ve Sonrası Galeri | Hair Clinic Tiflis"
        description="Saç ekimi, sakal ekimi ve kaş ekimi öncesi ve sonrası fotoğraflar. Gerçek hasta sonuçlarımızı inceleyin."
        keywords="saç ekimi öncesi sonrası, sakal ekimi öncesi sonrası, saç ekimi sonuçları, tiflis saç ekimi sonuçları"
      />

      <section className="bg-gradient-to-b from-primary/5 to-transparent py-16">
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
              Gerçek hasta sonuçlarımızı inceleyin. Her hasta için özel planlama ve en uygun teknik kullanılmıştır.
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
              <div className="grid gap-16">
                {category.items.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white rounded-lg shadow-lg overflow-hidden"
                  >
                    <BeforeAfterSlider
                      beforeImage={item.beforeImage}
                      afterImage={item.afterImage}
                    />
                    <div className="p-8">
                      <h3 className="text-2xl font-bold mb-4">{item.description}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="space-y-4">
                          <h4 className="font-semibold text-primary">Hasta Bilgileri</h4>
                          <div className="space-y-2">
                            <p><span className="font-medium">Yaş:</span> {item.age}</p>
                            <p><span className="font-medium">Cinsiyet:</span> {item.gender}</p>
                            <p><span className="font-medium">Problem Bölge:</span> {item.problemArea}</p>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <h4 className="font-semibold text-primary">İşlem Detayları</h4>
                          <div className="space-y-2">
                            <p><span className="font-medium">Greft Sayısı:</span> {item.grafts}</p>
                            <p><span className="font-medium">Teknik:</span> {item.technique}</p>
                            <p><span className="font-medium">İyileşme Süresi:</span> {item.recoveryTime}</p>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <h4 className="font-semibold text-primary">Sonuç</h4>
                          <div className="space-y-2">
                            <p><span className="font-medium">Memnuniyet:</span> {item.satisfaction}</p>
                            <p><span className="font-medium">Final Görünüm:</span> {item.finalResult}</p>
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
      </div>
    </div>
  );
}