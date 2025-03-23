import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Calendar,
  MessageSquare,
  Image as ImageIcon,
  User,
  Bell,
  CheckCircle,
  Clock,
} from "lucide-react";
import type { Appointment, Message } from "@shared/schema";
import { Metadata } from "@/components/ui/metadata";
import { useTranslation } from "react-i18next";

export default function PatientDashboard() {
  const { t } = useTranslation('common');

  const { data: upcomingAppointments } = useQuery<Appointment[]>({
    queryKey: ["/api/appointments/upcoming"],
  });

  const { data: unreadMessages } = useQuery<Message[]>({
    queryKey: ["/api/messages/unread"],
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <Metadata
        title={t('patient.dashboard.title')}
        description={t('patient.dashboard.welcome')}
        keywords="hasta portali, randevu takip, tedavi süreci, saç ekimi takip"
        type="website"
      />
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold">{t('patient.dashboard.title')}</h1>
          <p className="text-gray-600 mt-2">
            {t('patient.dashboard.welcome')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Link href="/hasta-portali/randevular">
            <a>
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{t('patient.dashboard.appointments')}</CardTitle>
                  <Calendar className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {upcomingAppointments?.length || 0}
                  </div>
                  <p className="text-xs text-gray-600">{t('patient.dashboard.upcomingAppointment')}</p>
                </CardContent>
              </Card>
            </a>
          </Link>

          <Link href="/hasta-portali/mesajlar">
            <a>
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{t('patient.dashboard.messages')}</CardTitle>
                  <MessageSquare className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {unreadMessages?.length || 0}
                  </div>
                  <p className="text-xs text-gray-600">{t('patient.dashboard.unreadMessage')}</p>
                </CardContent>
              </Card>
            </a>
          </Link>

          <Link href="/hasta-portali/gorseller">
            <a>
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{t('patient.dashboard.images')}</CardTitle>
                  <ImageIcon className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{t('buttons.upload')}</div>
                  <p className="text-xs text-gray-600">{t('patient.dashboard.uploadImages')}</p>
                </CardContent>
              </Card>
            </a>
          </Link>

          <Link href="/hasta-portali/profil">
            <a>
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{t('patient.dashboard.profile')}</CardTitle>
                  <User className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{t('buttons.edit')}</div>
                  <p className="text-xs text-gray-600">{t('patient.dashboard.editProfile')}</p>
                </CardContent>
              </Card>
            </a>
          </Link>
        </div>

        {upcomingAppointments && upcomingAppointments.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-xl">{t('patient.dashboard.upcomingAppointments')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingAppointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <Clock className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium">{appointment.type}</p>
                        <p className="text-sm text-gray-600">
                          {new Date(appointment.date).toLocaleDateString()} {appointment.time}
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/hasta-portali/randevular/${appointment.id}`}>
                        <a>{t('patient.dashboard.details')}</a>
                      </Link>
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {unreadMessages && unreadMessages.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">{t('patient.dashboard.messages')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {unreadMessages.map((message) => (
                  <div
                    key={message.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <Bell className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium">{t('patient.dashboard.newMessage')}</p>
                        <p className="text-sm text-gray-600">
                          {message.content.substring(0, 50)}...
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <Link href="/hasta-portali/mesajlar">
                        <a>{t('patient.dashboard.read')}</a>
                      </Link>
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}