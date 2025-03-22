import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Calendar, Clock, CheckCircle, XCircle } from "lucide-react";
import type { Appointment } from "@shared/schema";

export default function PatientAppointments() {
  const { data: appointments } = useQuery<Appointment[]>({
    queryKey: ["/api/appointments"],
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Randevularım</h1>
          <Button asChild>
            <Link href="/randevu">
              <Calendar className="h-4 w-4 mr-2" />
              Yeni Randevu
            </Link>
          </Button>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Yaklaşan Randevular</CardTitle>
          </CardHeader>
          <CardContent>
            {appointments?.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Calendar className="h-12 w-12 mx-auto mb-4 opacity-20" />
                <p>Yaklaşan randevunuz bulunmuyor.</p>
              </div>
            )}

            {appointments?.map((appointment) => (
              <div
                key={appointment.id}
                className="flex items-center justify-between p-4 border-b last:border-0"
              >
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Calendar className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{appointment.type}</p>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Clock className="h-4 w-4" />
                      {new Date(appointment.date).toLocaleDateString()} - {appointment.time}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {appointment.status === "confirmed" ? (
                    <div className="flex items-center text-green-600">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      <span className="text-sm">Onaylandı</span>
                    </div>
                  ) : appointment.status === "pending" ? (
                    <div className="flex items-center text-yellow-600">
                      <Clock className="h-4 w-4 mr-1" />
                      <span className="text-sm">Beklemede</span>
                    </div>
                  ) : (
                    <div className="flex items-center text-red-600">
                      <XCircle className="h-4 w-4 mr-1" />
                      <span className="text-sm">İptal Edildi</span>
                    </div>
                  )}
                  <Button variant="outline" size="sm">
                    Detaylar
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
