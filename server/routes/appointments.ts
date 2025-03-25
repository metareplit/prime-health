import { Router } from 'express';
import { storage } from '../storage';
import { insertAppointmentSchema } from '@shared/schema';

const router = Router();

// Yeni randevu oluşturma
router.post('/appointments', async (req, res) => {
  try {
    const appointmentData = insertAppointmentSchema.parse(req.body);
    const appointment = await storage.createAppointment(appointmentData);
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
    res.json(appointment);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

export default router;