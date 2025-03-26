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
import { Textarea } from "@/components/ui/textarea";

export default function NewAppointment() {
  const { toast } = useToast();
  const [, navigate] = useLocation();

  const form = useForm({
    resolver: zodResolver(insertAppointmentSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      date: new Date().toISOString().split('T')[0],
      time: "09:00",
      notes: "",
      status: "confirmed", // Direkt onaylı olarak oluştur
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
    // Tarih ve saati birleştir
    const appointmentDateTime = new Date(data.date + 'T' + data.time);
    const formData = {
      ...data,
      date: appointmentDateTime.toISOString(),
    };
    createAppointment.mutate(formData);
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
              <label className="text-sm font-medium">Ad Soyad</label>
              <Input
                {...form.register("fullName")}
                placeholder="Hasta adı ve soyadı"
              />
              {form.formState.errors.fullName && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.fullName.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">E-posta</label>
              <Input
                {...form.register("email")}
                type="email"
                placeholder="E-posta adresi"
              />
              {form.formState.errors.email && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Telefon</label>
              <Input
                {...form.register("phone")}
                placeholder="Telefon numarası"
              />
              {form.formState.errors.phone && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.phone.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Tarih</label>
                <Input
                  {...form.register("date")}
                  type="date"
                  min={new Date().toISOString().split('T')[0]}
                />
                {form.formState.errors.date && (
                  <p className="text-sm text-red-500">
                    {form.formState.errors.date.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Saat</label>
                <Input
                  {...form.register("time")}
                  type="time"
                  min="09:00"
                  max="18:00"
                  step="1800"
                />
                {form.formState.errors.time && (
                  <p className="text-sm text-red-500">
                    {form.formState.errors.time.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Notlar</label>
              <Textarea
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