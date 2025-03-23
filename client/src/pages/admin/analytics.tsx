import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SEOAnalytics } from "@/components/analytics/seo-analytics";
import { SocialMediaAnalytics } from "@/components/analytics/social-media-analytics";
import { DashboardAnalytics } from "@/components/analytics/dashboard-analytics";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { tr } from "date-fns/locale";

export default function AdminAnalytics() {
  const [dateRange, setDateRange] = useState<Date | undefined>(new Date());
  const [selectedMetric, setSelectedMetric] = useState("all");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Analitikler</h1>
          <p className="text-muted-foreground">
            Detaylı performans ve analiz raporları
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={selectedMetric} onValueChange={setSelectedMetric}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Metrik Seçin" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tüm Metrikler</SelectItem>
              <SelectItem value="visitors">Ziyaretçiler</SelectItem>
              <SelectItem value="engagement">Etkileşim</SelectItem>
              <SelectItem value="conversion">Dönüşüm</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex items-center gap-2">
            <Calendar
              mode="single"
              selected={dateRange}
              onSelect={setDateRange}
              locale={tr}
              className="rounded-md border"
            />
          </div>
          <Button>Rapor İndir</Button>
        </div>
      </div>

      {/* Özet Kartları */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Toplam Ziyaret</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45,231</div>
            <p className="text-xs text-muted-foreground">
              Geçen aya göre +20.1%
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Ortalama Süre</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2m 45s</div>
            <p className="text-xs text-muted-foreground">
              Geçen aya göre +15.3%
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Hemen Çıkma Oranı</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">32.4%</div>
            <p className="text-xs text-muted-foreground">
              Geçen aya göre -5.2%
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Dönüşüm Oranı</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3.2%</div>
            <p className="text-xs text-muted-foreground">
              Geçen aya göre +1.1%
            </p>
          </CardContent>
        </Card>
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