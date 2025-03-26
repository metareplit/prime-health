import { Appointment } from "@shared/schema";

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_API_URL = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`;

export async function sendTelegramMessage(chatId: string, message: string) {
  try {
    const response = await fetch(`${TELEGRAM_API_URL}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML'
      })
    });

    if (!response.ok) {
      throw new Error(`Telegram API error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Telegram message error:', error);
    throw error;
  }
}

export function formatAppointmentMessage(appointment: Appointment): string {
  const appointmentDate = new Date(appointment.date);
  const formattedDate = appointmentDate.toLocaleDateString('tr-TR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const formattedTime = appointmentDate.toLocaleTimeString('tr-TR', {
    hour: '2-digit',
    minute: '2-digit'
  });

  let statusText = '';
  switch (appointment.status) {
    case 'confirmed':
      statusText = '✅ Onaylandı';
      break;
    case 'pending':
      statusText = '⏳ Beklemede';
      break;
    case 'cancelled':
      statusText = '❌ İptal Edildi';
      break;
  }

  return `
<b>🗓️ Yeni Randevu Bildirimi</b>

👤 Hasta Bilgileri:
- Ad Soyad: ${appointment.fullName}
- Telefon: ${appointment.phone}
- E-posta: ${appointment.email}

📅 Randevu Detayları:
- Tarih: ${formattedDate}
- Saat: ${formattedTime}
- Durum: ${statusText}

${appointment.notes ? `📝 Notlar: ${appointment.notes}` : ''}
`;
}

export async function sendAppointmentNotification(appointment: Appointment, chatId: string) {
  const message = formatAppointmentMessage(appointment);
  await sendTelegramMessage(chatId, message);
}