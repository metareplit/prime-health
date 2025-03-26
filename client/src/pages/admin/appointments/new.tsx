import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertAppointmentSchema } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useLocation } from "wouter";

export default function NewAppointment() {
  const { toast } = useToast();
  const [, navigate] = useLocation();

  const form = useForm({
    resolver: zodResolver(insertAppointmentSchema),
    defaultValues: {
      patientId: "",
      date: new Date().toISOString().split('T')[0],
      status: "pending",
      notes: "",
    },
  });

  const createAppointment = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/appointments", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/appointments"] });
      toast({
        title: "Randevu oluşturuldu",
        description: "Yeni randevu başarıyla oluşturuldu.",
      });
      navigate("/admin/appointments");
    },
    onError: (error: any) => {
      toast({
        title: "Hata",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: any) => {
    createAppointment.mutate(data);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Yeni Randevu</h1>
          <p className="text-muted-foreground">
            Yeni bir randevu oluşturun
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Randevu Bilgileri</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Hasta ID</label>
              <Input
                {...form.register("patientId")}
                type="number"
                placeholder="Hasta ID giriniz"
              />
              {form.formState.errors.patientId && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.patientId.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Randevu Tarihi</label>
              <Input
                {...form.register("date")}
                type="date"
              />
              {form.formState.errors.date && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.date.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Notlar</label>
              <Input
                {...form.register("notes")}
                placeholder="Randevu ile ilgili notlar..."
              />
            </div>

            <Button
              type="submit"
              disabled={createAppointment.isPending}
              className="w-full"
            >
              {createAppointment.isPending ? "Oluşturuluyor..." : "Randevu Oluştur"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
