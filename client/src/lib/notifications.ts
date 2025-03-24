import { apiRequest } from "./queryClient";

interface SendSMSParams {
  to: string;
  templateName: 'appointmentConfirmation' | 'appointmentReminder' | 'welcomeMessage';
  templateData: Record<string, string>;
}

export async function sendSMS({ to, templateName, templateData }: SendSMSParams) {
  try {
    const response = await apiRequest("POST", "/api/notifications/send-sms", {
      to,
      templateName,
      templateData
    });
    
    if (!response.ok) {
      throw new Error("SMS gönderilemedi");
    }

    return true;
  } catch (error) {
    console.error("SMS gönderme hatası:", error);
    return false;
  }
}
