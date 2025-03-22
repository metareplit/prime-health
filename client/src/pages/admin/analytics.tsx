import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SEOAnalytics } from "@/components/analytics/seo-analytics";
import { SocialMediaAnalytics } from "@/components/analytics/social-media-analytics";
import { DashboardAnalytics } from "@/components/analytics/dashboard-analytics";

export default function AdminAnalytics() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Analitikler</h1>
          <p className="text-muted-foreground">
            Detaylı performans ve analiz raporları
          </p>
        </div>
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
