import { MailService } from '@sendgrid/mail';
import { EmailTemplate } from '@shared/schema';

if (!process.env.SENDGRID_API_KEY) {
  throw new Error('SENDGRID_API_KEY environment variable is not set');
}

const mailService = new MailService();
mailService.setApiKey(process.env.SENDGRID_API_KEY);

export interface EmailData {
  to: string;
  templateId: number;
  variables: Record<string, string>;
}

export class EmailService {
  static async sendEmail(template: EmailTemplate, data: EmailData) {
    try {
      const subject = this.replaceVariables(template.subject, data.variables);
      const content = this.replaceVariables(template.body, data.variables);

      await mailService.send({
        to: data.to,
        from: process.env.EMAIL_FROM || 'noreply@yourdomain.com',
        subject: subject,
        html: content,
      });

      return true;
    } catch (error) {
      console.error('Failed to send email:', error);
      return false;
    }
  }

  private static replaceVariables(text: string, variables: Record<string, string>): string {
    return text.replace(/{(\w+)}/g, (match, key) => variables[key] || match);
  }

  static async sendAppointmentReminder(
    email: string,
    name: string,
    date: string,
    time: string,
    service: string,
    template: EmailTemplate
  ) {
    return this.sendEmail(template, {
      to: email,
      templateId: template.id,
      variables: {
        name,
        date,
        time,
        service,
      },
    });
  }
}
