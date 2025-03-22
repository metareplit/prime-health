import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Users, Calendar, FileText, Package } from "lucide-react";
import type { User, Post, Product, Appointment } from "@shared/schema";
import { DashboardAnalytics } from "@/components/analytics/dashboard-analytics";
import { SocialMediaAnalytics } from "@/components/analytics/social-media-analytics";
import { SEOAnalytics } from "@/components/analytics/seo-analytics";

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
      title: "Toplam Kullanıcı",
      value: users?.length || 0,
      description: "Kayıtlı kullanıcı sayısı",
      icon: <Users className="h-4 w-4 text-blue-500" />,
    },
    {
      title: "Aktif Randevular",
      value: appointments?.filter((apt) => apt.status === "pending").length || 0,
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

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Link href="/admin/appointments">
          <Button>Yeni Randevu Oluştur</Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
              {card.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <p className="text-xs text-muted-foreground">{card.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Sosyal Medya Analitikleri */}
      <SocialMediaAnalytics />

      {/* SEO ve Anahtar Kelime Analizi */}
      <SEOAnalytics />

      {/* Genel Site Analitikleri */}
      <DashboardAnalytics />
    </div>
  );
}