import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Users, Calendar, FileText, Package, TrendingUp, Star, Clock } from "lucide-react";
import type { User, Post, Product, Appointment } from "@shared/schema";
import { DashboardAnalytics } from "@/components/analytics/dashboard-analytics";
import { SocialMediaAnalytics } from "@/components/analytics/social-media-analytics";
import { SEOAnalytics } from "@/components/analytics/seo-analytics";

interface DashboardCard {
  title: string;
  value: number;
  description: string;
  icon: React.ReactNode;
  trend?: number;
}

export default function AdminDashboard() {
  const { data: users, isLoading: loadingUsers } = useQuery<User[]>({
    queryKey: ["/api/users"],
  });

  const { data: appointments, isLoading: loadingAppointments } = useQuery<
    Appointment[]
  >({
    queryKey: ["/api/appointments"],
  });

  const { data: posts, isLoading: loadingPosts } = useQuery<Post[]>({
    queryKey: ["/api/posts"],
  });

  const { data: products, isLoading: loadingProducts } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const cards: DashboardCard[] = [
    {
      title: "Toplam Hasta",
      value: users?.length || 0,
      description: "Bu ay 24 yeni hasta",
      icon: <Users className="h-5 w-5 text-blue-500" />,
      trend: 12.5,
    },
    {
      title: "Aktif Randevular",
      value: appointments?.filter((apt) => apt.status === "pending").length || 0,
      description: "Bugün 8 randevu",
      icon: <Calendar className="h-5 w-5 text-green-500" />,
      trend: 8.2,
    },
    {
      title: "Blog Yazıları",
      value: posts?.length || 0,
      description: "Son 7 günde 5 yeni yazı",
      icon: <FileText className="h-5 w-5 text-purple-500" />,
      trend: 15.3,
    },
    {
      title: "Ürünler",
      value: products?.length || 0,
      description: "Stok durumu iyi",
      icon: <Package className="h-5 w-5 text-orange-500" />,
      trend: -2.1,
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

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
              <div className="flex items-center space-x-2">
                <p className="text-xs text-muted-foreground">
                  {card.description}
                </p>
                {card.trend && (
                  <span
                    className={`flex items-center text-xs ${
                      card.trend > 0 ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {card.trend > 0 ? (
                      <TrendingUp className="mr-1 h-3 w-3" />
                    ) : (
                      <TrendingUp className="mr-1 h-3 w-3 transform rotate-180" />
                    )}
                    {Math.abs(card.trend)}%
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-muted-foreground" />
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
              <Star className="h-5 w-5 text-muted-foreground" />
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

      <SocialMediaAnalytics />
      <SEOAnalytics />
      <DashboardAnalytics />
    </div>
  );
}