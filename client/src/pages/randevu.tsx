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
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

const appointmentSchema = z.object({
  phone: z.string().min(10, "Geçerli bir telefon numarası giriniz"),
  name: z.string().min(2, "İsim en az 2 karakter olmalıdır"),
  age: z.string().min(1, "Yaş bilgisi zorunludur"),
  medicalHistory: z.string().optional(),
  serviceType: z.enum(['sac-ekimi', 'sakal-ekimi', 'kas-ekimi', 'prp'], {
    required_error: "Lütfen bir hizmet seçin",
  }),
});

type AppointmentFormData = z.infer<typeof appointmentSchema>;

export default function Appointment() {
  const { t } = useTranslation('common');
  const [date, setDate] = useState<Date | undefined>(new Date());
  const { sendSMSMutation } = useNotifications();
  // Remove user from Auth since our current AuthContext doesn't have it
  // const { user } = useAuth();

  const form = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      name: '',
      phone: '',
      age: '',
      medicalHistory: '',
      serviceType: undefined,
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
        time: '10:00'
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
                          <FormLabel>{t('patient.appointments.fullName')}</FormLabel>
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
                          <FormLabel>{t('patient.appointments.phone')}</FormLabel>
                          <FormControl>
                            <PhoneInput
                              country={'tr'}
                              value={field.value}
                              onChange={(phone) => field.onChange(phone)}
                              inputClass="!w-full !h-10 !text-base !px-10"
                              containerClass="!w-full"
                              buttonClass="!h-10 !w-10 !border !border-input"
                              dropdownClass="!w-[300px]"
                              preferredCountries={['tr', 'ru', 'ge', 'az']}
                              enableSearch={true}
                              searchPlaceholder={t('patient.appointments.searchCountry')}
                              searchNotFound={t('patient.appointments.countryNotFound')}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="age"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('patient.appointments.age')}</FormLabel>
                          <FormControl>
                            <Input {...field} type="number" min="18" max="100" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="medicalHistory"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('patient.appointments.medicalHistory')}</FormLabel>
                          <FormControl>
                            <Textarea 
                              {...field} 
                              placeholder={t('patient.appointments.medicalHistoryPlaceholder')}
                              className="resize-none"
                              rows={3}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="serviceType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('patient.appointments.serviceType')}</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              value={field.value}
                              className="grid grid-cols-2 gap-4"
                            >
                              <FormItem className="flex items-center space-x-2">
                                <FormControl>
                                  <RadioGroupItem value="sac-ekimi" />
                                </FormControl>
                                <FormLabel className="font-normal cursor-pointer">
                                  {t('patient.appointments.hairTransplant')}
                                </FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-2">
                                <FormControl>
                                  <RadioGroupItem value="sakal-ekimi" />
                                </FormControl>
                                <FormLabel className="font-normal cursor-pointer">
                                  {t('patient.appointments.beardTransplant')}
                                </FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-2">
                                <FormControl>
                                  <RadioGroupItem value="kas-ekimi" />
                                </FormControl>
                                <FormLabel className="font-normal cursor-pointer">
                                  {t('patient.appointments.eyebrowTransplant')}
                                </FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-2">
                                <FormControl>
                                  <RadioGroupItem value="prp" />
                                </FormControl>
                                <FormLabel className="font-normal cursor-pointer">
                                  {t('patient.appointments.prpTreatment')}
                                </FormLabel>
                              </FormItem>
                            </RadioGroup>
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