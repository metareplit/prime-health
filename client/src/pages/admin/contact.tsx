import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ContactInfo } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Phone, Mail, MapPin, Facebook, Instagram, Twitter } from "lucide-react";

export default function AdminContact() {
  const { toast } = useToast();
  const [editMode, setEditMode] = useState(false);

  const { data: contactInfo, isLoading } = useQuery<ContactInfo[]>({
    queryKey: ["/api/contact-info"],
  });

  const updateMutation = useMutation({
    mutationFn: async (data: ContactInfo) => {
      const res = await apiRequest("PATCH", `/api/contact-info/${data.id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/contact-info"] });
      toast({
        title: "Başarılı",
        description: "İletişim bilgileri başarıyla güncellendi.",
      });
      setEditMode(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Hata",
        description: "İletişim bilgileri güncellenirken bir hata oluştu: " + error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactInfo) return;

    // Update all contact settings
    Promise.all(
      contactInfo.map(info => updateMutation.mutateAsync(info))
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
                value={contactInfo?.find(i => i.type === "phone")?.value}
                onChange={(e) => {
                  if (!contactInfo) return;
                  const info = contactInfo.find(i => i.type === "phone");
                  if (info) {
                    info.value = e.target.value;
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
                value={contactInfo?.find(i => i.type === "email")?.value}
                onChange={(e) => {
                  if (!contactInfo) return;
                  const info = contactInfo.find(i => i.type === "email");
                  if (info) {
                    info.value = e.target.value;
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
                value={contactInfo?.find(i => i.type === "address")?.value}
                onChange={(e) => {
                  if (!contactInfo) return;
                  const info = contactInfo.find(i => i.type === "address");
                  if (info) {
                    info.value = e.target.value;
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
                value={contactInfo?.find(i => i.type === "facebook")?.value}
                onChange={(e) => {
                  if (!contactInfo) return;
                  const info = contactInfo.find(i => i.type === "facebook");
                  if (info) {
                    info.value = e.target.value;
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
                value={contactInfo?.find(i => i.type === "instagram")?.value}
                onChange={(e) => {
                  if (!contactInfo) return;
                  const info = contactInfo.find(i => i.type === "instagram");
                  if (info) {
                    info.value = e.target.value;
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
                value={contactInfo?.find(i => i.type === "twitter")?.value}
                onChange={(e) => {
                  if (!contactInfo) return;
                  const info = contactInfo.find(i => i.type === "twitter");
                  if (info) {
                    info.value = e.target.value;
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