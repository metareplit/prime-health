import { useQuery, useMutation } from "@tanstack/react-query";
import { Setting } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

export default function AdminSettings() {
  const { toast } = useToast();
  
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

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Site Ayarları</h1>
      </div>

      {isLoading ? (
        <div>Yükleniyor...</div>
      ) : (
        <div className="grid gap-4">
          {settings?.map((setting) => (
            <Card key={setting.key}>
              <CardHeader>
                <CardTitle className="text-lg">{setting.label}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  {setting.description}
                </p>
                <div className="flex gap-2">
                  <Input
                    type="text"
                    defaultValue={setting.value}
                    onBlur={(e) =>
                      updateSetting.mutate({
                        key: setting.key,
                        value: e.target.value,
                      })
                    }
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
