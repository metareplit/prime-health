import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Service } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Plus, Star, GripVertical, Pencil, Trash2, Upload, Clock, DollarSign } from "lucide-react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

export default function AdminServices() {
  const { toast } = useToast();
  const [editingService, setEditingService] = useState<Partial<Service> | null>(null);

  const { data: services, isLoading } = useQuery<Service[]>({
    queryKey: ["/api/services"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: Omit<Service, "id">) => {
      const res = await apiRequest("POST", "/api/services", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/services"] });
      toast({
        title: "Başarılı",
        description: "Hizmet başarıyla oluşturuldu.",
      });
      setEditingService(null);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: Service) => {
      const res = await apiRequest("PATCH", `/api/services/${data.id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/services"] });
      toast({
        title: "Başarılı",
        description: "Hizmet başarıyla güncellendi.",
      });
      setEditingService(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/services/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/services"] });
      toast({
        title: "Başarılı",
        description: "Hizmet başarıyla silindi.",
      });
    },
  });

  const reorderMutation = useMutation({
    mutationFn: async ({ id, order }: { id: number; order: number }) => {
      const res = await apiRequest("PATCH", `/api/services/${id}/reorder`, { order });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/services"] });
    },
  });

  const handleDragEnd = (result: any) => {
    if (!result.destination || !services) return;

    const items = Array.from(services);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update order for all affected items
    items.forEach((item, index) => {
      reorderMutation.mutate({ id: item.id, order: index });
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingService) {
      if ("id" in editingService) {
        updateMutation.mutate(editingService as Service);
      } else {
        const { id, ...serviceData } = editingService;
        createMutation.mutate(serviceData);
      }
    }
  };

  const handleCreate = () => {
    setEditingService({
      name: "",
      description: "",
      longDescription: "",
      benefits: [],
      process: [],
      faqs: [],
      duration: "",
      price: "0",
      imageUrl: "",
      slug: "",
      featured: false,
      order: services?.length || 0,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Hizmetler</h1>
          <p className="text-muted-foreground">
            Klinik hizmetlerini yönetin ve düzenleyin
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Yeni Hizmet
        </Button>
      </div>

      {editingService && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingService.id ? "Hizmeti Düzenle" : "Yeni Hizmet"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Hizmet Adı</label>
                  <Input
                    value={editingService.name}
                    onChange={(e) =>
                      setEditingService({
                        ...editingService,
                        name: e.target.value,
                        slug: e.target.value
                          .toLowerCase()
                          .replace(/[^a-z0-9]+/g, "-")
                          .replace(/^-+|-+$/g, ""),
                      })
                    }
                    placeholder="Hizmet adı..."
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">SEO URL</label>
                  <Input
                    value={editingService.slug}
                    onChange={(e) =>
                      setEditingService({
                        ...editingService,
                        slug: e.target.value,
                      })
                    }
                    placeholder="seo-dostu-url"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Kısa Açıklama</label>
                <Textarea
                  value={editingService.description}
                  onChange={(e) =>
                    setEditingService({
                      ...editingService,
                      description: e.target.value,
                    })
                  }
                  placeholder="Hizmet hakkında kısa açıklama..."
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Detaylı Açıklama</label>
                <Textarea
                  value={editingService.longDescription}
                  onChange={(e) =>
                    setEditingService({
                      ...editingService,
                      longDescription: e.target.value,
                    })
                  }
                  placeholder="Hizmet hakkında detaylı açıklama..."
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Süre</label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      value={editingService.duration}
                      onChange={(e) =>
                        setEditingService({
                          ...editingService,
                          duration: e.target.value,
                        })
                      }
                      placeholder="Örn: 45 dakika"
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Fiyat</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="number"
                      value={editingService.price}
                      onChange={(e) =>
                        setEditingService({
                          ...editingService,
                          price: e.target.value,
                        })
                      }
                      placeholder="0.00"
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Görsel</label>
                <div className="border rounded-lg p-4">
                  <Button variant="outline" className="w-full">
                    <Upload className="h-4 w-4 mr-2" />
                    Görsel Yükle
                  </Button>
                </div>
              </div>

              <div className="flex gap-2 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditingService(null)}
                >
                  İptal
                </Button>
                <Button type="submit">Kaydet</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="services">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-4"
            >
              {isLoading ? (
                <div className="text-center py-8 text-muted-foreground">
                  Yükleniyor...
                </div>
              ) : services?.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  Henüz hizmet bulunmuyor
                </div>
              ) : (
                services?.map((service, index) => (
                  <Draggable
                    key={service.id}
                    draggableId={service.id.toString()}
                    index={index}
                  >
                    {(provided) => (
                      <Card
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className="overflow-hidden"
                      >
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-4">
                              <div
                                {...provided.dragHandleProps}
                                className="cursor-move text-muted-foreground"
                              >
                                <GripVertical className="h-5 w-5" />
                              </div>
                              <div>
                                <h3 className="font-semibold flex items-center gap-2">
                                  {service.name}
                                  {service.featured && (
                                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                                  )}
                                </h3>
                                <p className="text-sm text-muted-foreground mt-1">
                                  {service.description}
                                </p>
                                <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                                  <span className="flex items-center gap-1">
                                    <Clock className="h-4 w-4" />
                                    {service.duration}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <DollarSign className="h-4 w-4" />
                                    {new Intl.NumberFormat("tr-TR", {
                                      style: "currency",
                                      currency: "TRY",
                                    }).format(Number(service.price))}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setEditingService(service)}
                              >
                                <Pencil className="h-4 w-4 mr-2" />
                                Düzenle
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-500 hover:text-red-600"
                                onClick={() => deleteMutation.mutate(service.id)}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Sil
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </Draggable>
                ))
              )}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}
