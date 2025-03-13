import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { insertPatientSchema, insertAppointmentSchema } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
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
import type { Service } from "@shared/schema";

interface AppointmentFormProps {
  selectedService?: Service;
}

export default function AppointmentForm({ selectedService }: AppointmentFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm({
    resolver: zodResolver(insertPatientSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      notes: "",
    },
  });

  const createPatient = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", "/api/patients", data);
      return res.json();
    },
  });

  const createAppointment = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", "/api/appointments", data);
      return res.json();
    },
  });

  const onSubmit = async (data: any) => {
    try {
      // First create the patient
      const patient = await createPatient.mutateAsync(data);

      // Then create the appointment
      if (selectedService) {
        await createAppointment.mutateAsync({
          patientId: patient.id,
          serviceId: selectedService.id,
          date: new Date().toISOString(), // You might want to add a date picker here
          status: "pending",
          notes: data.notes,
        });
      }

      queryClient.invalidateQueries({ queryKey: ["/api/appointments"] });
      
      toast({
        title: "Başarılı!",
        description: "Randevunuz başarıyla oluşturuldu.",
      });

      form.reset();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Hata!",
        description: "Randevu oluşturulurken bir hata oluştu.",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ad Soyad</FormLabel>
              <FormControl>
                <Input placeholder="Ad Soyad" {...field} />
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
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="Email" {...field} />
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
                <Input placeholder="Telefon" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notlar</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Eklemek istediğiniz notlar..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full"
          disabled={createPatient.isPending || createAppointment.isPending}
        >
          {createPatient.isPending || createAppointment.isPending
            ? "Gönderiliyor..."
            : "Randevu Oluştur"}
        </Button>
      </form>
    </Form>
  );
}
