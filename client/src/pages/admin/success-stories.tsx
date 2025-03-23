import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { SuccessStory } from "@shared/schema";
import { Plus, Star, Eye, EyeOff, Pencil, Trash2, Upload } from "lucide-react";

export default function AdminSuccessStories() {
  const { toast } = useToast();
  const [editingStory, setEditingStory] = useState<Partial<SuccessStory> | null>(null);
  const [selectedFile, setSelectedFile] = useState<{ before: File | null; after: File | null }>({
    before: null,
    after: null
  });

  const { data: stories, isLoading } = useQuery<SuccessStory[]>({
    queryKey: ["/api/success-stories"],
  });

  const uploadImage = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await apiRequest("POST", "/api/media/upload", formData, {
      headers: {
        // Don't set Content-Type here, it will be set automatically with FormData
      },
    });

    if (!res.ok) {
      throw new Error("Görsel yüklenirken bir hata oluştu");
    }

    const data = await res.json();
    return data.url;
  };

  const createMutation = useMutation({
    mutationFn: async (data: Omit<SuccessStory, "id">) => {
      try {
        // Upload images if selected
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

        const storyData = {
          ...data,
          beforeImages: beforeUrls,
          afterImages: afterUrls,
        };

        const res = await apiRequest("POST", "/api/success-stories", storyData);
        if (!res.ok) {
          const error = await res.json();
          throw new Error(error.message || "Başarı hikayesi oluşturulamadı");
        }
        return res.json();
      } catch (error: any) {
        throw new Error(error.message || "Başarı hikayesi oluşturulamadı");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/success-stories"] });
      toast({
        title: "Başarılı",
        description: "Başarı hikayesi oluşturuldu.",
      });
      setEditingStory(null);
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

  const updateMutation = useMutation({
    mutationFn: async (data: SuccessStory) => {
      try {
        // Upload new images if selected
        if (selectedFile.before) {
          const beforeUrl = await uploadImage(selectedFile.before);
          data.beforeImages = [...(data.beforeImages || []), beforeUrl];
        }

        if (selectedFile.after) {
          const afterUrl = await uploadImage(selectedFile.after);
          data.afterImages = [...(data.afterImages || []), afterUrl];
        }

        const res = await apiRequest("PATCH", `/api/success-stories/${data.id}`, data);
        if (!res.ok) {
          const error = await res.json();
          throw new Error(error.message || "Başarı hikayesi güncellenemedi");
        }
        return res.json();
      } catch (error: any) {
        throw new Error(error.message || "Başarı hikayesi güncellenemedi");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/success-stories"] });
      toast({
        title: "Başarılı",
        description: "Başarı hikayesi güncellendi.",
      });
      setEditingStory(null);
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
    if (!editingStory) return;

    if (!editingStory.patientName || !editingStory.treatmentType || !editingStory.description) {
      toast({
        title: "Hata",
        description: "Lütfen gerekli alanları doldurun.",
        variant: "destructive",
      });
      return;
    }

    const now = new Date();
    const storyData = {
      ...editingStory,
      age: editingStory.age || null,
      testimonial: editingStory.testimonial || null,
      recoveryTime: editingStory.recoveryTime || null,
      satisfaction: editingStory.satisfaction || 5,
      treatmentDate: now,
      createdAt: now,
      updatedAt: now
    };

    try {
      if ("id" in editingStory) {
        await updateMutation.mutateAsync(storyData as SuccessStory);
      } else {
        await createMutation.mutateAsync(storyData as Omit<SuccessStory, "id">);
      }
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  const handleCreate = () => {
    const now = new Date();
    setEditingStory({
      patientName: "",
      age: null,
      treatmentType: "",
      description: "",
      testimonial: null,
      beforeImages: [],
      afterImages: [],
      treatmentDate: now,
      recoveryTime: null,
      satisfaction: 5,
      featured: false,
      published: false,
      createdAt: now,
      updatedAt: now
    });
  };

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/success-stories/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/success-stories"] });
      toast({
        title: "Başarılı",
        description: "Başarı hikayesi silindi.",
      });
    },
  });

  const togglePublishMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest("POST", `/api/success-stories/${id}/toggle-publish`);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/success-stories"] });
      toast({
        title: "Başarılı",
        description: "Yayın durumu güncellendi.",
      });
    },
  });

  const toggleFeatureMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest("POST", `/api/success-stories/${id}/toggle-feature`);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/success-stories"] });
      toast({
        title: "Başarılı",
        description: "Öne çıkarma durumu güncellendi.",
      });
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Başarı Hikayeleri</h1>
          <p className="text-muted-foreground">
            Hasta başarı hikayelerini yönetin
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Yeni Hikaye
        </Button>
      </div>

      {editingStory && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingStory.id ? "Hikayeyi Düzenle" : "Yeni Hikaye"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Hasta Adı</label>
                  <Input
                    value={editingStory.patientName}
                    onChange={(e) =>
                      setEditingStory({
                        ...editingStory,
                        patientName: e.target.value,
                      })
                    }
                    placeholder="Hasta adı..."
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Yaş</label>
                  <Input
                    type="number"
                    value={editingStory.age || ""}
                    onChange={(e) =>
                      setEditingStory({
                        ...editingStory,
                        age: e.target.value ? parseInt(e.target.value) : null,
                      })
                    }
                    placeholder="Yaş..."
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Tedavi Tipi</label>
                <Input
                  value={editingStory.treatmentType}
                  onChange={(e) =>
                    setEditingStory({
                      ...editingStory,
                      treatmentType: e.target.value,
                    })
                  }
                  placeholder="Tedavi tipi..."
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Açıklama</label>
                <Textarea
                  value={editingStory.description}
                  onChange={(e) =>
                    setEditingStory({
                      ...editingStory,
                      description: e.target.value,
                    })
                  }
                  placeholder="Tedavi süreci hakkında detaylı bilgi..."
                  rows={4}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Hasta Yorumu</label>
                <Textarea
                  value={editingStory.testimonial || ""}
                  onChange={(e) =>
                    setEditingStory({
                      ...editingStory,
                      testimonial: e.target.value || null,
                    })
                  }
                  placeholder="Hasta yorumu..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">İyileşme Süresi</label>
                <Input
                  value={editingStory.recoveryTime || ""}
                  onChange={(e) =>
                    setEditingStory({
                      ...editingStory,
                      recoveryTime: e.target.value || null,
                    })
                  }
                  placeholder="İyileşme süresi..."
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

              <div className="flex items-center space-x-4">
                <label className="text-sm font-medium flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={editingStory.published}
                    onChange={(e) =>
                      setEditingStory({
                        ...editingStory,
                        published: e.target.checked,
                      })
                    }
                    className="rounded border-gray-300"
                  />
                  Yayınla
                </label>

                <label className="text-sm font-medium flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={editingStory.featured}
                    onChange={(e) =>
                      setEditingStory({
                        ...editingStory,
                        featured: e.target.checked,
                      })
                    }
                    className="rounded border-gray-300"
                  />
                  Öne Çıkar
                </label>
              </div>

              <div className="flex gap-2 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setEditingStory(null);
                    setSelectedFile({ before: null, after: null });
                  }}
                >
                  İptal
                </Button>
                <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                  {createMutation.isPending || updateMutation.isPending ? "Kaydediliyor..." : "Kaydet"}
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
      ) : stories?.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          Henüz başarı hikayesi bulunmuyor
        </div>
      ) : (
        <div className="grid gap-4">
          {stories?.map((story) => (
            <Card key={story.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold flex items-center gap-2">
                      {story.patientName}
                      {story.featured && (
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      )}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {story.treatmentType}
                      {story.age && ` • ${story.age} yaş`}
                      {story.recoveryTime && ` • İyileşme: ${story.recoveryTime}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => togglePublishMutation.mutate(story.id)}
                      title={story.published ? "Yayından Kaldır" : "Yayınla"}
                    >
                      {story.published ? (
                        <Eye className="h-4 w-4" />
                      ) : (
                        <EyeOff className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleFeatureMutation.mutate(story.id)}
                      title={story.featured ? "Öne Çıkarmayı Kaldır" : "Öne Çıkar"}
                    >
                      <Star className={`h-4 w-4 ${story.featured ? "text-yellow-500 fill-yellow-500" : ""}`} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingStory(story)}
                      title="Düzenle"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:text-red-600"
                      onClick={() => {
                        if (window.confirm("Bu başarı hikayesini silmek istediğinize emin misiniz?")) {
                          deleteMutation.mutate(story.id);
                        }
                      }}
                      title="Sil"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="mt-4">
                  <p className="text-sm">{story.description}</p>
                  {story.testimonial && (
                    <blockquote className="mt-2 pl-4 border-l-2 italic text-muted-foreground">
                      {story.testimonial}
                    </blockquote>
                  )}
                </div>

                {(story.beforeImages?.length > 0 || story.afterImages?.length > 0) && (
                  <div className="mt-4 grid grid-cols-2 gap-4">
                    {story.beforeImages?.map((image, index) => (
                      <div key={`before-${index}`}>
                        <p className="text-xs text-muted-foreground mb-2">Öncesi</p>
                        <img
                          src={image}
                          alt={`${story.patientName} öncesi ${index + 1}`}
                          className="w-full h-48 object-cover rounded-lg"
                        />
                      </div>
                    ))}
                    {story.afterImages?.map((image, index) => (
                      <div key={`after-${index}`}>
                        <p className="text-xs text-muted-foreground mb-2">Sonrası</p>
                        <img
                          src={image}
                          alt={`${story.patientName} sonrası ${index + 1}`}
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