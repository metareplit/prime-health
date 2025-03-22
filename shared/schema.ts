import { pgTable, text, serial, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const services = pgTable("services", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  longDescription: text("long_description").notNull(),
  benefits: text("benefits").array().notNull(),
  process: text("process").array().notNull(),
  faqs: text("faqs").array().notNull(),
  duration: text("duration").notNull(),
  imageUrl: text("image_url").notNull(),
  slug: text("slug").notNull().unique(),
});

export const patients = pgTable("patients", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  age: text("age").notNull(),
  gender: text("gender").notNull(),
  communicationPreferences: text("communication_preferences").array(),
  previousTreatments: text("previous_treatments"),
  medicalConditions: text("medical_conditions"),
  notes: text("notes"),
});

export const appointments = pgTable("appointments", {
  id: serial("id").primaryKey(),
  patientId: integer("patient_id").notNull(),
  serviceId: integer("service_id").notNull(),
  date: timestamp("date").notNull(),
  time: text("time").notNull(),
  status: text("status").notNull(), // pending, confirmed, completed, cancelled
  notes: text("notes"),
});

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  isAdmin: boolean("is_admin").notNull().default(false),
});

// Schema validations with extended rules
export const insertServiceSchema = createInsertSchema(services);

export const insertPatientSchema = createInsertSchema(patients).extend({
  email: z.string().email("Geçerli bir e-posta adresi giriniz"),
  phone: z.string().min(10, "Telefon numarası en az 10 karakter olmalıdır"),
  age: z.string().min(1, "Yaş bilgisi gereklidir"),
  gender: z.string().min(1, "Cinsiyet seçimi gereklidir"),
  communicationPreferences: z.array(z.string()).optional(),
  previousTreatments: z.string().optional(),
  medicalConditions: z.string().optional(),
  notes: z.string().optional(),
  step: z.string(),
  preferredDate: z.date(),
  preferredTime: z.string(),
});

export const insertAppointmentSchema = createInsertSchema(appointments);
export const insertUserSchema = createInsertSchema(users);

export type Service = typeof services.$inferSelect;
export type Patient = typeof patients.$inferSelect;
export type Appointment = typeof appointments.$inferSelect;
export type User = typeof users.$inferSelect;

export type InsertService = z.infer<typeof insertServiceSchema>;
export type InsertPatient = z.infer<typeof insertPatientSchema>;
export type InsertAppointment = z.infer<typeof insertAppointmentSchema>;
export type InsertUser = z.infer<typeof insertUserSchema>;