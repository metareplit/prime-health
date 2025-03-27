import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Star, ArrowRight, Camera, Users, Clock } from "lucide-react";
import { Link } from "wouter";
import { Metadata } from "@/components/ui/metadata";
import { useTranslation } from "react-i18next";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

import BeforeAfterSlider from "@/components/gallery/before-after-slider";
import { SuccessStories } from "@/components/gallery/success-stories";
import { ClinicGallery } from "@/components/gallery/clinic-gallery";
import { ClinicVideos } from "@/components/gallery/clinic-videos";

// Define case interface
interface Case {
  id: number;
  beforeImage: string;
  afterImage: string;
  description: string;
  procedureDetails: {
    technique: string;
    duration: string;
  };
  results: {
    satisfaction: string;
  };
}

// Category icons with proper type
const categoryIcons: Record<string, JSX.Element> = {
  "sac-ekimi": <Camera className="h-4 w-4" />,
  "sakal-ekimi": <Users className="h-4 w-4" />,
  "kas-ekimi": <Clock className="h-4 w-4" />
};

export default function Gallery() {
  const { t } = useTranslation('common');

  // Galeri öğeleri - t fonksiyonu burada kullanılabilir
  const items = [
    {
      id: 1,
      beforeImage: "/images/before-after/IMG-20250325-WA0087.jpg",
      afterImage: "/images/before-after/IMG-20250325-WA0083.jpg",
      description: t('gallery.caseDescriptions.sixMonthResult'),
      procedureDetails: {
        technique: t('gallery.techniques.safirFUE'),
        duration: t('gallery.durations.eightHours')
      },
      results: {
        satisfaction: t('gallery.satisfactions.verySatisfied')
      }
    },
    {
      id: 2,
      beforeImage: "/images/before-after/IMG-20250325-WA0060.jpg",
      afterImage: "/images/before-after/IMG-20250325-WA0059.jpg",
      description: t('gallery.caseDescriptions.eightMonthResult'),
      procedureDetails: {
        technique: t('gallery.techniques.dhi'),
        duration: t('gallery.durations.sevenHours')
      },
      results: {
        satisfaction: t('gallery.satisfactions.satisfied')
      }
    },
    {
      id: 3,
      beforeImage: "/images/before-after/IMG-20250325-WA0062.jpg",
      afterImage: "/images/before-after/IMG-20250325-WA0061.jpg",
      description: t('gallery.caseDescriptions.twelveMonthResult'),
      procedureDetails: {
        technique: t('gallery.techniques.safirFUE'),
        duration: t('gallery.durations.sixHours')
      },
      results: {
        satisfaction: t('gallery.satisfactions.extremelySatisfied')
      }
    },
    {
      id: 4,
      beforeImage: "/images/before-after/IMG-20250325-WA0064.jpg",
      afterImage: "/images/before-after/IMG-20250325-WA0063.jpg",
      description: t('gallery.caseDescriptions.fourMonthResult'),
      procedureDetails: {
        technique: t('gallery.techniques.safirFUE'),
        duration: t('gallery.durations.sixHours')
      },
      results: {
        satisfaction: t('gallery.satisfactions.extremelySatisfied')
      }
    },
    {
      id: 5,
      beforeImage: "/images/before-after/IMG-20250325-WA0046.jpg",
      afterImage: "/images/before-after/IMG-20250325-WA0065.jpg",
      description: t('gallery.caseDescriptions.nineMonthResult'),
      procedureDetails: {
        technique: t('gallery.techniques.dhi'),
        duration: t('gallery.durations.fiveHours')
      },
      results: {
        satisfaction: t('gallery.satisfactions.verySatisfied')
      }
    },
    {
      id: 6,
      beforeImage: "/images/before-after/IMG-20250325-WA0048.jpg",
      afterImage: "/images/before-after/IMG-20250325-WA0047.jpg",
      description: t('gallery.caseDescriptions.tenMonthResult'),
      procedureDetails: {
        technique: t('gallery.techniques.safirFUE'),
        duration: t('gallery.durations.sevenHours')
      },
      results: {
        satisfaction: t('gallery.satisfactions.verySatisfied')
      }
    }
  ];

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
              {t('gallery.tabs.beforeAfter')}
            </TabsTrigger>
            <TabsTrigger
              value="klinik"
              className="relative rounded-full px-6 py-2 text-sm font-medium transition-all data-[state=active]:bg-primary data-[state=active]:text-white"
            >
              {t('gallery.tabs.clinic')}
            </TabsTrigger>
            <TabsTrigger
              value="videolar"
              className="relative rounded-full px-6 py-2 text-sm font-medium transition-all data-[state=active]:bg-primary data-[state=active]:text-white"
            >
              {t('gallery.tabs.videos')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="oncesi-sonrasi">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="group"
                >
                  <Card className="overflow-hidden hover:shadow-md transition-all duration-300">
                    <CardHeader className="p-0">
                      <div className="relative aspect-[4/3]">
                        <BeforeAfterSlider
                          beforeImage={item.beforeImage}
                          afterImage={item.afterImage}
                        />
                      </div>
                    </CardHeader>
                    <CardContent className="p-4">
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
                    </CardContent>
                    <CardFooter className="px-4 pb-4 pt-0">
                      <Button asChild size="sm" className="w-full gap-2">
                        <Link href="/randevu">
                          {t('gallery.buttons.consult')}
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="klinik">
            <ClinicGallery />
          </TabsContent>

          <TabsContent value="videolar">
            <ClinicVideos />
          </TabsContent>
        </Tabs>

        {/* Başarı Hikayeleri */}
        <SuccessStories />
      </div>

      {/* Modal artık yok - öğeler doğrudan sayfada görüntüleniyor */}
    </div>
  );
}

// Bu fonksiyon artık kullanılmıyor ve kaldırıldı