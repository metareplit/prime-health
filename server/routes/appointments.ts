import { Router } from 'express';
import { sendAppointmentNotification } from '../services/telegram';
import { storage } from '../storage';
import { insertAppointmentSchema } from '@shared/schema';

const router = Router();

// Yeni randevu oluşturma
router.post('/appointments', async (req, res) => {
  try {
    const appointmentData = insertAppointmentSchema.parse(req.body);
    const appointment = await storage.createAppointment(appointmentData);
    
    // Telegram bildirimi gönder
    await sendAppointmentNotification(appointment.id);
    
    res.status(201).json(appointment);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Randevu durumunu güncelleme
router.patch('/appointments/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const appointment = await storage.updateAppointmentStatus(parseInt(id), status);
    
    // Durum değişikliğinde de bildirim gönder
    await sendAppointmentNotification(appointment.id);
    
    res.json(appointment);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
