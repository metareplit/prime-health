import { Router } from 'express';
import { sendSMS, smsTemplates } from '../services/sms';
import { z } from 'zod';

const router = Router();

const sendSMSSchema = z.object({
  to: z.string(),
  templateName: z.enum(['appointmentConfirmation', 'appointmentReminder', 'welcomeMessage']),
  templateData: z.record(z.string())
});

router.post('/send-sms', async (req, res) => {
  try {
    const { to, templateName, templateData } = sendSMSSchema.parse(req.body);
    
    // @ts-expect-error - Dynamic template access
    const messageTemplate = smsTemplates[templateName];
    if (!messageTemplate) {
      return res.status(400).json({ error: 'Invalid template name' });
    }

    const message = messageTemplate(...Object.values(templateData));
    const success = await sendSMS({ to, body: message });

    if (success) {
      res.status(200).json({ message: 'SMS sent successfully' });
    } else {
      res.status(500).json({ error: 'Failed to send SMS' });
    }
  } catch (error) {
    console.error('SMS sending error:', error);
    res.status(400).json({ error: 'Invalid request data' });
  }
});

export default router;
