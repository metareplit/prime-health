import twilio from 'twilio';

// Development modunda dummy SMS servisi
const isDevelopment = process.env.NODE_ENV !== 'production';
let client: any = null;

// Production'da Twilio kullan, development'ta mock servis
if (!isDevelopment && (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN || !process.env.TWILIO_PHONE_NUMBER)) {
  console.warn("Twilio credentials are missing in production environment");
} else if (!isDevelopment) {
  client = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
  );
}

interface SMSOptions {
  to: string;
  body: string;
}

export async function sendSMS({ to, body }: SMSOptions): Promise<boolean> {
  try {
    console.log('Sending SMS to:', to); // Debug log

    if (isDevelopment) {
      // Development ortamında SMS gönderimi simüle edilir
      console.log('Development mode - SMS would be sent with:', {
        to,
        body,
        from: 'MOCK_TWILIO_NUMBER'
      });
      return true;
    }

    // Production ortamında gerçek SMS gönderimi
    if (!client) {
      console.error('Twilio client is not initialized');
      return false;
    }

    await client.messages.create({
      to,
      from: process.env.TWILIO_PHONE_NUMBER,
      body
    });

    console.log('SMS sent successfully'); // Debug log
    return true;
  } catch (error) {
    console.error('SMS sending error:', error);
    return false;
  }
}

// SMS şablonları
export const smsTemplates = {
  appointmentConfirmation: (name: string, date: string, time: string) => `
Sayın ${name},
Randevunuz onaylanmıştır.
Tarih: ${date}
Saat: ${time}
Sorularınız için bizi arayabilirsiniz.
`,
  appointmentReminder: (name: string, date: string, time: string) => `
Sayın ${name},
Yarınki randevunuzu hatırlatmak isteriz.
Tarih: ${date}
Saat: ${time}
`,
  welcomeMessage: (name: string) => `
Sayın ${name},
Hair Clinic ailesine hoş geldiniz! 
Size daha iyi hizmet verebilmek için elimizden geleni yapacağız.
`
};