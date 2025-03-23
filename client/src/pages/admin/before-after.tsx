import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { BeforeAfter } from "@shared/schema";
import { Plus, Pencil, Trash2, Upload } from "lucide-react";

export default function AdminBeforeAfter() {
  const { toast } = useToast();
  const [editingItem, setEditingItem] = useState<Partial<BeforeAfter> | null>(null);
  const [selectedFile, setSelectedFile] = useState<{ before: File | null; after: File | null }>({
    before: null,
    after: null
  });

  const { data: items, isLoading } = useQuery<BeforeAfter[]>({
    queryKey: ["/api/before-after"],
  });

  const uploadImage = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await apiRequest("POST", "/api/media/upload", formData);
    if (!res.ok) {
      throw new Error("Görsel yüklenirken bir hata oluştu");
    }

    const data = await res.json();
    return data.url;
  };

  const createMutation = useMutation({
    mutationFn: async (data: Omit<BeforeAfter, "id">) => {
      try {
        const beforeUrls = [];
        const afterUrls = [];

        if (selectedFile.before) {
          const beforeUrl = await uploadImage(selectedFile.before);
          beforeUrls.push(beforeUrl);
        }

        if (selectedFile.after) {
          const afterUrl = await uploadImage(selectedFile.after);
          afterUrls.push(afterUrl);
        }

        const itemData = {
          ...data,
          beforeImages: beforeUrls,
          afterImages: afterUrls,
        };

        const res = await apiRequest("POST", "/api/before-after", itemData);
        if (!res.ok) {
          const error = await res.json();
          throw new Error(error.message || "Kayıt oluşturulamadı");
        }
        return res.json();
      } catch (error: any) {
        throw new Error(error.message || "Kayıt oluşturulamadı");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/before-after"] });
      toast({
        title: "Başarılı",
        description: "Kayıt oluşturuldu.",
      });
      setEditingItem(null);
      setSelectedFile({ before: null, after: null });
    },
    onError: (error: Error) => {
      toast({
        title: "Hata",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleFileChange = (type: 'before' | 'after', event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(prev => ({
        ...prev,
        [type]: file
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    if (!editingItem.patientName || !editingItem.treatmentType) {
      toast({
        title: "Hata",
        description: "Lütfen hasta adı ve tedavi tipini girin.",
        variant: "destructive",
      });
      return;
    }

    const now = new Date();
    const itemData = {
      patientName: editingItem.patientName,
      treatmentType: editingItem.treatmentType,
      treatmentDate: now,
      beforeImages: [],
      afterImages: [],
      createdAt: now,
      updatedAt: now
    };

    try {
      await createMutation.mutateAsync(itemData);
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  const handleCreate = () => {
    const now = new Date();
    setEditingItem({
      patientName: "",
      treatmentType: "",
      beforeImages: [],
      afterImages: [],
      treatmentDate: now,
      createdAt: now,
      updatedAt: now
    });
  };

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/before-after/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/before-after"] });
      toast({
        title: "Başarılı",
        description: "Kayıt silindi.",
      });
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Öncesi ve Sonrası</h1>
          <p className="text-muted-foreground">
            Tedavi öncesi ve sonrası fotoğrafları yönetin
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Yeni Ekle
        </Button>
      </div>

      {editingItem && (
        <Card>
          <CardHeader>
            <CardTitle>Yeni Kayıt</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Hasta Adı</label>
                <Input
                  value={editingItem.patientName}
                  onChange={(e) =>
                    setEditingItem({
                      ...editingItem,
                      patientName: e.target.value,
                    })
                  }
                  placeholder="Hasta adı..."
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Tedavi Tipi</label>
                <Input
                  value={editingItem.treatmentType}
                  onChange={(e) =>
                    setEditingItem({
                      ...editingItem,
                      treatmentType: e.target.value,
                    })
                  }
                  placeholder="Tedavi tipi..."
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Öncesi Fotoğrafı</label>
                  <div className="border rounded-lg p-4">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange('before', e)}
                      className="hidden"
                      id="beforeImage"
                    />
                    <label htmlFor="beforeImage">
                      <Button type="button" variant="outline" className="w-full">
                        <Upload className="h-4 w-4 mr-2" />
                        {selectedFile.before ? selectedFile.before.name : "Fotoğraf Seç"}
                      </Button>
                    </label>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Sonrası Fotoğrafı</label>
                  <div className="border rounded-lg p-4">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange('after', e)}
                      className="hidden"
                      id="afterImage"
                    />
                    <label htmlFor="afterImage">
                      <Button type="button" variant="outline" className="w-full">
                        <Upload className="h-4 w-4 mr-2" />
                        {selectedFile.after ? selectedFile.after.name : "Fotoğraf Seç"}
                      </Button>
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setEditingItem(null);
                    setSelectedFile({ before: null, after: null });
                  }}
                >
                  İptal
                </Button>
                <Button type="submit" disabled={createMutation.isPending}>
                  {createMutation.isPending ? "Kaydediliyor..." : "Kaydet"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {isLoading ? (
        <div className="text-center py-8 text-muted-foreground">
          Yükleniyor...
        </div>
      ) : items?.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          Henüz kayıt bulunmuyor
        </div>
      ) : (
        <div className="grid gap-4">
          {items?.map((item) => (
            <Card key={item.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold">
                      {item.patientName}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {item.treatmentType}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingItem(item)}
                      title="Düzenle"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:text-red-600"
                      onClick={() => {
                        if (window.confirm("Bu kaydı silmek istediğinize emin misiniz?")) {
                          deleteMutation.mutate(item.id);
                        }
                      }}
                      title="Sil"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {(item.beforeImages?.length > 0 || item.afterImages?.length > 0) && (
                  <div className="mt-4 grid grid-cols-2 gap-4">
                    {item.beforeImages?.map((image, index) => (
                      <div key={`before-${index}`}>
                        <p className="text-xs text-muted-foreground mb-2">Öncesi</p>
                        <img
                          src={image}
                          alt={`${item.patientName} öncesi ${index + 1}`}
                          className="w-full h-48 object-cover rounded-lg"
                        />
                      </div>
                    ))}
                    {item.afterImages?.map((image, index) => (
                      <div key={`after-${index}`}>
                        <p className="text-xs text-muted-foreground mb-2">Sonrası</p>
                        <img
                          src={image}
                          alt={`${item.patientName} sonrası ${index + 1}`}
                          className="w-full h-48 object-cover rounded-lg"
                        />
                      </div>
                    ))}
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