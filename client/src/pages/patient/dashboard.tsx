import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Calendar,
  MessageSquare,
  Image as ImageIcon,
  User,
  Bell,
  CheckCircle,
  Clock,
} from "lucide-react";
import type { Appointment, Message } from "@shared/schema";
import { Metadata } from "@/components/ui/metadata";

export default function PatientDashboard() {
  const { data: upcomingAppointments } = useQuery<Appointment[]>({
    queryKey: ["/api/appointments/upcoming"],
  });

  const { data: unreadMessages } = useQuery<Message[]>({
    queryKey: ["/api/messages/unread"],
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <Metadata
        title="Hasta Portalı - Kontrol Paneli"
        description="Tedavi sürecinizi takip edin. Randevularınızı yönetin, mesajlarınızı görüntüleyin ve tedavi görsellerinizi yükleyin."
        keywords="hasta portali, randevu takip, tedavi süreci, saç ekimi takip"
        type="website"
      />
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold">Hasta Portalı</h1>
          <p className="text-gray-600 mt-2">
            Hoş geldiniz! Tedavi sürecinizi buradan takip edebilirsiniz.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Link href="/hasta-portali/randevular">
            <a>
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Randevular</CardTitle>
                  <Calendar className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {upcomingAppointments?.length || 0}
                  </div>
                  <p className="text-xs text-gray-600">Yaklaşan Randevu</p>
                </CardContent>
              </Card>
            </a>
          </Link>

          <Link href="/hasta-portali/mesajlar">
            <a>
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Mesajlar</CardTitle>
                  <MessageSquare className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {unreadMessages?.length || 0}
                  </div>
                  <p className="text-xs text-gray-600">Okunmamış Mesaj</p>
                </CardContent>
              </Card>
            </a>
          </Link>

          <Link href="/hasta-portali/gorseller">
            <a>
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Görsellerim</CardTitle>
                  <ImageIcon className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">Yükle</div>
                  <p className="text-xs text-gray-600">Tedavi Görselleri</p>
                </CardContent>
              </Card>
            </a>
          </Link>

          <Link href="/hasta-portali/profil">
            <a>
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Profilim</CardTitle>
                  <User className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">Düzenle</div>
                  <p className="text-xs text-gray-600">Profil Bilgileri</p>
                </CardContent>
              </Card>
            </a>
          </Link>
        </div>

        {upcomingAppointments && upcomingAppointments.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-xl">Yaklaşan Randevular</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingAppointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <Clock className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium">{appointment.type}</p>
                        <p className="text-sm text-gray-600">
                          {new Date(appointment.date).toLocaleDateString("tr-TR")}{" "}
                          {appointment.time}
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/hasta-portali/randevular/${appointment.id}`}>
                        <a>Detaylar</a>
                      </Link>
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {unreadMessages && unreadMessages.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Son Mesajlar</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {unreadMessages.map((message) => (
                  <div
                    key={message.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <Bell className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium">Yeni Mesaj</p>
                        <p className="text-sm text-gray-600">
                          {message.content.substring(0, 50)}...
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <Link href="/hasta-portali/mesajlar">
                        <a>Oku</a>
                      </Link>
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}