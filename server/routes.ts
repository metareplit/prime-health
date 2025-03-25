import type { Express, Request, Response } from "express";
import { createServer } from "http";
import { storage } from "./storage";
import { 
  insertUserSchema, 
  insertAppointmentSchema, 
  insertMessageSchema, 
  insertPatientImageSchema, 
  insertPostSchema, 
  insertProductSchema, 
  insertMediaSchema, 
  insertSettingSchema,
  insertServiceSchema,
  insertEmailTemplateSchema,
  insertBeforeAfterSchema,
  insertSliderSchema
} from "@shared/schema";
import { fromZodError } from "zod-validation-error";
import session from "express-session";
import multer from 'multer';
import path from 'path';
import express from 'express';
import fs from 'fs'; // Import fs module
import rateLimit from 'express-rate-limit'; // Import rateLimit
import notificationsRouter from './routes/notifications';

// Auth Middleware Types
interface AuthRequest extends Request {
  session: session.Session & { userId?: number };
}

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

// Hizmetler için multer konfigürasyonu
const serviceUpload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => {
      // uploads klasörünü kontrol et ve oluştur
      if (!fs.existsSync('uploads')) {
        fs.mkdirSync('uploads', { recursive: true });
      }
      cb(null, 'uploads/');
    },
    filename: (_req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, `service-${uniqueSuffix}${path.extname(file.originalname)}`);
    }
  }),
  fileFilter: (_req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Desteklenmeyen dosya türü'));
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
});

