import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { insertPatientSchema, insertAppointmentSchema } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion, AnimatePresence } from "framer-motion";
import { User, Phone, CalendarDays, Clock, FileText, CheckCircle2, ArrowRight } from "lucide-react";
import type { Service } from "@shared/schema";

interface AppointmentFormProps {
  selectedService?: Service;
}

const timeSlots = [
  "09:00", "10:00", "11:00", "12:00", "14:00", "15:00", "16:00", "17:00"
];

const genderOptions = [
  { label: "Erkek", value: "male" },
  { label: "Kadın", value: "female" },
];

const communicationPreferences = [
  { id: "whatsapp", label: "WhatsApp" },
  { id: "phone", label: "Telefon" },
];

export default function AppointmentForm({ selectedService }: AppointmentFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm({
    resolver: zodResolver(insertPatientSchema),
    defaultValues: {
      step: "personal",
      name: "",
      phone: "",
      age: "",
      gender: "",
      communicationPreferences: [],
      previousTreatments: "",
      medicalConditions: "",
      preferredDate: new Date(),
      preferredTime: "",
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
      const patient = await createPatient.mutateAsync(data);

      if (selectedService) {
        await createAppointment.mutateAsync({
          patientId: patient.id,
          serviceId: selectedService.id,
          date: new Date(data.preferredDate).toISOString(),
          time: data.preferredTime,
          status: "pending",
          notes: data.notes,
        });
      }

      queryClient.invalidateQueries({ queryKey: ["/api/appointments"] });

      toast({
        title: "Başarılı!",
        description: "Danışmanlık talebiniz başarıyla alındı. En kısa sürede sizinle iletişime geçeceğiz.",
      });

      form.reset();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Hata!",
        description: "Randevu oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.",
      });
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Tabs value={form.watch("step")} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="personal" className="data-[state=active]:bg-primary data-[state=active]:text-white">
            <User className="h-4 w-4 mr-2" />
            Kişisel Bilgiler
          </TabsTrigger>
          <TabsTrigger value="medical" className="data-[state=active]:bg-primary data-[state=active]:text-white">
            <FileText className="h-4 w-4 mr-2" />
            Sağlık Bilgileri
          </TabsTrigger>
          <TabsTrigger value="appointment" className="data-[state=active]:bg-primary data-[state=active]:text-white">
            <CalendarDays className="h-4 w-4 mr-2" />
            Randevu Detayları
          </TabsTrigger>
        </TabsList>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <AnimatePresence mode="wait">
              <TabsContent value="personal">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl font-semibold text-center">
                      Kişisel Bilgileriniz
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-6">
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="space-y-6"
                    >
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Ad Soyad</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Ad Soyad" 
                                {...field} 
                                className="bg-white/50 backdrop-blur-sm"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="age"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Yaş</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  placeholder="Yaş" 
                                  {...field} 
                                  className="bg-white/50 backdrop-blur-sm"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="gender"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Cinsiyet</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger className="bg-white/50 backdrop-blur-sm">
                                    <SelectValue placeholder="Seçiniz" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {genderOptions.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                      {option.label}
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
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Telefon</FormLabel>
                            <FormControl>
                              <div className="react-tel-input">
                                <PhoneInput
                                  country={'tr'}
                                  value={field.value}
                                  onChange={phone => field.onChange(phone)}
                                  inputClass="w-full !h-10 !bg-white/50 backdrop-blur-sm !border-input !pl-[48px]"
                                  containerClass="!w-full"
                                  buttonClass="!border-input !h-10 !bg-white/50"
                                  searchClass="!bg-white"
                                  dropdownClass="!bg-white"
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="communicationPreferences"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>İletişim Tercihleri</FormLabel>
                            <div className="grid grid-cols-2 gap-4 mt-2">
                              {communicationPreferences.map((item) => (
                                <FormField
                                  key={item.id}
                                  control={form.control}
                                  name="communicationPreferences"
                                  render={({ field }) => (
                                    <FormItem key={item.id}>
                                      <FormControl>
                                        <div className="flex items-center space-x-2 p-3 rounded-lg border bg-white/50 backdrop-blur-sm hover:bg-white/80 transition-colors">
                                          <Checkbox
                                            checked={field.value?.includes(item.id)}
                                            onCheckedChange={(checked) => {
                                              return checked
                                                ? field.onChange([...field.value, item.id])
                                                : field.onChange(
                                                    field.value?.filter((value) => value !== item.id)
                                                  );
                                            }}
                                          />
                                          <FormLabel className="text-sm font-normal cursor-pointer">
                                            {item.label}
                                          </FormLabel>
                                        </div>
                                      </FormControl>
                                    </FormItem>
                                  )}
                                />
                              ))}
                            </div>
                            <FormDescription>
                              Size nasıl ulaşmamızı tercih edersiniz?
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button
                        type="button"
                        className="w-full bg-primary/90 hover:bg-primary"
                        onClick={() => form.setValue("step", "medical")}
                      >
                        Devam Et
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </motion.div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="medical">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl font-semibold text-center">
                      Sağlık Bilgileriniz
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-6">
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="space-y-6"
                    >
                      <FormField
                        control={form.control}
                        name="previousTreatments"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Daha Önce Aldığınız Tedaviler</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Varsa daha önce aldığınız tedavileri belirtiniz..."
                                className="min-h-[100px] bg-white/50 backdrop-blur-sm"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="medicalConditions"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Sağlık Durumu</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Varsa kronik rahatsızlıklarınızı veya düzenli kullandığınız ilaçları belirtiniz..."
                                className="min-h-[100px] bg-white/50 backdrop-blur-sm"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button
                        type="button"
                        className="w-full bg-primary/90 hover:bg-primary"
                        onClick={() => form.setValue("step", "appointment")}
                      >
                        Devam Et
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </motion.div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="appointment">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl font-semibold text-center">
                      Randevu Detayları
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-6">
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="space-y-6"
                    >
                      <FormField
                        control={form.control}
                        name="preferredDate"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>Tercih Ettiğiniz Tarih</FormLabel>
                            <FormControl>
                              <div className="border rounded-lg p-4 bg-white/50 backdrop-blur-sm">
                                <Calendar
                                  mode="single"
                                  selected={field.value}
                                  onSelect={field.onChange}
                                  className="mx-auto"
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="preferredTime"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tercih Ettiğiniz Saat</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="bg-white/50 backdrop-blur-sm">
                                  <SelectValue placeholder="Saat seçiniz" />
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

                      <FormField
                        control={form.control}
                        name="notes"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Ek Notlar</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Eklemek istediğiniz notlar..."
                                className="min-h-[100px] bg-white/50 backdrop-blur-sm"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button
                        type="submit"
                        className="w-full bg-primary/90 hover:bg-primary"
                        disabled={createPatient.isPending || createAppointment.isPending}
                      >
                        {createPatient.isPending || createAppointment.isPending ? (
                          "Gönderiliyor..."
                        ) : (
                          <>
                            Randevu Oluştur
                            <CheckCircle2 className="ml-2 h-4 w-4" />
                          </>
                        )}
                      </Button>
                    </motion.div>
                  </CardContent>
                </Card>
              </TabsContent>
            </AnimatePresence>
          </form>
        </Form>
      </Tabs>
    </div>
  );
}