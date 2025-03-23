import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Plus, Mail, Edit, Trash2 } from "lucide-react";

interface EmailTemplate {
  id: number;
  name: string;
  subject: string;
  body: string;
  type: "appointment_reminder" | "welcome" | "custom";
  variables: string[];
}

export default function EmailTemplates() {
  const { toast } = useToast();
  const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | null>(null);

  const { data: templates, isLoading } = useQuery<EmailTemplate[]>({
    queryKey: ["/api/email-templates"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: Omit<EmailTemplate, "id">) => {
      const res = await apiRequest("POST", "/api/email-templates", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/email-templates"] });
      toast({
        title: "Başarılı",
        description: "Email şablonu oluşturuldu.",
      });
      setEditingTemplate(null);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: EmailTemplate) => {
      const res = await apiRequest("PATCH", `/api/email-templates/${data.id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/email-templates"] });
      toast({
        title: "Başarılı",
        description: "Email şablonu güncellendi.",
      });
      setEditingTemplate(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/email-templates/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/email-templates"] });
      toast({
        title: "Başarılı",
        description: "Email şablonu silindi.",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTemplate) {
      if (editingTemplate.id) {
        updateMutation.mutate(editingTemplate);
      } else {
        const { id, ...templateData } = editingTemplate;
        createMutation.mutate(templateData);
      }
    }
  };

  const handleCreate = () => {
    setEditingTemplate({
      id: 0,
      name: "",
      subject: "",
      body: "",
      type: "custom",
      variables: [],
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Email Şablonları</h1>
          <p className="text-muted-foreground">
            Otomatik email şablonlarını yönetin
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Yeni Şablon
        </Button>
      </div>

      <div className="grid gap-6">
        {editingTemplate && (
          <Card>
            <CardHeader>
              <CardTitle>
                {editingTemplate.id ? "Şablonu Düzenle" : "Yeni Şablon"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Şablon Adı</label>
                  <Input
                    value={editingTemplate.name}
                    onChange={(e) =>
                      setEditingTemplate({
                        ...editingTemplate,
                        name: e.target.value,
                      })
                    }
                    placeholder="Şablon adı..."
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Şablon Tipi</label>
                  <Select
                    value={editingTemplate.type}
                    onValueChange={(value: EmailTemplate["type"]) =>
                      setEditingTemplate({
                        ...editingTemplate,
                        type: value,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Şablon tipi seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="appointment_reminder">
                        Randevu Hatırlatma
                      </SelectItem>
                      <SelectItem value="welcome">Hoş Geldiniz</SelectItem>
                      <SelectItem value="custom">Özel</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Email Konusu</label>
                  <Input
                    value={editingTemplate.subject}
                    onChange={(e) =>
                      setEditingTemplate({
                        ...editingTemplate,
                        subject: e.target.value,
                      })
                    }
                    placeholder="Email konusu..."
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Email İçeriği</label>
                  <div className="text-xs text-muted-foreground mb-2">
                    Kullanılabilir değişkenler: {"{name}"}, {"{date}"}, {"{time}"}, {"{service}"}
                  </div>
                  <Textarea
                    value={editingTemplate.body}
                    onChange={(e) =>
                      setEditingTemplate({
                        ...editingTemplate,
                        body: e.target.value,
                      })
                    }
                    placeholder="Email içeriği..."
                    rows={10}
                  />
                </div>

                <div className="flex gap-2 justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setEditingTemplate(null)}
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
            <Mail className="mx-auto h-10 w-10 mb-4 animate-pulse" />
            <p>Şablonlar yükleniyor...</p>
          </div>
        ) : templates?.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Mail className="mx-auto h-10 w-10 mb-4" />
            <p>Henüz email şablonu bulunmuyor</p>
          </div>
        ) : (
          templates?.map((template) => (
            <Card key={template.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                    {template.name}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingTemplate(template)}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Düzenle
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-500 hover:text-red-600"
                      onClick={() => deleteMutation.mutate(template.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Sil
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <span className="font-medium">Tip: </span>
                    <span className="text-muted-foreground">
                      {template.type === "appointment_reminder"
                        ? "Randevu Hatırlatma"
                        : template.type === "welcome"
                        ? "Hoş Geldiniz"
                        : "Özel"}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium">Konu: </span>
                    <span className="text-muted-foreground">
                      {template.subject}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium">İçerik: </span>
                    <p className="text-muted-foreground whitespace-pre-line mt-2">
                      {template.body}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
