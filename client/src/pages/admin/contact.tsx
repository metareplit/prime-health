import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Setting } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Phone, Mail, MapPin, Facebook, Instagram, Twitter } from "lucide-react";

export default function AdminContact() {
  const { toast } = useToast();
  const [editMode, setEditMode] = useState(false);

  const { data: settings, isLoading } = useQuery<Setting[]>({
    queryKey: ["/api/settings/contact"],
  });

  const updateMutation = useMutation({
    mutationFn: async (data: Setting) => {
      const res = await apiRequest("PATCH", `/api/settings/${data.id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/settings/contact"] });
      toast({
        title: "Başarılı",
        description: "İletişim bilgileri başarıyla güncellendi.",
      });
      setEditMode(false);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    // Update all contact settings
    Promise.all(
      settings.map(setting => updateMutation.mutateAsync(setting))
    );
  };

  if (isLoading) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Yükleniyor...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">İletişim Bilgileri</h1>
          <p className="text-muted-foreground">
            İletişim bilgilerini ve sosyal medya hesaplarını yönetin
          </p>
        </div>
        <Button onClick={() => setEditMode(!editMode)}>
          {editMode ? "İptal" : "Düzenle"}
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Temel İletişim Bilgileri</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Telefon Numarası
              </label>
              <Input
                value={settings?.find(s => s.key === "phone")?.value}
                onChange={(e) => {
                  if (!settings) return;
                  const setting = settings.find(s => s.key === "phone");
                  if (setting) {
                    setting.value = e.target.value;
                  }
                }}
                disabled={!editMode}
                placeholder="+90 555 123 4567"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Mail className="h-4 w-4" />
                E-posta Adresi
              </label>
              <Input
                value={settings?.find(s => s.key === "email")?.value}
                onChange={(e) => {
                  if (!settings) return;
                  const setting = settings.find(s => s.key === "email");
                  if (setting) {
                    setting.value = e.target.value;
                  }
                }}
                disabled={!editMode}
                placeholder="info@example.com"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Adres
              </label>
              <Textarea
                value={settings?.find(s => s.key === "address")?.value}
                onChange={(e) => {
                  if (!settings) return;
                  const setting = settings.find(s => s.key === "address");
                  if (setting) {
                    setting.value = e.target.value;
                  }
                }}
                disabled={!editMode}
                placeholder="Tam adres..."
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sosyal Medya Hesapları</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Facebook className="h-4 w-4" />
                Facebook
              </label>
              <Input
                value={settings?.find(s => s.key === "facebook")?.value}
                onChange={(e) => {
                  if (!settings) return;
                  const setting = settings.find(s => s.key === "facebook");
                  if (setting) {
                    setting.value = e.target.value;
                  }
                }}
                disabled={!editMode}
                placeholder="Facebook profil linki"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Instagram className="h-4 w-4" />
                Instagram
              </label>
              <Input
                value={settings?.find(s => s.key === "instagram")?.value}
                onChange={(e) => {
                  if (!settings) return;
                  const setting = settings.find(s => s.key === "instagram");
                  if (setting) {
                    setting.value = e.target.value;
                  }
                }}
                disabled={!editMode}
                placeholder="Instagram profil linki"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Twitter className="h-4 w-4" />
                Twitter
              </label>
              <Input
                value={settings?.find(s => s.key === "twitter")?.value}
                onChange={(e) => {
                  if (!settings) return;
                  const setting = settings.find(s => s.key === "twitter");
                  if (setting) {
                    setting.value = e.target.value;
                  }
                }}
                disabled={!editMode}
                placeholder="Twitter profil linki"
              />
            </div>
          </CardContent>
        </Card>

        {editMode && (
          <div className="flex justify-end">
            <Button type="submit">Kaydet</Button>
          </div>
        )}
      </form>
    </div>
  );
}
