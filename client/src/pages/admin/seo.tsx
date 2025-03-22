import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

interface SEOSettings {
  title: string;
  description: string;
  keywords: string[];
  googleAnalyticsId: string;
  facebookPixelId: string;
}

export default function AdminSEO() {
  const { toast } = useToast();
  const [newKeyword, setNewKeyword] = useState("");

  const { data: seoSettings, isLoading } = useQuery<SEOSettings>({
    queryKey: ["/api/seo/settings"],
  });

  const updateMutation = useMutation({
    mutationFn: async (data: Partial<SEOSettings>) => {
      const res = await apiRequest("PATCH", "/api/seo/settings", data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/seo/settings"] });
      toast({
        title: "Başarılı",
        description: "SEO ayarları güncellendi.",
      });
    },
  });

  const handleAddKeyword = () => {
    if (newKeyword && !seoSettings?.keywords.includes(newKeyword)) {
      updateMutation.mutate({
        keywords: [...(seoSettings?.keywords || []), newKeyword],
      });
      setNewKeyword("");
    }
  };

  const handleRemoveKeyword = (keyword: string) => {
    updateMutation.mutate({
      keywords: seoSettings?.keywords.filter((k) => k !== keyword) || [],
    });
  };

  if (isLoading) {
    return <div>Yükleniyor...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">SEO Yönetimi</h1>
          <p className="text-muted-foreground">
            Site geneli SEO ayarları ve optimizasyonları
          </p>
        </div>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Genel SEO Ayarları</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Site Başlığı</label>
              <Input
                value={seoSettings?.title}
                onChange={(e) =>
                  updateMutation.mutate({ title: e.target.value })
                }
                placeholder="Site başlığı..."
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Site Açıklaması</label>
              <Textarea
                value={seoSettings?.description}
                onChange={(e) =>
                  updateMutation.mutate({ description: e.target.value })
                }
                placeholder="Site açıklaması..."
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Anahtar Kelimeler</label>
              <div className="flex gap-2">
                <Input
                  value={newKeyword}
                  onChange={(e) => setNewKeyword(e.target.value)}
                  placeholder="Yeni anahtar kelime..."
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddKeyword();
                    }
                  }}
                />
                <Button onClick={handleAddKeyword}>Ekle</Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {seoSettings?.keywords.map((keyword) => (
                  <div
                    key={keyword}
                    className="flex items-center gap-2 px-3 py-1 rounded-full bg-secondary"
                  >
                    <span>{keyword}</span>
                    <button
                      onClick={() => handleRemoveKeyword(keyword)}
                      className="text-sm text-muted-foreground hover:text-foreground"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Analitik Entegrasyonları</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Google Analytics ID</label>
              <Input
                value={seoSettings?.googleAnalyticsId}
                onChange={(e) =>
                  updateMutation.mutate({ googleAnalyticsId: e.target.value })
                }
                placeholder="GA-XXXXX..."
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Facebook Pixel ID</label>
              <Input
                value={seoSettings?.facebookPixelId}
                onChange={(e) =>
                  updateMutation.mutate({ facebookPixelId: e.target.value })
                }
                placeholder="XXXXXXXXXXXXX..."
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
