import { useQuery } from "@tanstack/react-query";
import ServiceCard from "@/components/services/service-card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import HeroSlider from "@/components/home/hero-slider";
import { motion } from "framer-motion";
import { Shield, Users, Stethoscope, Clock, Award, HeartHandshake, Building2, Map, ArrowRight, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge"; // Added import for Badge


const features = [
  {
    icon: <Shield className="h-8 w-8 text-primary" />,
    title: "Güvenilir Hizmet",
    description: "10 yılı aşkın deneyim ve binlerce başarılı operasyon"
  },
  {
    icon: <Users className="h-8 w-8 text-primary" />,
    title: "Uzman Kadro",
    description: "Alanında uzman doktorlar ve deneyimli sağlık ekibi"
  },
  {
    icon: <Stethoscope className="h-8 w-8 text-primary" />,
    title: "Modern Teknoloji",
    description: "En son teknoloji ve steril operasyon ortamı"
  },
  {
    icon: <Clock className="h-8 w-8 text-primary" />,
    title: "Hızlı İyileşme",
    description: "Minimal invaziv teknikler ile hızlı iyileşme süreci"
  },
  {
    icon: <Award className="h-8 w-8 text-primary" />,
    title: "Garantili Sonuç",
    description: "Yüksek hasta memnuniyeti ve garantili sonuçlar"
  },
  {
    icon: <HeartHandshake className="h-8 w-8 text-primary" />,
    title: "Kişisel Yaklaşım",
    description: "Her hastaya özel tasarlanmış tedavi planı"
  },
  {
    icon: <Building2 className="h-8 w-8 text-primary" />,
    title: "Modern Klinik",
    description: "Tam donanımlı, konforlu klinik ortamı"
  },
  {
    icon: <Map className="h-8 w-8 text-primary" />,
    title: "Merkezi Konum",
    description: "Tiflis'in merkezinde kolay ulaşılabilir lokasyon"
  }
];

export default function Home() {
  const { data: services, isLoading } = useQuery({
    queryKey: ["/api/services"],
  });

  return (
    <div>
      {/* Hero Section with Slider */}
      <HeroSlider />

      {/* Why Choose Us Section */}
      <section className="py-20 bg-gradient-to-b from-primary/5 to-transparent">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Neden Bizi Tercih Etmelisiniz?
            </h2>
            <p className="text-lg text-gray-600">
              Yılların deneyimi, modern teknoloji ve uzman kadromuzla
              sizlere en iyi hizmeti sunuyoruz
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <div className="mb-4 inline-block p-3 bg-primary/10 rounded-lg">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-gradient-to-b from-white to-primary/5">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Profesyonel Hizmetlerimiz
            </h2>
            <p className="text-lg text-gray-600">
              Modern teknoloji ve uzman kadromuzla size özel çözümler sunuyoruz
            </p>
          </motion.div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-[400px] bg-gray-100 animate-pulse rounded-xl"
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {services?.map((service, index) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="group relative bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
                >
                  {/* Service Image */}
                  <div className="relative h-48 overflow-hidden">
                    <div
                      className="absolute inset-0 bg-cover bg-center transform group-hover:scale-110 transition-transform duration-500"
                      style={{ backgroundImage: `url(${service.imageUrl})` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-4 left-4">
                      <Badge className="bg-white/90 text-primary hover:bg-white">
                        {service.category}
                      </Badge>
                    </div>
                  </div>

                  {/* Service Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-3">{service.name}</h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {service.description}
                    </p>

                    {/* Service Features */}
                    <div className="space-y-2 mb-6">
                      {service.features?.slice(0, 3).map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                          <CheckCircle className="h-4 w-4 text-primary" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>

                    {/* Action Button */}
                    <div className="pt-4 border-t">
                      <Link href={`/hizmetler/${service.slug}`}>
                        <Button
                          variant="ghost"
                          className="w-full group/btn hover:bg-primary hover:text-white"
                        >
                          <span>Detaylı Bilgi</span>
                          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}