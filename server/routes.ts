import type { Express } from "express";
import { createServer } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertAppointmentSchema, insertMessageSchema, insertPatientImageSchema, insertPostSchema, insertProductSchema, insertMediaSchema, insertSettingSchema } from "@shared/schema";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express) {
  // Auth endpoints
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      console.log("Login attempt for:", username); // Debug log

      const user = await storage.getUserByUsername(username);
      if (!user) {
        console.log("User not found:", username);
        return res.status(401).json({ message: "Geçersiz kullanıcı adı veya şifre" });
      }

      // For testing purposes, direct password comparison
      if (password !== user.password) {
        console.log("Invalid password for:", username);
        return res.status(401).json({ message: "Geçersiz kullanıcı adı veya şifre" });
      }

      req.session.userId = user.id;
      console.log("Login successful for:", username);
      res.json({ 
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        role: user.role
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Giriş yapılırken bir hata oluştu" });
    }
  });

  app.post("/api/auth/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      res.status(201).json(user);
    } catch (error) {
      const validationError = fromZodError(error);
      res.status(400).json({ message: validationError.message });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy(() => {
      res.json({ message: "Çıkış yapıldı" });
    });
  });

  // Authentication middleware
  const requireAuth = (req, res, next) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Oturum açmanız gerekiyor" });
    }
    next();
  };

  // Admin middleware
  const requireAdmin = async (req, res, next) => {
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
  app.get("/api/posts", async (_req, res) => {
    try {
      const posts = await storage.getPosts();
      res.json(posts);
    } catch (error) {
      res.status(500).json({ message: "Blog yazıları alınırken bir hata oluştu" });
    }
  });

  app.post("/api/posts", requireAdmin, async (req, res) => {
    try {
      const postData = insertPostSchema.parse(req.body);
      const post = await storage.createPost(postData);
      res.status(201).json(post);
    } catch (error) {
      const validationError = fromZodError(error);
      res.status(400).json({ message: validationError.message });
    }
  });

  app.patch("/api/posts/:id", requireAdmin, async (req, res) => {
    try {
      const post = await storage.updatePost(parseInt(req.params.id), req.body);
      res.json(post);
    } catch (error) {
      res.status(400).json({ message: "Blog yazısı güncellenirken bir hata oluştu" });
    }
  });

  app.delete("/api/posts/:id", requireAdmin, async (req, res) => {
    try {
      await storage.deletePost(parseInt(req.params.id));
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ message: "Blog yazısı silinirken bir hata oluştu" });
    }
  });

  // Products endpoints
  app.get("/api/products", async (_req, res) => {
    try {
      const products = await storage.getProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Ürünler alınırken bir hata oluştu" });
    }
  });

  app.post("/api/products", requireAdmin, async (req, res) => {
    try {
      const productData = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(productData);
      res.status(201).json(product);
    } catch (error) {
      const validationError = fromZodError(error);
      res.status(400).json({ message: validationError.message });
    }
  });

  app.patch("/api/products/:id", requireAdmin, async (req, res) => {
    try {
      const product = await storage.updateProduct(parseInt(req.params.id), req.body);
      res.json(product);
    } catch (error) {
      res.status(400).json({ message: "Ürün güncellenirken bir hata oluştu" });
    }
  });

  app.delete("/api/products/:id", requireAdmin, async (req, res) => {
    try {
      await storage.deleteProduct(parseInt(req.params.id));
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ message: "Ürün silinirken bir hata oluştu" });
    }
  });

  // Media endpoints
  app.get("/api/media", async (_req, res) => {
    try {
      const mediaFiles = await storage.getMedia();
      res.json(mediaFiles);
    } catch (error) {
      res.status(500).json({ message: "Medya dosyaları alınırken bir hata oluştu" });
    }
  });

  app.post("/api/media", requireAdmin, async (req, res) => {
    try {
      const mediaData = insertMediaSchema.parse(req.body);
      const media = await storage.createMedia(mediaData);
      res.status(201).json(media);
    } catch (error) {
      const validationError = fromZodError(error);
      res.status(400).json({ message: validationError.message });
    }
  });

  app.delete("/api/media/:id", requireAdmin, async (req, res) => {
    try {
      await storage.deleteMedia(parseInt(req.params.id));
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ message: "Medya dosyası silinirken bir hata oluştu" });
    }
  });

  // Settings endpoints
  app.get("/api/settings", async (_req, res) => {
    try {
      const settings = await storage.getSettings();
      res.json(settings);
    } catch (error) {
      res.status(500).json({ message: "Ayarlar alınırken bir hata oluştu" });
    }
  });

  app.patch("/api/settings/:key", requireAdmin, async (req, res) => {
    try {
      const setting = await storage.updateSetting(req.params.key, req.body.value);
      res.json(setting);
    } catch (error) {
      res.status(400).json({ message: "Ayar güncellenirken bir hata oluştu" });
    }
  });

  // User profile endpoints
  app.get("/api/user/profile", requireAuth, async (req, res) => {
    const user = await storage.getUserById(req.session.userId as number);
    res.json(user);
  });

  app.patch("/api/user/profile", requireAuth, async (req, res) => {
    try {
      const user = await storage.updateUser(req.session.userId as number, req.body);
      res.json(user);
    } catch (error) {
      res.status(400).json({ message: "Profil güncellenirken bir hata oluştu" });
    }
  });

  // Messages endpoints
  app.get("/api/messages", requireAuth, async (req, res) => {
    const messages = await storage.getUserMessages(req.session.userId as number);
    res.json(messages);
  });

  app.post("/api/messages", requireAuth, async (req, res) => {
    try {
      const messageData = insertMessageSchema.parse({
        ...req.body,
        senderId: req.session.userId as number
      });
      const message = await storage.createMessage(messageData);
      res.status(201).json(message);
    } catch (error) {
      const validationError = fromZodError(error);
      res.status(400).json({ message: validationError.message });
    }
  });

  // Patient images endpoints
  app.get("/api/patient-images", requireAuth, async (req, res) => {
    const images = await storage.getPatientImages(req.session.userId as number);
    res.json(images);
  });

  app.post("/api/patient-images", requireAuth, async (req, res) => {
    try {
      const imageData = insertPatientImageSchema.parse({
        ...req.body,
        patientId: req.session.userId as number
      });
      const image = await storage.createPatientImage(imageData);
      res.status(201).json(image);
    } catch (error) {
      const validationError = fromZodError(error);
      res.status(400).json({ message: validationError.message });
    }
  });

  // Services endpoints
  app.get("/api/services", async (_req, res) => {
    const services = await storage.getServices();
    res.json(services);
  });

  app.get("/api/services/:slug", async (req, res) => {
    const service = await storage.getServiceBySlug(req.params.slug);
    if (!service) {
      return res.status(404).json({ message: "Hizmet bulunamadı" });
    }
    res.json(service);
  });

  // Appointments endpoints
  app.get("/api/appointments", requireAuth, async (req, res) => {
    const appointments = await storage.getUserAppointments(req.session.userId as number);
    res.json(appointments);
  });

  app.post("/api/appointments", requireAuth, async (req, res) => {
    try {
      const appointmentData = insertAppointmentSchema.parse({
        ...req.body,
        patientId: req.session.userId as number
      });
      const appointment = await storage.createAppointment(appointmentData);
      res.status(201).json(appointment);
    } catch (error) {
      const validationError = fromZodError(error);
      res.status(400).json({ message: validationError.message });
    }
  });

  app.patch("/api/appointments/:id/status", requireAuth, async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!["pending", "confirmed", "completed", "cancelled"].includes(status)) {
      return res.status(400).json({ message: "Geçersiz durum" });
    }

    try {
      const appointment = await storage.updateAppointmentStatus(
        parseInt(id),
        status
      );
      res.json(appointment);
    } catch (error) {
      res.status(404).json({ message: "Randevu bulunamadı" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}