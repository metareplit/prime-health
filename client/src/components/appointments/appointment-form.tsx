import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { insertAppointmentSchema } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Service } from "@shared/schema";

interface AppointmentFormProps {
  selectedService?: Service;
}

const timeSlots = [
  "09:00", "10:00", "11:00", "12:00", "14:00", "15:00", "16:00", "17:00"
];

export default function AppointmentForm({ selectedService }: AppointmentFormProps) {
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(insertAppointmentSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      date: new Date().toISOString().split('T')[0],
      time: "09:00",
      notes: "",
      type: "initial",
      status: "confirmed",
    },
  });

  const createAppointment = useMutation({
    mutationFn: async (data: any) => {
      console.log("Gönderilen randevu verisi:", data); // Debug için log
      const res = await apiRequest("POST", "/api/appointments", data);
      return res.json();
    },
  });

  const onSubmit = async (data: any) => {
    try {
      if (selectedService) {
        const appointmentData = {
          fullName: data.fullName,
          phone: data.phone,
          email: data.email,
          date: new Date(data.date).toISOString(),
          time: data.time,
          status: "confirmed",
          type: "initial",
          serviceId: selectedService.id,
          notes: data.notes || "",
        };

        console.log("Oluşturulan randevu:", appointmentData); // Debug için log
        await createAppointment.mutateAsync(appointmentData);
      }

      queryClient.invalidateQueries({ queryKey: ["/api/appointments"] });

      toast({
        title: "Başarılı!",
        description: "Randevunuz başarıyla oluşturuldu.",
      });

      form.reset();
    } catch (error) {
      console.error("Randevu oluşturma hatası:", error); // Debug için log
      toast({
        variant: "destructive",
        title: "Hata!",
        description: "Randevu oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-center">
          Randevu Oluştur
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ad Soyad</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Ad Soyad" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-posta</FormLabel>
                  <FormControl>
                    <Input {...field} type="email" placeholder="E-posta adresiniz" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telefon</FormLabel>
                  <FormControl>
                    <PhoneInput
                      country={'tr'}
                      value={field.value}
                      onChange={phone => field.onChange(phone)}
                      inputClass="w-full !h-10"
                      containerClass="!w-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tarih</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        {...field}
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Saat</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Saat seçin" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {timeSlots.map((time) => (
                          <SelectItem key={time} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notlar</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Randevu ile ilgili eklemek istediğiniz notlar..."
                      className="min-h-[100px]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full"
              disabled={createAppointment.isPending}
            >
              {createAppointment.isPending ? (
                "Randevu Oluşturuluyor..."
              ) : (
                "Randevu Oluştur"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}