import type { Express } from "express";
import { createServer } from "http";
import { storage } from "./storage";
import { setupTelegramWebhook } from './services/telegram';
import { 
  insertAppointmentSchema, 
  insertPostSchema,
  insertSliderSchema
} from "@shared/schema";
import { fromZodError } from "zod-validation-error";
import path from 'path';
import express from 'express';
import rateLimit from 'express-rate-limit';
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

export async function registerRoutes(app: Express) {
  // Trust proxy - required for rate limiting behind reverse proxy
  app.set('trust proxy', 1);

  // Telegram webhook setup - özel bir yol ile webhook'u başlat
  const webhookPath = '/telegram-webhook';
  const bot = setupTelegramWebhook(app, webhookPath);

  // Webhook URL'sini ayarla
  if (process.env.NODE_ENV === 'production') {
    const domain = process.env.DOMAIN || 'your-domain.com';
    await bot.telegram.setWebhook(`https://${domain}${webhookPath}`);
    console.log('Telegram webhook set for production');
  } else {
    // Development ortamında webhook'u devre dışı bırak, polling kullan
    await bot.telegram.deleteWebhook();
    bot.launch().catch(console.error);
    console.log('Telegram bot started in polling mode for development');
  }

  // Rate limiting configuration
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000, // Limit each IP to 1000 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
    message: 'Too many requests from this IP, please try again later',
    skip: (req) => {
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


  // Products endpoints
  app.get("/api/products", async (_req: Request, res: Response) => {
    try {
      const products = await storage.getProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Ürünler alınırken bir hata oluştu" });
    }
  });

  // Services endpoints
  app.get("/api/services", async (_req: Request, res: Response) => {
    try {
      const services = await storage.getAllServices();
      res.json(services);
    } catch (error) {
      res.status(500).json({ message: "Hizmetler alınırken bir hata oluştu" });
    }
  });

  // Appointments endpoints with improved Telegram integration
  app.get("/api/appointments", adminAuth, async (req: Request, res: Response) => {
    try {
      const appointments = await storage.getAllAppointments();
      res.json(appointments);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      res.status(500).json({ message: "Randevular alınırken bir hata oluştu" });
    }
  });

  // Slider endpoints
  app.get("/api/sliders", async (_req: Request, res: Response) => {
    try {
      const sliders = await storage.getSliders();
      res.json(sliders);
    } catch (error) {
      res.status(500).json({ message: "Slider verileri alınırken bir hata oluştu" });
    }
  });

  app.post("/api/sliders", adminAuth, upload.single('image'), async (req: Request, res: Response) => { 
    try {
      const sliderData = insertSliderSchema.parse({...req.body, image: req.file?.filename}); 
      const slider = await storage.createSlider(sliderData);
      res.status(201).json(slider);
    } catch (error) {
      const validationError = fromZodError(error);
      res.status(400).json({ message: validationError.message });
    }
  });

  // Create HTTP server
  const httpServer = createServer(app);

  return httpServer;
}

// Admin authentication middleware
const adminAuth = (req: Request, res: Response, next: any) => {
  const adminKey = req.headers['x-admin-key'];
  if (adminKey !== process.env.ADMIN_KEY) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
};

import type { Request, Response } from "express";