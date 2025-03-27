import type { Express } from "express";
import { createServer } from "http";
import { storage } from "./storage";
import { setupAuthRoutes, adminAuth } from './auth';
import { 
  insertAppointmentSchema, 
  insertPostSchema,
  insertSliderSchema
} from "@shared/schema";
import { fromZodError } from "zod-validation-error";
import { ZodError } from "zod";
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
  // Trust proxy - required for rate limiting
  app.set('trust proxy', 1);

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

  // All API routes should be registered before Vite middleware
  app.use('/api/*', (req, res, next) => {
    res.setHeader('Content-Type', 'application/json');
    next();
  });

  // Apply rate limiting to API routes only
  app.use('/api', limiter);

  // Setup authentication routes
  setupAuthRoutes(app);
  
  // Notifications endpoints
  app.post("/api/notifications/send-sms", async (req: Request, res: Response) => {
    try {
      const { to, templateName, templateData } = req.body;
      
      // Log the SMS request for debugging
      console.log(`SMS request to ${to}, template: ${templateName}`, templateData);
      
      // Simulate successful SMS sending since we don't have a real SMS provider
      res.status(200).json({ 
        success: true, 
        message: "SMS notification sent successfully" 
      });
    } catch (error) {
      console.error('Error sending SMS notification:', error);
      res.status(500).json({ 
        success: false, 
        message: "Failed to send SMS notification" 
      });
    }
  });

  // Static file serving for uploads
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

  // Before-After endpoints
  app.get("/api/before-after", async (_req: Request, res: Response) => {
    try {
      const items = await storage.getAllBeforeAfter();
      res.json(items);
    } catch (error) {
      console.error('Error fetching before-after items:', error);
      res.status(500).json({ message: "Öncesi sonrası öğeleri alınırken bir hata oluştu" });
    }
  });

  app.post("/api/before-after", adminAuth, async (req: Request, res: Response) => {
    try {
      const newItem = await storage.createBeforeAfter(req.body);
      res.status(201).json(newItem);
    } catch (error) {
      console.error('Error creating before-after item:', error);
      res.status(500).json({ message: "Öncesi sonrası öğesi oluşturulurken bir hata oluştu" });
    }
  });

  app.put("/api/before-after/:id", adminAuth, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const updatedItem = await storage.updateBeforeAfter(id, req.body);
      res.json(updatedItem);
    } catch (error) {
      console.error('Error updating before-after item:', error);
      res.status(500).json({ message: "Öncesi sonrası öğesi güncellenirken bir hata oluştu" });
    }
  });

  app.delete("/api/before-after/:id", adminAuth, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteBeforeAfter(id);
      res.status(204).send();
    } catch (error) {
      console.error('Error deleting before-after item:', error);
      res.status(500).json({ message: "Öncesi sonrası öğesi silinirken bir hata oluştu" });
    }
  });

  // Appointments endpoints
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
      const sliders = await storage.getAllSliders();
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
    } catch (error: any) {
      // Check if it's a ZodError
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        res.status(400).json({ message: validationError.message });
      } else {
        res.status(400).json({ message: error.message || 'Bilinmeyen bir hata oluştu' });
      }
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

import type { Request, Response } from "express";