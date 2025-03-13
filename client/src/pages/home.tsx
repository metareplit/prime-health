import { useQuery } from "@tanstack/react-query";
import ServiceCard from "@/components/services/service-card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function Home() {
  const { data: services, isLoading } = useQuery({
    queryKey: ["/api/services"],
  });

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-primary/5 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Profesyonel Saç Ekimi Kliniği
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Gürcistan Tiflis'te en son teknoloji ve uzman kadromuzla
              hizmetinizdeyiz
            </p>
            <Link href="/randevu">
              <Button size="lg">Hemen Randevu Alın</Button>
            </Link>
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

      {/* Why Choose Us Section */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Neden Biz?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <h3 className="text-xl font-bold mb-4">Uzman Kadro</h3>
              <p className="text-gray-600">
                Deneyimli ve uzman doktorlarımızla en iyi sonucu alın
              </p>
            </div>
            
            <div className="text-center">
              <h3 className="text-xl font-bold mb-4">Modern Teknoloji</h3>
              <p className="text-gray-600">
                En son teknoloji ve ekipmanlarla kaliteli hizmet
              </p>
            </div>
            
            <div className="text-center">
              <h3 className="text-xl font-bold mb-4">Garantili Sonuç</h3>
              <p className="text-gray-600">
                Memnuniyet garantili saç ekimi hizmeti
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
