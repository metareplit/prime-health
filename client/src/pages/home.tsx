import { useQuery } from "@tanstack/react-query";
import ServiceCard from "@/components/services/service-card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import HeroSlider from "@/components/home/hero-slider";
import { motion } from "framer-motion";
import { Shield, Users, Stethoscope, Clock, Award, HeartHandshake, Building2, Map } from "lucide-react";

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
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Hizmetlerimiz
          </h2>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-64 bg-gray-100 animate-pulse rounded-lg" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {services?.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}