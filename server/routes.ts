import type { Express } from "express";
import { createServer } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertAppointmentSchema, insertMessageSchema, insertPatientImageSchema } from "@shared/schema";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express) {
  // Auth endpoints
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

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await storage.authenticateUser(username, password);
      if (user) {
        req.session.userId = user.id;
        res.json(user);
      } else {
        res.status(401).json({ message: "Geçersiz kullanıcı adı veya şifre" });
      }
    } catch (error) {
      res.status(500).json({ message: "Giriş yapılırken bir hata oluştu" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy(() => {
      res.json({ message: "Çıkış yapıldı" });
    });
  });

  // User profile endpoints
  app.get("/api/user/profile", async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Oturum açmanız gerekiyor" });
    }
    const user = await storage.getUserById(req.session.userId);
    res.json(user);
  });

  app.patch("/api/user/profile", async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Oturum açmanız gerekiyor" });
    }
    try {
      const user = await storage.updateUser(req.session.userId, req.body);
      res.json(user);
    } catch (error) {
      res.status(400).json({ message: "Profil güncellenirken bir hata oluştu" });
    }
  });

  // Messages endpoints
  app.get("/api/messages", async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Oturum açmanız gerekiyor" });
    }
    const messages = await storage.getUserMessages(req.session.userId);
    res.json(messages);
  });

  app.post("/api/messages", async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Oturum açmanız gerekiyor" });
    }
    try {
      const messageData = insertMessageSchema.parse({
        ...req.body,
        senderId: req.session.userId
      });
      const message = await storage.createMessage(messageData);
      res.status(201).json(message);
    } catch (error) {
      const validationError = fromZodError(error);
      res.status(400).json({ message: validationError.message });
    }
  });

  // Patient images endpoints
  app.get("/api/patient-images", async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Oturum açmanız gerekiyor" });
    }
    const images = await storage.getPatientImages(req.session.userId);
    res.json(images);
  });

  app.post("/api/patient-images", async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Oturum açmanız gerekiyor" });
    }
    try {
      const imageData = insertPatientImageSchema.parse({
        ...req.body,
        patientId: req.session.userId
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
  app.get("/api/appointments", async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Oturum açmanız gerekiyor" });
    }
    const appointments = await storage.getUserAppointments(req.session.userId);
    res.json(appointments);
  });

  app.post("/api/appointments", async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Oturum açmanız gerekiyor" });
    }
    try {
      const appointmentData = insertAppointmentSchema.parse({
        ...req.body,
        patientId: req.session.userId
      });
      const appointment = await storage.createAppointment(appointmentData);
      res.status(201).json(appointment);
    } catch (error) {
      const validationError = fromZodError(error);
      res.status(400).json({ message: validationError.message });
    }
  });

  app.patch("/api/appointments/:id/status", async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Oturum açmanız gerekiyor" });
    }

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