export async function registerRoutes(app: Express) {
  // Static file serving - uploads dizinini statik olarak servis et
  app.use('/uploads', express.static('uploads'));

  // Session middleware
  app.use(
    session({
      store: storage.sessionStore,
      secret: "your-secret-key",
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: process.env.NODE_ENV === "production",
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
      },
    })
  );

  // Auth endpoints
  app.post("/api/auth/login", async (req: AuthRequest, res: Response) => {
    try {
      const { username, password } = req.body;
      console.log("Login attempt:", username); // Debug log

      const user = await storage.getUserByUsername(username);
      if (!user) {
        console.log("User not found:", username);
        return res.status(401).json({ message: "Geçersiz kullanıcı adı veya şifre" });
      }

      // Debug log
      console.log("Found user:", {
        id: user.id,
        username: user.username,
        role: user.role,
        password: user.password // Only for debugging
      });

      // Test için direkt karşılaştırma
      if (password !== user.password) {
        console.log("Password mismatch. Got:", password, "Expected:", user.password);
        return res.status(401).json({ message: "Geçersiz kullanıcı adı veya şifre" });
      }

      req.session.userId = user.id;
      console.log("Login successful, setting session:", req.session);

      // Set session
      req.session.save((err) => {
        if (err) {
          console.error("Session save error:", err);
          return res.status(500).json({ message: "Oturum başlatılırken hata oluştu" });
        }

        res.json({
          id: user.id,
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          email: user.email
        });
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Giriş yapılırken bir hata oluştu" });
    }
  });

  app.post("/api/auth/register", async (req: Request, res: Response) => {
    try {
      console.log("Registration request body:", req.body); // Debug log

      const userData = insertUserSchema.parse({
        ...req.body,
        role: "patient" // Force role to be patient for all registrations
      });

      console.log("Parsed user data:", userData); // Debug log

      const existingEmail = await storage.getUserByEmail(userData.email);
      if (existingEmail) {
        return res.status(400).json({ 
          message: "Bu e-posta adresi zaten kullanımda" 
        });
      }

      // Generate a username from first name and last name
      const baseUsername = `${userData.firstName.toLowerCase()}.${userData.lastName.toLowerCase()}`;
      let username = baseUsername;
      let counter = 1;

      // Check if username exists and generate a unique one if needed
      while (await storage.getUserByUsername(username)) {
        username = `${baseUsername}${counter}`;
        counter++;
      }

      const user = await storage.createUser({
        ...userData,
        username, // Add generated username
      });

      res.status(201).json(user);
    } catch (error) {
      console.error("Registration error:", error); // Debug log
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Kayıt işlemi sırasında bir hata oluştu" });
      }
    }
  });

  app.post("/api/auth/logout", (req: AuthRequest, res: Response) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Çıkış yapılırken bir hata oluştu" });
      }
      res.json({ message: "Çıkış yapıldı" });
    });
  });

  // Authentication middleware
  const requireAuth = (req: AuthRequest, res: Response, next: any) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Oturum açmanız gerekiyor" });
    }
    next();
  };

  // Admin middleware
  const requireAdmin = async (req: AuthRequest, res: Response, next: any) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Oturum açmanız gerekiyor" });
    }
    const user = await storage.getUser(req.session.userId);
    if (!user || user.role !== "admin") {
      return res.status(403).json({ message: "Bu işlem için yetkiniz yok" });
    }
    next();
  };

  // Posts endpoints
  app.get("/api/posts", async (_req: Request, res: Response) => {
    try {
      const posts = await storage.getPosts();
      res.json(posts);
    } catch (error) {
      res.status(500).json({ message: "Blog yazıları alınırken bir hata oluştu" });
    }
  });

  app.post("/api/posts", requireAdmin, async (req: Request, res: Response) => {
    try {
      const postData = insertPostSchema.parse(req.body);
      const post = await storage.createPost(postData);
      res.status(201).json(post);
    } catch (error) {
      const validationError = fromZodError(error);
      res.status(400).json({ message: validationError.message });
    }
  });

  app.patch("/api/posts/:id", requireAdmin, async (req: Request, res: Response) => {
    try {
      const post = await storage.updatePost(parseInt(req.params.id), req.body);
      res.json(post);
    } catch (error) {
      res.status(400).json({ message: "Blog yazısı güncellenirken bir hata oluştu" });
    }
  });

  app.delete("/api/posts/:id", requireAdmin, async (req: Request, res: Response) => {
    try {
      await storage.deletePost(parseInt(req.params.id));
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ message: "Blog yazısı silinirken bir hata oluştu" });
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

  app.post("/api/products", requireAdmin, async (req: Request, res: Response) => {
    try {
      const productData = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(productData);
      res.status(201).json(product);
    } catch (error) {
      const validationError = fromZodError(error);
      res.status(400).json({ message: validationError.message });
    }
  });

  app.patch("/api/products/:id", requireAdmin, async (req: Request, res: Response) => {
    try {
      const product = await storage.updateProduct(parseInt(req.params.id), req.body);
      res.json(product);
    } catch (error) {
      res.status(400).json({ message: "Ürün güncellenirken bir hata oluştu" });
    }
  });

  app.delete("/api/products/:id", requireAdmin, async (req: Request, res: Response) => {
    try {
      await storage.deleteProduct(parseInt(req.params.id));
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ message: "Ürün silinirken bir hata oluştu" });
    }
  });

  // Media endpoints
  app.get("/api/media", async (_req: Request, res: Response) => {
    try {
      const mediaFiles = await storage.getMedia();
      res.json(mediaFiles);
    } catch (error) {
      res.status(500).json({ message: "Medya dosyaları alınırken bir hata oluştu" });
    }
  });

  app.post("/api/media", requireAdmin, async (req: Request, res: Response) => {
    try {
      const mediaData = insertMediaSchema.parse(req.body);
      const media = await storage.createMedia(mediaData);
      res.status(201).json(media);
    } catch (error) {
      const validationError = fromZodError(error);
      res.status(400).json({ message: validationError.message });
    }
  });

  app.delete("/api/media/:id", requireAdmin, async (req: Request, res: Response) => {
    try {
      await storage.deleteMedia(parseInt(req.params.id));
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ message: "Medya dosyası silinirken bir hata oluştu" });
    }
  });

  // Media upload endpoint'i güncelleme
  app.post("/api/media/upload", requireAdmin, upload.single("file"), async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "Dosya yüklenmedi" });
      }

      // Uploads dizininin varlığını kontrol et
      if (!fs.existsSync('uploads')) {
        fs.mkdirSync('uploads', { recursive: true });
      }

      const mediaData = {
        filename: req.file.filename,
        originalName: req.file.originalname,
        mimeType: req.file.mimetype,
        size: req.file.size,
        url: `/uploads/${req.file.filename}`,
        uploadedById: (req as AuthRequest).session.userId,
      };

      console.log('Uploading media:', mediaData); // Debug log

      const media = await storage.createMedia(mediaData);
      res.status(201).json(media);
    } catch (error) {
      console.error("Media upload error:", error);
      res.status(500).json({ message: "Dosya yüklenirken bir hata oluştu" });
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

  app.post("/api/services", requireAdmin, serviceUpload.single('image'), async (req: Request, res: Response) => {
    try {
      const serviceData = {
        ...req.body,
        imageUrl: req.file ? `/uploads/${req.file.filename}` : null,
        benefits: req.body.benefits ? JSON.parse(req.body.benefits) : [],
        process: req.body.process ? JSON.parse(req.body.process) : [],
        faqs: req.body.faqs ? JSON.parse(req.body.faqs) : [],
        featured: req.body.featured === 'true',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      console.log('Creating service with data:', serviceData);

      const validatedData = insertServiceSchema.parse(serviceData);
      const service = await storage.createService(validatedData);
      res.status(201).json(service);
    } catch (error) {
      console.error('Error creating service:', error);
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Hizmet oluşturulurken bir hata oluştu" });
      }
    }
  });

  app.patch("/api/services/:id", requireAdmin, serviceUpload.single('image'), async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const serviceData = {
        ...req.body,
        imageUrl: req.file ? `/uploads/${req.file.filename}` : undefined,
        benefits: req.body.benefits ? JSON.parse(req.body.benefits) : undefined,
        process: req.body.process ? JSON.parse(req.body.process) : undefined,
        faqs: req.body.faqs ? JSON.parse(req.body.faqs) : undefined,
        featured: req.body.featured === 'true',
        updatedAt: new Date()
      };

      console.log('Updating service with data:', serviceData);

      const service = await storage.updateService(id, serviceData);
      if (!service) {
        return res.status(404).json({ message: "Hizmet bulunamadı" });
      }
      res.json(service);
    } catch (error) {
      console.error('Error updating service:', error);
      res.status(400).json({ message: "Hizmet güncellenirken bir hata oluştu" });
    }
  });

  app.delete("/api/services/:id", requireAdmin, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteService(id);
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ message: "Hizmet silinirken bir hata oluştu" });
    }
  });

  app.patch("/api/services/:id/reorder", requireAdmin, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const { order } = req.body;
      const service = await storage.updateServiceOrder(id, order);
      res.json(service);
    } catch (error) {
      res.status(400).json({ message: "Hizmet sırası güncellenirken bir hata oluştu" });
    }
  });

  // Öncesi Sonrası endpoints
  app.get("/api/before-after", async (_req: Request, res: Response) => {
    try {
      const items = await storage.getAllBeforeAfter();
      res.json(items);
    } catch (error) {
      res.status(500).json({ message: "Kayıtlar alınırken bir hata oluştu" });
    }
  });

  app.post("/api/before-after", requireAdmin, async (req: Request, res: Response) => {
    try {
      const data = {
        ...req.body,
        treatmentDate: new Date(req.body.treatmentDate),
        createdAt: new Date(req.body.createdAt),
        updatedAt: new Date(req.body.updatedAt),
      };

      const validatedData = insertBeforeAfterSchema.parse(data);
      const item = await storage.createBeforeAfter(validatedData);
      res.status(201).json(item);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Kayıt oluşturulurken bir hata oluştu" });
      }
    }
  });

  app.patch("/api/before-after/:id", requireAdmin, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const item = await storage.updateBeforeAfter(id, req.body);
      if (!item) {
        return res.status(404).json({ message: "Kayıt bulunamadı" });
      }
      res.json(item);
    } catch (error) {
      res.status(400).json({ message: "Kayıt güncellenirken bir hata oluştu" });
    }
  });

  app.delete("/api/before-after/:id", requireAdmin, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteBeforeAfter(id);
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ message: "Kayıt silinirken bir hata oluştu" });
    }
  });

  // Appointments endpoints
  app.get("/api/appointments", requireAuth, async (req: AuthRequest, res: Response) => {
    try {
      // Admin tüm randevuları, normal kullanıcılar sadece kendi randevularını görebilir
      const user = await storage.getUser(req.session.userId as number);
      console.log('User requesting appointments:', { id: user?.id, role: user?.role });

      let appointments;
      if (user?.role === 'admin') {
        appointments = await storage.getAllAppointments();
        console.log('Admin appointments fetched:', appointments);
      } else {
        appointments = await storage.getUserAppointments(req.session.userId as number);
        console.log('User appointments fetched:', appointments);
      }

      res.json(appointments);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      res.status(500).json({ message: "Randevular alınırken bir hata oluştu" });
    }
  });

  app.post("/api/appointments", requireAuth, async (req: AuthRequest, res: Response) => {
    try {
      console.log('Creating appointment with data:', req.body);
      const appointmentData = insertAppointmentSchema.parse({
        ...req.body,
        patientId: req.session.userId as number,
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date()
      });

      const appointment = await storage.createAppointment(appointmentData);
      console.log('Appointment created:', appointment);

      res.status(201).json(appointment);
    } catch (error) {
      console.error('Error creating appointment:', error);
      const validationError = fromZodError(error);
      res.status(400).json({ message: validationError.message });
    }
  });

  // Slider endpoints
  app.get("/api/sliders", async (_req: Request, res: Response) => {
    try {
      const sliders = await storage.getAllSliders();
      res.json(sliders);
    } catch (error) {
      res.status(500).json({ message: "Slider'lar alınırken bir hata oluştu" });
    }
  });

  app.post("/api/sliders", requireAdmin, async (req: Request, res: Response) => {
    try {
      const data = {
        ...req.body,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const validatedData = insertSliderSchema.parse(data);
      const slider = await storage.createSlider(validatedData);
      res.status(201).json(slider);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Slider oluşturulurken bir hata oluştu" });
      }
    }
  });

  app.patch("/api/sliders/:id", requireAdmin, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const slider = await storage.updateSlider(id, req.body);
      if (!slider) {
        return res.status(404).json({ message: "Slider bulunamadı" });
      }
      res.json(slider);
    } catch (error) {
      res.status(400).json({ message: "Slider güncellenirken bir hata oluştu" });
    }
  });

  app.delete("/api/sliders/:id", requireAdmin, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteSlider(id);
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ message: "Slider silinirken bir hata oluştu" });
    }
  });

  app.patch("/api/sliders/:id/reorder", requireAdmin, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const { order } = req.body;
      const slider = await storage.updateSliderOrder(id, order);
      res.json(slider);
    } catch (error) {
      res.status(400).json({ message: "Slider sırası güncellenirken bir hata oluştu" });
    }
  });

  // Notifications routes
  app.use('/api/notifications', notificationsRouter);

  // SMS endpoint'leri için rate limiting ekleyelim
  const smsLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 dakika
    max: 10 // IP başına limit
  });

  app.use('/api/notifications/send-sms', smsLimiter);

  const httpServer = createServer(app);
  return httpServer;
}