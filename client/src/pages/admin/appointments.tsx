import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Calendar, Clock, CheckCircle, XCircle, Search, Upload, Loader2 } from "lucide-react";
import type { Appointment, User, Service } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";

export default function AdminAppointments() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState("");
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [doctorNotes, setDoctorNotes] = useState("");
  const [documents, setDocuments] = useState<File[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);

  const { data: appointments, isLoading } = useQuery<Appointment[]>({
    queryKey: ["/api/appointments"],
  });

  const { data: patients } = useQuery<User[]>({
    queryKey: ["/api/users/patients"],
  });

  const { data: doctors } = useQuery<User[]>({
    queryKey: ["/api/users/doctors"],
  });

  const { data: services } = useQuery<Service[]>({
    queryKey: ["/api/services"],
  });

  const updateAppointmentMutation = useMutation({
    mutationFn: async (data: Partial<Appointment>) => {
      setIsUploading(true);
      const formData = new FormData();
      
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined) {
          formData.append(key, value.toString());
        }
      });

      documents.forEach(file => {
        formData.append("documents", file);
      });

      const res = await apiRequest(
        "PATCH", 
        `/api/appointments/${selectedAppointment?.id}`,
        formData
      );
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/appointments"] });
      setSelectedAppointment(null);
      setDoctorNotes("");
      setDocuments([]);
      toast({
        title: "Başarılı",
        description: "Randevu başarıyla güncellendi.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Hata",
        description: "Güncelleme sırasında bir hata oluştu: " + error.message,
        variant: "destructive",
      });
    },
    onSettled: () => {
      setIsUploading(false);
    },
  });

  const handleStatusChange = async (status: string) => {
    if (!selectedAppointment) return;
    updateAppointmentMutation.mutate({ status });
  };

  const handleDoctorAssign = async () => {
    if (!selectedAppointment || !selectedDoctor) return;
    updateAppointmentMutation.mutate({ doctorId: parseInt(selectedDoctor) });
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

  const filteredAppointments = appointments?.filter(appointment => {
    const patient = patients?.find(p => p.id === appointment.patientId);
    const matchesSearch = 
      patient?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient?.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || appointment.status === statusFilter;
    const matchesDate = !dateFilter || appointment.date.startsWith(dateFilter);

    return matchesSearch && matchesStatus && matchesDate;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Randevu Yönetimi</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filtreler</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Hasta ara..."
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Durum seçin" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tümü</SelectItem>
                <SelectItem value="pending">Bekleyen</SelectItem>
                <SelectItem value="confirmed">Onaylanan</SelectItem>
                <SelectItem value="completed">Tamamlanan</SelectItem>
                <SelectItem value="cancelled">İptal Edilen</SelectItem>
              </SelectContent>
            </Select>
            <Input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Randevular</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredAppointments?.map((appointment) => {
                const patient = patients?.find(p => p.id === appointment.patientId);
                const service = services?.find(s => s.id === appointment.serviceId);
                
                return (
                  <div
                    key={appointment.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedAppointment?.id === appointment.id
                        ? "border-primary bg-primary/5"
                        : "hover:bg-muted"
                    }`}
                    onClick={() => setSelectedAppointment(appointment)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{patient?.fullName}</p>
                        <p className="text-sm text-muted-foreground">{service?.name}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(appointment.date).toLocaleDateString()} - {appointment.time}
                        </div>
                      </div>
                      <div>
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
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Randevu Detayları</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedAppointment ? (
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => handleStatusChange("confirmed")}
                      disabled={selectedAppointment.status === "confirmed"}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Onayla
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => handleStatusChange("cancelled")}
                      disabled={selectedAppointment.status === "cancelled"}
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      İptal Et
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Doktor Ataması</label>
                    <div className="flex gap-2">
                      <Select
                        value={selectedDoctor}
                        onValueChange={setSelectedDoctor}
                      >
                        <SelectTrigger className="flex-1">
                          <SelectValue placeholder="Doktor seçin" />
                        </SelectTrigger>
                        <SelectContent>
                          {doctors?.map((doctor) => (
                            <SelectItem
                              key={doctor.id}
                              value={doctor.id.toString()}
                            >
                              {doctor.fullName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button
                        onClick={handleDoctorAssign}
                        disabled={!selectedDoctor}
                      >
                        Ata
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Doktor Notları</label>
                    <Textarea
                      value={doctorNotes}
                      onChange={(e) => setDoctorNotes(e.target.value)}
                      placeholder="Doktor notları..."
                      rows={4}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Döküman Yükle</label>
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

                  <Button
                    className="w-full"
                    onClick={() => {
                      if (!selectedAppointment) return;
                      updateAppointmentMutation.mutate({
                        doctorNotes,
                      });
                    }}
                    disabled={isUploading}
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Güncelleniyor...
                      </>
                    ) : (
                      "Değişiklikleri Kaydet"
                    )}
                  </Button>
                </div>

                {selectedAppointment.patientNotes && (
                  <div className="pt-4 border-t">
                    <p className="text-sm font-medium mb-2">Hasta Notları:</p>
                    <p className="text-sm text-muted-foreground">
                      {selectedAppointment.patientNotes}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Calendar className="h-12 w-12 mx-auto mb-4 opacity-20" />
                <p>Detayları görüntülemek için bir randevu seçin</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
