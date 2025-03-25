import { useQuery, useMutation } from "@tanstack/react-query";
import { Setting } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

export default function AdminSettings() {
  const { toast } = useToast();
  const [showSecrets, setShowSecrets] = useState(false);

  const { data: settings, isLoading } = useQuery<Setting[]>({
    queryKey: ["/api/settings"],
  });

  const updateSetting = useMutation({
    mutationFn: async ({ key, value }: { key: string; value: string }) => {
      const res = await apiRequest("PATCH", `/api/settings/${key}`, { value });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/settings"] });
      toast({
        title: "Ayarlar güncellendi",
        description: "Değişiklikler başarıyla kaydedildi.",
      });
    },
    onError: (error) => {
      toast({
        title: "Hata",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Ayarları gruplara ayır
  const getSettingsByGroup = (group: string) => {
    return settings?.filter(setting => setting.group === group) || [];
  };

  const handleToggleSecrets = () => {
    setShowSecrets(!showSecrets);
  };

  const renderSettingInput = (setting: Setting) => {
    const isSecret = setting.type === 'secret';
    return (
      <div className="flex gap-2" key={setting.key}>
        <Input
          type={isSecret && !showSecrets ? "password" : "text"}
          defaultValue={setting.value}
          placeholder={setting.label}
          onBlur={(e) =>
            updateSetting.mutate({
              key: setting.key,
              value: e.target.value,
            })
          }
        />
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Site Ayarları</h1>
          <p className="text-muted-foreground">
            Sistem yapılandırması ve entegrasyon ayarları
          </p>
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={handleToggleSecrets}
        >
          {showSecrets ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </Button>
      </div>

      {isLoading ? (
        <div>Yükleniyor...</div>
      ) : (
        <Tabs defaultValue="admin" className="space-y-4">
          <TabsList>
            <TabsTrigger value="admin">Admin Ayarları</TabsTrigger>
            <TabsTrigger value="general">Genel Ayarlar</TabsTrigger>
          </TabsList>

          <TabsContent value="admin">
            <Card>
              <CardHeader>
                <CardTitle>Admin Paneli Ayarları</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {getSettingsByGroup('admin').map((setting) => (
                  <div key={setting.key} className="space-y-2">
                    <label className="text-sm font-medium">
                      {setting.label}
                      {setting.description && (
                        <span className="text-xs text-muted-foreground ml-2">
                          ({setting.description})
                        </span>
                      )}
                    </label>
                    {renderSettingInput(setting)}
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>Genel Site Ayarları</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {getSettingsByGroup('general').map((setting) => (
                  <div key={setting.key} className="space-y-2">
                    <label className="text-sm font-medium">
                      {setting.label}
                      {setting.description && (
                        <span className="text-xs text-muted-foreground ml-2">
                          ({setting.description})
                        </span>
                      )}
                    </label>
                    {renderSettingInput(setting)}
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}