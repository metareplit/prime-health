import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import AppointmentForm from "@/components/appointments/appointment-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Service } from "@shared/schema";

export default function Appointment() {
  const [location] = useLocation();
  const searchParams = new URLSearchParams(location.split("?")[1]);
  const serviceSlug = searchParams.get("service");

  const { data: services } = useQuery<Service[]>({
    queryKey: ["/api/services"],
  });

  const selectedService = services?.find(s => s.slug === serviceSlug);

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-12">
          Randevu Oluştur
        </h1>

        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>
                {selectedService ? `${selectedService.name} Randevusu` : "Yeni Randevu"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <AppointmentForm selectedService={selectedService} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
