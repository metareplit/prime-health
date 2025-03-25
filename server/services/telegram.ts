import { Telegraf } from 'telegraf';
import type { Appointment, Service, User } from '@shared/schema';
import { storage } from '../storage';

if (!process.env.TELEGRAM_BOT_TOKEN) {
  throw new Error('TELEGRAM_BOT_TOKEN environment variable is required');
}

const ADMIN_CHAT_ID = "5631870985";
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

// Mesaj formatı yardımcı fonksiyonları
const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const getStatusEmoji = (status: string) => {
  switch (status) {
    case 'pending': return '⏳';
    case 'confirmed': return '✅';
    case 'cancelled': return '❌';
    case 'completed': return '🎉';
    default: return '❓';
  }
};

// Randevu mesajı formatı
const formatAppointmentMessage = (appointment: Appointment, patient: User, service: Service) => {
  return `
🆕 <b>Yeni Randevu Bildirimi</b>

👤 <b>Hasta Bilgileri</b>
İsim: ${patient.firstName} ${patient.lastName}
Telefon: ${patient.phone}
E-posta: ${patient.email}

📅 <b>Randevu Detayları</b>
Tarih: ${formatDate(appointment.date)}
Saat: ${appointment.time}
Hizmet: ${service.name}
Tür: ${appointment.type === 'initial' ? 'İlk Muayene' : appointment.type === 'followup' ? 'Kontrol' : 'Düzenli Kontrol'}

💬 <b>Notlar</b>
${appointment.patientNotes || 'Not eklenmemiş'}

${appointment.documents && appointment.documents.length > 0 ? `
📎 <b>Ekli Dökümanlar</b>
${appointment.documents.map((doc: string) => `- ${doc}`).join('\n')}
` : ''}

📍 <b>Durum</b>
${getStatusEmoji(appointment.status)} ${
  appointment.status === 'pending' ? 'Beklemede' :
  appointment.status === 'confirmed' ? 'Onaylandı' :
  appointment.status === 'cancelled' ? 'İptal Edildi' :
  appointment.status === 'completed' ? 'Tamamlandı' : 'Bilinmiyor'
}

🕒 Oluşturulma Tarihi: ${formatDate(appointment.createdAt || new Date())}
`;
};

// Webhook handler fonksiyonu
export const setupTelegramWebhook = (app: any, path: string) => {
  // Webhook endpoint'i oluştur
  app.use(bot.webhookCallback(path));

  // Start komutu için handler
  bot.command('start', (ctx) => {
    if (ctx.chat.id.toString() === ADMIN_CHAT_ID) {
      ctx.reply('Hoş geldiniz! Randevu bildirimleri buraya gelecektir.');
    }
  });

  return bot;
};

// Randevu bildirimi gönderme fonksiyonu
export const sendAppointmentNotification = async (appointmentId: number) => {
  try {
    const appointment = await storage.getAppointment(appointmentId);
    if (!appointment) throw new Error('Randevu bulunamadı');

    const patient = await storage.getUser(appointment.patientId);
    if (!patient) throw new Error('Hasta bilgisi bulunamadı');

    const service = await storage.getService(appointment.serviceId);
    if (!service) throw new Error('Hizmet bilgisi bulunamadı');

    const message = formatAppointmentMessage(appointment, patient, service);
    await bot.telegram.sendMessage(ADMIN_CHAT_ID, message, { parse_mode: 'HTML' });

    console.log(`Randevu bildirimi gönderildi: ${appointmentId}`);
  } catch (error) {
    console.error('Telegram mesajı gönderilemedi:', error);
  }
};