import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import type { Service } from "@shared/schema";

export default function Services() {
  const { data: services, isLoading } = useQuery<Service[]>({
    queryKey: ["/api/services"],
  });

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-12">Hizmetlerimiz</h1>

        {isLoading ? (
          <div className="grid gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 bg-gray-100 animate-pulse rounded-lg" />
            ))}
          </div>
        ) : (
          <div className="grid gap-8">
            {services?.map((service) => (
              <Card key={service.id} id={service.slug} className="overflow-hidden">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="aspect-video">
                    <img
                      src={service.imageUrl}
                      alt={service.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <CardHeader>
                      <CardTitle className="text-2xl">{service.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-6">{service.description}</p>
                      <Link href={`/randevu?service=${service.slug}`}>
                        <Button>Randevu Al</Button>
                      </Link>
                    </CardContent>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
