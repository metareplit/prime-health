import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Slider } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Plus, Pencil, Trash2, Upload, Loader2 } from "lucide-react";

export default function AdminSliders() {
  const { toast } = useToast();
  const [editingSlider, setEditingSlider] = useState<Partial<Slider> | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const { data: sliders, isLoading } = useQuery<Slider[]>({
    queryKey: ["/api/sliders"],
  });

  const uploadImage = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/media/upload", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      throw new Error("Resim yüklenemedi");
    }

    const data = await res.json();
    return data.url;
  };

  const createMutation = useMutation({
    mutationFn: async (data: Omit<Slider, "id">) => {
      try {
        setIsUploading(true);
        let imageUrl = data.imageUrl;

        if (selectedFile) {
          imageUrl = await uploadImage(selectedFile);
        }

        const sliderData = {
          ...data,
          imageUrl,
        };

        const res = await apiRequest("POST", "/api/sliders", sliderData);
        if (!res.ok) {
          const error = await res.json();
          throw new Error(error.message || "Slider oluşturulamadı");
        }
        return res.json();
      } catch (error) {
        throw error;
      } finally {
        setIsUploading(false);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/sliders"] });
      toast({
        title: "Başarılı",
        description: "Slider oluşturuldu.",
      });
      setEditingSlider(null);
      setSelectedFile(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Hata",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Dosya boyutu kontrolü
      if (file.size > 5 * 1024 * 1024) { // 5MB
        toast({
          title: "Hata",
          description: "Dosya boyutu 5MB'dan büyük olamaz.",
          variant: "destructive",
        });
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSlider) return;

    if (!editingSlider.title) {
      toast({
        title: "Hata",
        description: "Lütfen başlık girin.",
        variant: "destructive",
      });
      return;
    }

    if (!editingSlider.imageUrl && !selectedFile) {
      toast({
        title: "Hata",
        description: "Lütfen bir resim seçin.",
        variant: "destructive",
      });
      return;
    }

    const now = new Date();
    const sliderData = {
      ...editingSlider,
      createdAt: now,
      updatedAt: now,
    };

    try {
      await createMutation.mutateAsync(sliderData);
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  const handleCreate = () => {
    const now = new Date();
    setEditingSlider({
      title: "",
      description: "",
      imageUrl: "",
      buttonText: "",
      buttonUrl: "",
      order: 0,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    });
  };

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/sliders/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/sliders"] });
      toast({
        title: "Başarılı",
        description: "Slider silindi.",
      });
    },
  });

  const toggleActiveMutation = useMutation({
    mutationFn: async ({ id, isActive }: { id: number; isActive: boolean }) => {
      await apiRequest("PATCH", `/api/sliders/${id}`, { isActive });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/sliders"] });
      toast({
        title: "Başarılı",
        description: "Slider durumu güncellendi.",
      });
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Slider Yönetimi</h1>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Yeni Slider
        </Button>
      </div>

      {editingSlider && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingSlider.id ? "Slider Düzenle" : "Yeni Slider"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Başlık</label>
                <Input
                  value={editingSlider.title}
                  onChange={(e) =>
                    setEditingSlider({
                      ...editingSlider,
                      title: e.target.value,
                    })
                  }
                  placeholder="Slider başlığı..."
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Açıklama</label>
                <Input
                  value={editingSlider.description || ""}
                  onChange={(e) =>
                    setEditingSlider({
                      ...editingSlider,
                      description: e.target.value,
                    })
                  }
                  placeholder="Slider açıklaması..."
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Buton Metni</label>
                <Input
                  value={editingSlider.buttonText || ""}
                  onChange={(e) =>
                    setEditingSlider({
                      ...editingSlider,
                      buttonText: e.target.value,
                    })
                  }
                  placeholder="Buton metni..."
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Buton URL</label>
                <Input
                  value={editingSlider.buttonUrl || ""}
                  onChange={(e) =>
                    setEditingSlider({
                      ...editingSlider,
                      buttonUrl: e.target.value,
                    })
                  }
                  placeholder="Buton URL'si..."
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Resim</label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="cursor-pointer"
                />
                {selectedFile && (
                  <p className="text-sm text-muted-foreground">
                    Seçilen dosya: {selectedFile.name}
                  </p>
                )}
              </div>

              <div className="flex gap-2 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setEditingSlider(null);
                    setSelectedFile(null);
                  }}
                  disabled={isUploading}
                >
                  İptal
                </Button>
                <Button type="submit" disabled={isUploading}>
                  {isUploading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Yükleniyor...
                    </>
                  ) : (
                    "Kaydet"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {isLoading ? (
        <div className="text-center py-8 text-muted-foreground">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          Yükleniyor...
        </div>
      ) : sliders?.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          Henüz slider bulunmuyor
        </div>
      ) : (
        <div className="grid gap-4">
          {sliders?.map((slider) => (
            <Card key={slider.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold">{slider.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {slider.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant={slider.isActive ? "default" : "secondary"}
                      size="sm"
                      onClick={() =>
                        toggleActiveMutation.mutate({
                          id: slider.id,
                          isActive: !slider.isActive,
                        })
                      }
                    >
                      {slider.isActive ? "Aktif" : "Pasif"}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingSlider(slider)}
                      title="Düzenle"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:text-red-600"
                      onClick={() => {
                        if (
                          window.confirm(
                            "Bu slider'ı silmek istediğinize emin misiniz?"
                          )
                        ) {
                          deleteMutation.mutate(slider.id);
                        }
                      }}
                      title="Sil"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {slider.imageUrl && (
                  <div className="mt-4">
                    <img
                      src={slider.imageUrl}
                      alt={slider.title}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}