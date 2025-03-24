import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";
import { tr } from "date-fns/locale";
import { Metadata } from "@/components/ui/metadata";
import { Clock, Calendar as CalendarIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNotifications } from "@/hooks/use-notifications";
import { useAuth } from "@/lib/auth";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const appointmentSchema = z.object({
  phone: z.string().min(10, "Geçerli bir telefon numarası giriniz"),
  name: z.string().min(2, "İsim en az 2 karakter olmalıdır"),
});

type AppointmentFormData = z.infer<typeof appointmentSchema>;

export default function Appointment() {
  const { t } = useTranslation('common');
  const [date, setDate] = useState<Date | undefined>(new Date());
  const { sendSMSMutation } = useNotifications();
  const { user } = useAuth();

  const form = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      name: user ? `${user.firstName} ${user.lastName}` : '',
      phone: '',
    },
  });

  const onSubmit = async (data: AppointmentFormData) => {
    if (!date) return;

    const formattedDate = date.toLocaleDateString('tr-TR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    await sendSMSMutation.mutate({
      to: data.phone,
      templateName: 'appointmentConfirmation',
      templateData: {
        name: data.name,
        date: formattedDate,
        time: '10:00' // Bu sabit değer yerine seçilen saat kullanılabilir
      }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-transparent py-6 md:py-10">
      <Metadata 
        title={t('patient.appointments.createTitle')}
        description={t('patient.appointments.createDescription')}
        keywords="saç ekimi randevu, estetik operasyon randevu, online konsültasyon, ücretsiz danışmanlık"
        type="website"
      />

      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8 md:mb-10">
            <h1 className="text-2xl md:text-4xl font-bold mb-3 md:mb-4">
              {t('patient.appointments.createTitle')}
            </h1>
            <p className="text-base md:text-lg text-gray-600">
              {t('patient.appointments.createDescription')}
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <Card className="bg-white/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CalendarIcon className="h-5 w-5 text-primary" />
                      {t('patient.appointments.selectDate')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      locale={tr}
                      className="rounded-md border"
                      disabled={(date) => date < new Date()}
                      aria-label={t('patient.appointments.selectDate')}
                    />
                  </CardContent>
                </Card>

                <Card className="bg-white/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-primary" />
                      {t('patient.appointments.appointmentDetails')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>İsim Soyisim</FormLabel>
                          <FormControl>
                            <Input {...field} />
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
                            <Input {...field} type="tel" placeholder="+90" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div>
                      <h3 className="font-medium mb-2">{t('patient.appointments.selectedDate')}</h3>
                      <p className="text-gray-600">
                        {date?.toLocaleDateString('tr-TR', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>

                    <Button 
                      type="submit"
                      className="w-full bg-primary/90 hover:bg-primary"
                      size="lg"
                      disabled={sendSMSMutation.isPending}
                    >
                      {sendSMSMutation.isPending ? "Gönderiliyor..." : t('patient.appointments.createButton')}
                    </Button>

                    <p className="text-sm text-gray-500 text-center">
                      {t('patient.appointments.contactNote')}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}