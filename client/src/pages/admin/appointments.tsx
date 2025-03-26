import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Calendar, Clock, CheckCircle, XCircle, Search, Loader2 } from "lucide-react";
import type { Appointment, Service } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Link } from "wouter";

export default function AdminAppointments() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState("");
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  // Randevuları getir
  const { data: appointments, isLoading: appointmentsLoading } = useQuery<Appointment[]>({
    queryKey: ["/api/appointments"],
    refetchInterval: 10000, // Her 10 saniyede bir yenile
  });

  // Hizmetleri getir
  const { data: services } = useQuery<Service[]>({
    queryKey: ["/api/services"],
  });

  const updateAppointmentMutation = useMutation({
    mutationFn: async (data: Partial<Appointment>) => {
      const res = await apiRequest(
        "PATCH",
        `/api/appointments/${selectedAppointment?.id}/status`,
        data
      );
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/appointments"] });
      setSelectedAppointment(null);
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
  });

  const handleStatusChange = async (status: string) => {
    if (!selectedAppointment) return;
    updateAppointmentMutation.mutate({ status });
  };

  const filteredAppointments = appointments?.filter(appointment => {
    const matchesSearch = appointment.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       appointment.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       appointment.email?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || appointment.status === statusFilter;
    const matchesDate = !dateFilter || new Date(appointment.date).toISOString().split('T')[0] === dateFilter;

    return matchesSearch && matchesStatus && matchesDate;
  });

  if (appointmentsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Randevu Yönetimi</h1>
          <p className="text-muted-foreground">
            Randevuları görüntüleyin ve yönetin
          </p>
        </div>
        <Link href="/admin/appointments/new">
          <Button>
            <Calendar className="h-4 w-4 mr-2" />
            Yeni Randevu
          </Button>
        </Link>
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
                placeholder="Ad, telefon veya e-posta ile ara..."
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Durum seçin" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tümü</SelectItem>
                <SelectItem value="confirmed">Onaylandı</SelectItem>
                <SelectItem value="completed">Tamamlandı</SelectItem>
                <SelectItem value="cancelled">İptal Edildi</SelectItem>
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

      <Card>
        <CardHeader>
          <CardTitle>Randevular</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredAppointments?.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Calendar className="h-12 w-12 mx-auto mb-4 opacity-20" />
                <p>Henüz randevu bulunmuyor.</p>
              </div>
            ) : (
              filteredAppointments?.map((appointment) => {
                const service = services?.find(s => s.id === appointment.serviceId);

                return (
                  <div
                    key={appointment.id}
                    className={`p-4 border rounded-lg transition-colors ${
                      selectedAppointment?.id === appointment.id
                        ? "border-primary bg-primary/5"
                        : "hover:bg-muted"
                    }`}
                    onClick={() => setSelectedAppointment(appointment)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="space-y-2">
                        <div>
                          <p className="font-medium">{appointment.fullName}</p>
                          <p className="text-sm text-muted-foreground">📱 {appointment.phone}</p>
                          <p className="text-sm text-muted-foreground">✉️ {appointment.email}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">{service?.name}</p>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            {new Date(appointment.date).toLocaleDateString()} {appointment.time}
                          </div>
                        </div>
                        {appointment.notes && (
                          <p className="text-sm text-muted-foreground">
                            📝 Not: {appointment.notes}
                          </p>
                        )}
                      </div>

                      <div className="flex flex-col gap-2">
                        <div>
                          {appointment.status === "confirmed" && (
                            <div className="flex items-center text-green-600">
                              <CheckCircle className="h-4 w-4 mr-1" />
                              <span className="text-sm">Onaylandı</span>
                            </div>
                          )}
                          {appointment.status === "completed" && (
                            <div className="flex items-center text-green-600">
                              <CheckCircle className="h-4 w-4 mr-1" />
                              <span className="text-sm">Tamamlandı</span>
                            </div>
                          )}
                          {appointment.status === "cancelled" && (
                            <div className="flex items-center text-red-600">
                              <XCircle className="h-4 w-4 mr-1" />
                              <span className="text-sm">İptal Edildi</span>
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStatusChange("completed");
                            }}
                            disabled={appointment.status === "completed"}
                          >
                            Tamamla
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStatusChange("cancelled");
                            }}
                            disabled={appointment.status === "cancelled"}
                          >
                            İptal Et
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}