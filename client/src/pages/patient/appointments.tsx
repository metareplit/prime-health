import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Calendar, Clock, CheckCircle, XCircle, Upload, Loader2 } from "lucide-react";
import type { Appointment, Service } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";

export default function PatientAppointments() {
  const { toast } = useToast();
  const [isCreating, setIsCreating] = useState(false);
  const [selectedService, setSelectedService] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [appointmentType, setAppointmentType] = useState("initial");
  const [notes, setNotes] = useState("");
  const [documents, setDocuments] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const { data: appointments, isLoading } = useQuery<Appointment[]>({
    queryKey: ["/api/appointments"],
  });

  const { data: services } = useQuery<Service[]>({
    queryKey: ["/api/services"],
  });

  const createAppointmentMutation = useMutation({
    mutationFn: async () => {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("serviceId", selectedService);
      formData.append("date", selectedDate);
      formData.append("time", selectedTime);
      formData.append("type", appointmentType);
      formData.append("patientNotes", notes);

      documents.forEach(file => {
        formData.append("documents", file);
      });

      const res = await apiRequest("POST", "/api/appointments", formData);
      return res.json();
    },
    onSuccess: () => {
      // Hem hasta hem de admin panelindeki randevu listelerini güncelle
      queryClient.invalidateQueries({ queryKey: ["/api/appointments"] });
      setIsCreating(false);
      resetForm();
      toast({
        title: "Başarılı",
        description: "Randevu talebiniz başarıyla oluşturuldu.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Hata",
        description: "Randevu oluşturulurken bir hata oluştu: " + error.message,
        variant: "destructive",
      });
    },
    onSettled: () => {
      setIsUploading(false);
    },
  });

  const resetForm = () => {
    setSelectedService("");
    setSelectedDate("");
    setSelectedTime("");
    setAppointmentType("initial");
    setNotes("");
    setDocuments([]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService || !selectedDate || !selectedTime) {
      toast({
        title: "Hata",
        description: "Lütfen tüm zorunlu alanları doldurun.",
        variant: "destructive",
      });
      return;
    }
    createAppointmentMutation.mutate();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const totalSize = files.reduce((acc, file) => acc + file.size, 0);
      const maxSize = 10 * 1024 * 1024; // 10MB

      if (totalSize > maxSize) {
        toast({
          title: "Hata",
          description: "Toplam dosya boyutu 10MB'ı geçemez.",
          variant: "destructive",
        });
        return;
      }

      setDocuments(files);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Randevularım</h1>
          <Button onClick={() => setIsCreating(!isCreating)}>
            <Calendar className="h-4 w-4 mr-2" />
            {isCreating ? "İptal" : "Yeni Randevu"}
          </Button>
        </div>

        {isCreating && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Yeni Randevu Talebi</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Hizmet Seçimi</label>
                  <Select
                    value={selectedService}
                    onValueChange={setSelectedService}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Hizmet seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      {services?.map((service) => (
                        <SelectItem key={service.id} value={service.id.toString()}>
                          {service.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Tarih</label>
                    <Input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      min={new Date().toISOString().split("T")[0]}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Saat</label>
                    <Input
                      type="time"
                      value={selectedTime}
                      onChange={(e) => setSelectedTime(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Randevu Tipi</label>
                  <Select
                    value={appointmentType}
                    onValueChange={setAppointmentType}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="initial">İlk Muayene</SelectItem>
                      <SelectItem value="followup">Kontrol</SelectItem>
                      <SelectItem value="control">Düzenli Kontrol</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Notlar</label>
                  <Textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Eklemek istediğiniz notlar..."
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Dökümanlar</label>
                  <Input
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx,image/*"
                    className="cursor-pointer"
                  />
                  {documents.length > 0 && (
                    <p className="text-sm text-muted-foreground">
                      Seçilen dosya sayısı: {documents.length}
                    </p>
                  )}
                </div>

                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsCreating(false);
                      resetForm();
                    }}
                    disabled={isUploading}
                  >
                    İptal
                  </Button>
                  <Button type="submit" disabled={isUploading}>
                    {isUploading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Oluşturuluyor...
                      </>
                    ) : (
                      "Randevu Oluştur"
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Randevularım</CardTitle>
          </CardHeader>
          <CardContent>
            {appointments?.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Calendar className="h-12 w-12 mx-auto mb-4 opacity-20" />
                <p>Henüz randevunuz bulunmuyor.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {appointments?.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Calendar className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{services?.find(s => s.id === appointment.serviceId)?.name}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          {new Date(appointment.date).toLocaleDateString()} - {appointment.time}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        {appointment.status === "confirmed" ? (
                          <div className="flex items-center text-green-600">
                            <CheckCircle className="h-4 w-4 mr-1" />
                            <span className="text-sm">Onaylandı</span>
                          </div>
                        ) : appointment.status === "pending" ? (
                          <div className="flex items-center text-yellow-600">
                            <Clock className="h-4 w-4 mr-1" />
                            <span className="text-sm">Beklemede</span>
                          </div>
                        ) : appointment.status === "cancelled" ? (
                          <div className="flex items-center text-red-600">
                            <XCircle className="h-4 w-4 mr-1" />
                            <span className="text-sm">İptal Edildi</span>
                          </div>
                        ) : (
                          <div className="flex items-center text-green-600">
                            <CheckCircle className="h-4 w-4 mr-1" />
                            <span className="text-sm">Tamamlandı</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}