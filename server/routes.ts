import type { Express, Request, Response } from "express";
import { createServer } from "http";
import { storage } from "./storage";
import { 
  insertAppointmentSchema, 
  insertPostSchema,
} from "@shared/schema";
import { fromZodError } from "zod-validation-error";
import path from 'path';
import express from 'express';
import rateLimit from 'express-rate-limit';
import { TelegramClient } from 'telegram';
import { StringSession } from 'telegram/sessions';
import fs from 'fs';
import multer from 'multer';

// Multer setup
const upload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => {
      cb(null, 'uploads/');
    },
    filename: (_req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, uniqueSuffix + path.extname(file.originalname));
    }
  }),
  fileFilter: (_req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Desteklenmeyen dosya türü'));
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Telegram client instance
let telegramClient: TelegramClient | null = null;

// Function to initialize or reinitialize Telegram client
async function initializeTelegramClient() {
  try {
    const apiId = await storage.getSettingValue('telegram_api_id');
    const apiHash = await storage.getSettingValue('telegram_api_hash');
    const botToken = await storage.getSettingValue('telegram_bot_token');

    if (!apiId || !apiHash || !botToken) {
      console.log('Telegram credentials not configured yet');
      return null;
    }

    const client = new TelegramClient(
      new StringSession(''), 
      parseInt(apiId), 
      apiHash,
      { connectionRetries: 5 }
    );

    await client.start({ botAuthToken: botToken });
    console.log('Telegram client initialized successfully');
    return client;
  } catch (error) {
    console.error('Error initializing Telegram client:', error);
    return null;
  }
}

// Admin authentication middleware
const adminAuth = (req: Request, res: Response, next: any) => {
  const adminKey = req.headers['x-admin-key'];
  if (adminKey !== process.env.ADMIN_KEY) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
};

export async function registerRoutes(app: Express) {
  // Trust proxy - required for rate limiting behind reverse proxy
  app.set('trust proxy', 1);

  // Initialize Telegram client
  telegramClient = await initializeTelegramClient();

  // Rate limiting configuration
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000, // Limit each IP to 1000 requests per windowMs
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    message: 'Too many requests from this IP, please try again later',
    skip: (req) => {
      // Skip rate limiting for static files and development assets
      return req.path.startsWith('/assets/') || 
             req.path.startsWith('/@vite/') || 
             req.path.startsWith('/@react-refresh');
    }
  });

  // Apply rate limiting to API routes only
  app.use('/api', limiter);

  // Static file serving
  app.use('/uploads', express.static('uploads'));

  // Posts endpoints
  app.get("/api/posts", async (_req: Request, res: Response) => {
    try {
      const posts = await storage.getPosts();
      res.json(posts);
    } catch (error) {
      res.status(500).json({ message: "Blog yazıları alınırken bir hata oluştu" });
    }
  });

  app.post("/api/posts", adminAuth, async (req: Request, res: Response) => {
    try {
      const postData = insertPostSchema.parse(req.body);
      const post = await storage.createPost(postData);
      res.status(201).json(post);
    } catch (error) {
      const validationError = fromZodError(error);
      res.status(400).json({ message: validationError.message });
    }
  });

  app.patch("/api/posts/:id", adminAuth, async (req: Request, res: Response) => {
    try {
      const post = await storage.updatePost(parseInt(req.params.id), req.body);
      res.json(post);
    } catch (error) {
      res.status(400).json({ message: "Blog yazısı güncellenirken bir hata oluştu" });
    }
  });

  app.delete("/api/posts/:id", adminAuth, async (req: Request, res: Response) => {
    try {
      await storage.deletePost(parseInt(req.params.id));
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ message: "Blog yazısı silinirken bir hata oluştu" });
    }
  });

  // Settings endpoints
  app.get("/api/settings", adminAuth, async (_req: Request, res: Response) => {
    try {
      const settings = await storage.getSettings();
      res.json(settings);
    } catch (error) {
      res.status(500).json({ message: "Ayarlar alınırken bir hata oluştu" });
    }
  });

  app.patch("/api/settings/:key", adminAuth, async (req: Request, res: Response) => {
    try {
      const { key } = req.params;
      const { value } = req.body;

      const setting = await storage.updateSetting(key, value);

      // If Telegram settings were updated, reinitialize the client
      if (key.startsWith('telegram_')) {
        if (telegramClient) {
          await telegramClient.destroy();
        }
        telegramClient = await initializeTelegramClient();
      }

      res.json(setting);
    } catch (error) {
      console.error('Error updating setting:', error);
      res.status(400).json({ message: "Ayar güncellenirken bir hata oluştu" });
    }
  });

  // Appointments endpoints with improved Telegram integration
  app.post("/api/appointments", async (req: Request, res: Response) => {
    try {
      const appointmentData = insertAppointmentSchema.parse(req.body);
      const appointment = await storage.createAppointment(appointmentData);

      // Try to send Telegram notification
      try {
        if (telegramClient) {
          const chatId = await storage.getSettingValue('telegram_chat_id');
          if (chatId) {
            await telegramClient.sendMessage(chatId, {
              message: `
🔔 Yeni Randevu Bildirimi

👤 İsim: ${appointmentData.name}
📞 Telefon: ${appointmentData.phone}
📅 Tarih: ${new Date(appointmentData.date).toLocaleDateString('tr-TR')}
⏰ Saat: ${appointmentData.time}
💬 Not: ${appointmentData.notes || 'Not belirtilmedi'}
              `
            });
            console.log('Telegram notification sent successfully');
          }
        } else {
          console.log('Telegram client not initialized, skipping notification');
        }
      } catch (telegramError) {
        console.error('Error sending Telegram notification:', telegramError);
        // Don't fail the appointment creation if Telegram notification fails
      }

      res.status(201).json(appointment);
    } catch (error) {
      console.error('Appointment creation error:', error);
      const validationError = fromZodError(error);
      res.status(400).json({ message: validationError.message });
    }
  });

  app.get("/api/appointments", adminAuth, async (req: Request, res: Response) => {
    try {
      const appointments = await storage.getAllAppointments();
      res.json(appointments);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      res.status(500).json({ message: "Randevular alınırken bir hata oluştu" });
    }
  });

  app.patch("/api/appointments/:id/status", adminAuth, async (req: Request, res: Response) => {
    try {
      const { status } = req.body;
      const appointment = await storage.updateAppointmentStatus(parseInt(req.params.id), status);
      res.json(appointment);
    } catch (error) {
      res.status(400).json({ message: "Randevu durumu güncellenirken bir hata oluştu" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}