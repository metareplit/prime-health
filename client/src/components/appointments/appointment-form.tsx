import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { insertAppointmentSchema } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation('common');
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
      const res = await apiRequest("POST", "/api/appointments", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/appointments"] });
      toast({
        title: t('appointment.form.success'),
        description: t('appointment.form.success'),
      });
      form.reset();
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: t('appointment.form.error'),
        description: t('appointment.form.error'),
      });
    },
  });

  const onSubmit = (data: any) => {
    if (selectedService) {
      createAppointment.mutate({
        ...data,
        serviceId: selectedService.id,
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-center">
          {t('appointment.title')}
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
                  <FormLabel>{t('appointment.form.fullName')}</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder={t('appointment.form.fullName')} />
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
                  <FormLabel>{t('appointment.form.email')}</FormLabel>
                  <FormControl>
                    <Input {...field} type="email" placeholder={t('appointment.form.email')} />
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
                  <FormLabel>{t('appointment.form.phone')}</FormLabel>
                  <FormControl>
                    <PhoneInput
                      country={'tr'}
                      value={field.value}
                      onChange={phone => field.onChange(phone)}
                      inputClass="w-full !h-10"
                      containerClass="!w-full"
                      preferredCountries={['tr', 'ru', 'ge', 'az']}
                      enableSearch={true}
                      searchPlaceholder={t('appointment.form.searchCountry')}
                      searchNotFound={t('appointment.form.countryNotFound')}
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
                    <FormLabel>{t('appointment.form.date')}</FormLabel>
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
                    <FormLabel>{t('appointment.form.time')}</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t('appointment.form.time')} />
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
                  <FormLabel>{t('appointment.form.notes')}</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder={t('appointment.form.notes')}
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
                t('appointment.form.loading')
              ) : (
                t('appointment.form.submit')
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}