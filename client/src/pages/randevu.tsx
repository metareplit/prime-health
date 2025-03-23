import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";
import { tr } from "date-fns/locale";
import { Metadata } from "@/components/ui/metadata";
import { Clock, Calendar as CalendarIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function Appointment() {
  const { t } = useTranslation('common');
  const [date, setDate] = useState<Date | undefined>(new Date());

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-transparent py-10">
      <Metadata 
        title={t('patient.appointments.createTitle')}
        description={t('patient.appointments.createDescription')}
        keywords="saç ekimi randevu, estetik operasyon randevu, online konsültasyon, ücretsiz danışmanlık"
        type="website"
      />

      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              {t('patient.appointments.createTitle')}
            </h1>
            <p className="text-lg text-gray-600">
              {t('patient.appointments.createDescription')}
            </p>
          </div>

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
                  className="w-full bg-primary/90 hover:bg-primary"
                  size="lg"
                >
                  {t('patient.appointments.createButton')}
                </Button>

                <p className="text-sm text-gray-500 text-center">
                  {t('patient.appointments.contactNote')}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}