import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Users, Calendar, FileText, Package } from "lucide-react";
import type { User, Post, Product, Appointment } from "@shared/schema";

interface DashboardCard {
  title: string;
  value: number;
  description: string;
  icon: React.ReactNode;
}

export default function AdminDashboard() {
  const { data: users, isLoading: loadingUsers } = useQuery<User[]>({
    queryKey: ["/api/users"],
  });

  const { data: appointments, isLoading: loadingAppointments } = useQuery<Appointment[]>({
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
      title: "Toplam Kullanıcı",
      value: users?.length || 0,
      description: "Kayıtlı kullanıcı sayısı",
      icon: <Users className="h-4 w-4 text-blue-500" />,
    },
    {
      title: "Aktif Randevular",
      value: appointments?.filter(apt => apt.status === "pending").length || 0,
      description: "Bekleyen randevu sayısı",
      icon: <Calendar className="h-4 w-4 text-green-500" />,
    },
    {
      title: "Blog Yazıları",
      value: posts?.length || 0,
      description: "Yayınlanan yazı sayısı",
      icon: <FileText className="h-4 w-4 text-purple-500" />,
    },
    {
      title: "Ürünler",
      value: products?.length || 0,
      description: "Aktif ürün sayısı",
      icon: <Package className="h-4 w-4 text-orange-500" />,
    },
  ];

  const todayAppointments = appointments?.filter(
    (apt) => new Date(apt.date).toDateString() === new Date().toDateString()
  );

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Link href="/admin/appointments">
          <Button>Yeni Randevu Oluştur</Button>
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
              <p className="text-xs text-muted-foreground">
                {card.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Son Randevular</CardTitle>
          </CardHeader>
          <CardContent>
            {loadingAppointments ? (
              <div>Yükleniyor...</div>
            ) : (
              <div className="space-y-4">
                {todayAppointments?.slice(0, 5).map((appointment) => (
                  <div
                    key={appointment.id}
                    className="flex justify-between items-center p-4 border rounded-lg"
                  >
                    <div>
                      <p className="font-semibold">
                        {new Date(appointment.date).toLocaleDateString("tr-TR")}
                      </p>
                      <p className="text-sm text-gray-600">
                        Hasta ID: {appointment.patientId}
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

        <Card>
          <CardHeader>
            <CardTitle>Son Blog Yazıları</CardTitle>
          </CardHeader>
          <CardContent>
            {loadingPosts ? (
              <div>Yükleniyor...</div>
            ) : (
              <div className="space-y-4">
                {posts?.slice(0, 5).map((post) => (
                  <div
                    key={post.id}
                    className="flex justify-between items-center p-4 border rounded-lg"
                  >
                    <div>
                      <p className="font-semibold">{post.title}</p>
                      <p className="text-sm text-gray-600">
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
    </div>
  );
}