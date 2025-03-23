import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SEOAnalytics } from "@/components/analytics/seo-analytics";
import { SocialMediaAnalytics } from "@/components/analytics/social-media-analytics";
import { DashboardAnalytics } from "@/components/analytics/dashboard-analytics";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, FileText, Filter, RefreshCcw } from "lucide-react";
import { useState } from "react";
import { tr } from "date-fns/locale";
import { format, subDays, subMonths } from "date-fns";

// Gerçek uygulamada API'den gelecek örnek veri
const performanceData = {
  totalVisits: 45231,
  visitChange: 20.1,
  avgDuration: "2m 45s",
  durationChange: 15.3,
  bounceRate: 32.4,
  bounceChange: -5.2,
  conversionRate: 3.2,
  conversionChange: 1.1,
};

const datePresets = [
  { label: "Son 7 Gün", value: "7days", start: subDays(new Date(), 7) },
  { label: "Son 30 Gün", value: "30days", start: subDays(new Date(), 30) },
  { label: "Son 3 Ay", value: "3months", start: subMonths(new Date(), 3) },
  { label: "Son 6 Ay", value: "6months", start: subMonths(new Date(), 6) },
];

export default function AdminAnalytics() {
  const [activeTab, setActiveTab] = useState("overview");
  const [dateRange, setDateRange] = useState<Date>(new Date());
  const [selectedMetric, setSelectedMetric] = useState("all");
  const [datePreset, setDatePreset] = useState("30days");

  const handlePresetChange = (preset: string) => {
    setDatePreset(preset);
    const selectedPreset = datePresets.find(p => p.value === preset);
    if (selectedPreset) {
      setDateRange(selectedPreset.start);
    }
  };

  const handleRefresh = () => {
    // Gerçek uygulamada verileri yenileyecek
    console.log("Veriler yenileniyor...");
  };

  const handleExport = () => {
    // Gerçek uygulamada rapor indirilecek
    console.log("Rapor indiriliyor...");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Analitikler</h1>
          <p className="text-muted-foreground">
            Detaylı performans ve analiz raporları
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCcw className="mr-2 h-4 w-4" />
            Yenile
          </Button>
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Rapor İndir
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-[200px]">
              <Select value={datePreset} onValueChange={handlePresetChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Tarih Aralığı" />
                </SelectTrigger>
                <SelectContent>
                  {datePresets.map((preset) => (
                    <SelectItem key={preset.value} value={preset.value}>
                      {preset.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1 min-w-[200px]">
              <Select value={selectedMetric} onValueChange={setSelectedMetric}>
                <SelectTrigger>
                  <SelectValue placeholder="Metrik Seçin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tüm Metrikler</SelectItem>
                  <SelectItem value="visitors">Ziyaretçiler</SelectItem>
                  <SelectItem value="engagement">Etkileşim</SelectItem>
                  <SelectItem value="conversion">Dönüşüm</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1 min-w-[240px]">
              <Calendar
                mode="single"
                selected={dateRange}
                onSelect={(date) => date && setDateRange(date)}
                locale={tr}
                className="rounded-md border"
              />
            </div>
            <Button variant="secondary" className="gap-2">
              <Filter className="h-4 w-4" />
              Filtrele
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Performance Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Toplam Ziyaret
              <span className="ml-2 text-xs text-green-500">
                +{performanceData.visitChange}%
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {performanceData.totalVisits.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Geçen aya göre artış
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Ortalama Süre
              <span className="ml-2 text-xs text-green-500">
                +{performanceData.durationChange}%
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{performanceData.avgDuration}</div>
            <p className="text-xs text-muted-foreground">
              Geçen aya göre artış
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Hemen Çıkma Oranı
              <span className="ml-2 text-xs text-red-500">
                {performanceData.bounceChange}%
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{performanceData.bounceRate}%</div>
            <p className="text-xs text-muted-foreground">
              Geçen aya göre düşüş
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Dönüşüm Oranı
              <span className="ml-2 text-xs text-green-500">
                +{performanceData.conversionChange}%
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {performanceData.conversionRate}%
            </div>
            <p className="text-xs text-muted-foreground">
              Geçen aya göre artış
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Analiz Detayları */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Genel Bakış</TabsTrigger>
          <TabsTrigger value="social">Sosyal Medya</TabsTrigger>
          <TabsTrigger value="seo">SEO Performans</TabsTrigger>
          <TabsTrigger value="conversion">Dönüşüm Analizi</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4 mt-4">
          <DashboardAnalytics />
        </TabsContent>

        <TabsContent value="social" className="space-y-4 mt-4">
          <SocialMediaAnalytics />
        </TabsContent>

        <TabsContent value="seo" className="space-y-4 mt-4">
          <SEOAnalytics />
        </TabsContent>

        <TabsContent value="conversion" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Dönüşüm İstatistikleri</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-60 text-muted-foreground">
                <div className="text-center">
                  <FileText className="mx-auto h-10 w-10 mb-4" />
                  <p>Dönüşüm analizi yakında eklenecek</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}