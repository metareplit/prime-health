import { Router } from 'express';
import { storage } from '../storage';
import { insertAppointmentSchema } from '@shared/schema';
import { sendAppointmentNotification } from '../services/telegram';

const router = Router();

// Telegram chat ID - Bu ID'yi bot ile etkileşime geçtiğinizde alabilirsiniz
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || '';

// Yeni randevu oluşturma
router.post('/appointments', async (req, res) => {
  try {
    const appointmentData = insertAppointmentSchema.parse(req.body);
    const appointment = await storage.createAppointment(appointmentData);

    // Telegram bildirimi gönder
    if (TELEGRAM_CHAT_ID) {
      await sendAppointmentNotification(appointment, TELEGRAM_CHAT_ID);
    }

    res.status(201).json(appointment);
  } catch (error: any) {
    console.error('Appointment creation error:', error);
    res.status(400).json({ error: error.message });
  }
});

// Randevu durumunu güncelleme
router.patch('/appointments/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const appointment = await storage.updateAppointmentStatus(parseInt(id), status);

    // Telegram bildirimi gönder
    if (TELEGRAM_CHAT_ID) {
      await sendAppointmentNotification(appointment, TELEGRAM_CHAT_ID);
    }

    res.json(appointment);
  } catch (error: any) {
    console.error('Appointment status update error:', error);
    res.status(400).json({ error: error.message });
  }
});

export default router;