import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Calendar, FileText } from "lucide-react";
import type { Post, Appointment } from "@shared/schema";

interface DashboardCard {
  title: string;
  value: number;
  description: string;
  icon: React.ReactNode;
}

export default function AdminDashboard() {
  const { data: appointments, isLoading: loadingAppointments } = useQuery<
    Appointment[]
  >({
    queryKey: ["/api/appointments"],
  });

  const { data: posts, isLoading: loadingPosts } = useQuery<Post[]>({
    queryKey: ["/api/posts"],
  });

  const cards: DashboardCard[] = [
    {
      title: "Aktif Randevular",
      value: appointments?.filter((apt) => apt.status === "pending").length || 0,
      description: "Bugün için randevular",
      icon: <Calendar className="h-5 w-5 text-green-500" />,
    },
    {
      title: "Blog Yazıları",
      value: posts?.length || 0,
      description: "Toplam yazı sayısı",
      icon: <FileText className="h-5 w-5 text-purple-500" />,
    },
  ];

  const todayAppointments = appointments?.filter(
    (apt) => new Date(apt.date).toDateString() === new Date().toDateString()
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Hoş Geldiniz</h1>
          <p className="text-muted-foreground">
            İşte kliniğinizin güncel durumu
          </p>
        </div>
        <Link href="/admin/appointments/new">
          <Button>
            <Calendar className="mr-2 h-4 w-4" />
            Yeni Randevu
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {cards.map((card) => (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {card.title}
              </CardTitle>
              {card.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <p className="text-xs text-muted-foreground">
                {card.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-muted-foreground" />
            Bugünkü Randevular
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loadingAppointments ? (
            <div className="text-center py-4 text-muted-foreground">
              Yükleniyor...
            </div>
          ) : todayAppointments?.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">
              Bugün için randevu bulunmuyor
            </div>
          ) : (
            <div className="space-y-4">
              {todayAppointments?.map((appointment) => (
                <div
                  key={appointment.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div>
                    <p className="font-medium">
                      {new Date(appointment.date).toLocaleTimeString("tr-TR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Hasta #{appointment.patientId}
                    </p>
                  </div>
                  <div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        appointment.status === "confirmed"
                          ? "bg-green-100 text-green-800"
                          : appointment.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {appointment.status === "confirmed"
                        ? "Onaylandı"
                        : appointment.status === "pending"
                        ? "Bekliyor"
                        : "İptal"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-muted-foreground" />
            Son Blog Yazıları
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loadingPosts ? (
            <div className="text-center py-4 text-muted-foreground">
              Yükleniyor...
            </div>
          ) : posts?.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">
              Henüz blog yazısı bulunmuyor
            </div>
          ) : (
            <div className="space-y-4">
              {posts?.slice(0, 5).map((post) => (
                <div
                  key={post.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div>
                    <p className="font-medium">{post.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(post.createdAt).toLocaleDateString("tr-TR")}
                    </p>
                  </div>
                  <Link href={`/admin/posts/${post.id}`}>
                    <Button variant="ghost" size="sm">
                      Düzenle
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}