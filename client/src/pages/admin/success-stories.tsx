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
                <h3 className="font-semibold">{story.patientName}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {story.treatmentType}
                </p>
                <p className="mt-2">{story.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}