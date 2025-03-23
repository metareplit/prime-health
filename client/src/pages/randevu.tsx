import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";
import { tr } from "date-fns/locale";
import { Metadata } from "@/components/ui/metadata";
import { Clock, Calendar as CalendarIcon } from "lucide-react";

export default function Appointment() {
  const [date, setDate] = useState<Date | undefined>(new Date());

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-transparent py-10">
      <Metadata 
        title="Online Randevu Oluştur"
        description="Saç ekimi ve estetik tedaviler için hemen online randevu alın. Uzman doktorlarımızla ücretsiz danışmanlık için sizinle iletişime geçelim."
        keywords="saç ekimi randevu, estetik operasyon randevu, online konsültasyon, ücretsiz danışmanlık"
        type="website"
      />

      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Online Randevu Oluşturun
            </h1>
            <p className="text-lg text-gray-600">
              Size en uygun tarih ve saatte ücretsiz danışmanlık için randevu alın.
              Uzman doktorlarımız tedavi süreciniz hakkında detaylı bilgi versin.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card className="bg-white/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5 text-primary" />
                  Tarih Seçin
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
                  aria-label="Randevu tarihi seçin"
                />
              </CardContent>
            </Card>

            <Card className="bg-white/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  Randevu Detayları
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Seçilen Tarih</h3>
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
                  className="w-full bg-primary/90 hover:bg-primary"
                  size="lg"
                >
                  Randevu Oluştur
                </Button>

                <p className="text-sm text-gray-500 text-center">
                  * Randevunuz onaylandıktan sonra size en uygun saati belirlemek için
                  ekibimiz sizinle iletişime geçecektir.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}