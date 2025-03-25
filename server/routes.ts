import type { Express, Request, Response } from "express";
import { createServer } from "http";
import { storage } from "./storage";
import { 
  insertAppointmentSchema, 
  insertPostSchema,
  insertSliderSchema // Added import for slider schema
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

  app.post("/api/sliders", adminAuth, upload.single('image'), async (req: Request, res: Response) => { //Added multer middleware
    try {
      const sliderData = insertSliderSchema.parse({...req.body, image: req.file?.filename}); //Added image to sliderData
      const slider = await storage.createSlider(sliderData);
      res.status(201).json(slider);
    } catch (error) {
      const validationError = fromZodError(error);
      res.status(400).json({ message: validationError.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}