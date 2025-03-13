import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import type { Appointment } from "@shared/schema";

export default function AdminDashboard() {
  const { data: appointments, isLoading } = useQuery<Appointment[]>({
    queryKey: ["/api/appointments"],
  });

  const todayAppointments = appointments?.filter(
    (apt) => new Date(apt.date).toDateString() === new Date().toDateString()
  );

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Yönetim Paneli</h1>
          <Link href="/admin/hastalar">
            <Button>Hasta Listesi</Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Bugünkü Randevular</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{todayAppointments?.length || 0}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Toplam Randevu</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{appointments?.length || 0}</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Son Randevular</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div>Yükleniyor...</div>
            ) : (
              <div className="space-y-4">
                {appointments?.slice(0, 5).map((appointment) => (
                  <div
                    key={appointment.id}
                    className="flex justify-between items-center p-4 border rounded-lg"
                  >
                    <div>
                      <p className="font-semibold">
                        {new Date(appointment.date).toLocaleDateString("tr-TR")}
                      </p>
                      <p className="text-sm text-gray-600">
                        ID: {appointment.patientId}
                      </p>
                    </div>
                    <div>
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        appointment.status === "confirmed"
                          ? "bg-green-100 text-green-800"
                          : appointment.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}>
                        {appointment.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
