import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { SuccessStory } from "@shared/schema";
import { Plus, Star, Eye, EyeOff, Pencil, Trash2 } from "lucide-react";

export default function AdminSuccessStories() {
  const { toast } = useToast();
  const [editingStory, setEditingStory] = useState<Partial<SuccessStory> | null>(null);

  const { data: stories, isLoading } = useQuery<SuccessStory[]>({
    queryKey: ["/api/success-stories"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: Omit<SuccessStory, "id">) => {
      const res = await apiRequest("POST", "/api/success-stories", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/success-stories"] });
      toast({
        title: "Başarılı",
        description: "Başarı hikayesi oluşturuldu.",
      });
      setEditingStory(null);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: SuccessStory) => {
      const res = await apiRequest("PATCH", `/api/success-stories/${data.id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/success-stories"] });
      toast({
        title: "Başarılı",
        description: "Başarı hikayesi güncellendi.",
      });
      setEditingStory(null);
    },
  });

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
    },
  });

  const toggleFeatureMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest("POST", `/api/success-stories/${id}/toggle-feature`);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/success-stories"] });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStory) return;

    const storyData = {
      ...editingStory,
      treatmentDate: new Date(),
      beforeImages: editingStory.beforeImages || [],
      afterImages: editingStory.afterImages || [],
      age: editingStory.age || null,
      testimonial: editingStory.testimonial || null,
      recoveryTime: editingStory.recoveryTime || null,
      satisfaction: editingStory.satisfaction || 5,
      featured: editingStory.featured || false,
      published: editingStory.published || false,
    };

    if ("id" in editingStory) {
      updateMutation.mutate(storyData as SuccessStory);
    } else {
      createMutation.mutate(storyData as Omit<SuccessStory, "id">);
    }
  };

  const handleCreate = () => {
    setEditingStory({
      patientName: "",
      age: null,
      treatmentType: "",
      description: "",
      testimonial: null,
      beforeImages: [],
      afterImages: [],
      treatmentDate: new Date(),
      recoveryTime: null,
      satisfaction: 5,
      featured: false,
      published: false,
    });
  };

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

              <div className="flex gap-2 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditingStory(null)}
                >
                  İptal
                </Button>
                <Button type="submit">Kaydet</Button>
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
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => togglePublishMutation.mutate(story.id)}
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
                    >
                      <Star className={`h-4 w-4 ${story.featured ? "text-yellow-500 fill-yellow-500" : ""}`} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingStory(story)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:text-red-600"
                      onClick={() => deleteMutation.mutate(story.id)}
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
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}