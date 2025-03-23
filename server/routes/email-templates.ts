import { Router } from 'express';
import { storage } from '../storage';
import { z } from 'zod';

const router = Router();

const templateSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  subject: z.string().min(1, 'Subject is required'),
  body: z.string().min(1, 'Body is required'),
  type: z.enum(['appointment_reminder', 'welcome', 'custom']),
  variables: z.array(z.string()),
});

// Tüm şablonları getir
router.get('/api/email-templates', async (req, res) => {
  try {
    const templates = await storage.getAllEmailTemplates();
    res.json(templates);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch email templates' });
  }
});

// Yeni şablon oluştur
router.post('/api/email-templates', async (req, res) => {
  try {
    const data = templateSchema.parse(req.body);
    const template = await storage.createEmailTemplate(data);
    res.status(201).json(template);
  } catch (error) {
    res.status(400).json({ error: 'Invalid template data' });
  }
});

// Şablon güncelle
router.patch('/api/email-templates/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const data = templateSchema.parse(req.body);
    const template = await storage.updateEmailTemplate(id, data);
    if (!template) {
      return res.status(404).json({ error: 'Template not found' });
    }
    res.json(template);
  } catch (error) {
    res.status(400).json({ error: 'Invalid template data' });
  }
});

// Şablon sil
router.delete('/api/email-templates/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    await storage.deleteEmailTemplate(id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete template' });
  }
});

export default router;
