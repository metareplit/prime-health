import type { Express } from "express";
import { createServer } from "http";
import { storage } from "./storage";
import { insertPatientSchema, insertAppointmentSchema } from "@shared/schema";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express) {
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

  // Patients endpoints
  app.get("/api/patients", async (_req, res) => {
    const patients = await storage.getPatients();
    res.json(patients);
  });

  app.post("/api/patients", async (req, res) => {
    try {
      const patient = insertPatientSchema.parse(req.body);
      const newPatient = await storage.createPatient(patient);
      res.status(201).json(newPatient);
    } catch (error) {
      const validationError = fromZodError(error);
      res.status(400).json({ message: validationError.message });
    }
  });

  // Appointments endpoints
  app.get("/api/appointments", async (_req, res) => {
    const appointments = await storage.getAppointments();
    res.json(appointments);
  });

  app.post("/api/appointments", async (req, res) => {
    try {
      const appointment = insertAppointmentSchema.parse(req.body);
      const newAppointment = await storage.createAppointment(appointment);
      res.status(201).json(newAppointment);
    } catch (error) {
      const validationError = fromZodError(error);
      res.status(400).json({ message: validationError.message });
    }
  });

  app.patch("/api/appointments/:id/status", async (req, res) => {
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
