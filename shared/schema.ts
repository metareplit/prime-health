import { pgTable, text, serial, integer, timestamp, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Extended User model with patient-specific fields
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  fullName: text("full_name").notNull(),
  phone: text("phone").notNull(),
  role: text("role").notNull().default("patient"), // patient, doctor, admin
  profileImage: text("profile_image"),
  dateOfBirth: timestamp("date_of_birth"),
  gender: text("gender"),
  address: text("address"),
  medicalHistory: jsonb("medical_history"), // Stores detailed medical history
  preferences: jsonb("preferences"), // Stores user preferences
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Messages for patient-doctor communication
export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  senderId: integer("sender_id").notNull().references(() => users.id),
  receiverId: integer("receiver_id").notNull().references(() => users.id),
  content: text("content").notNull(),
  attachments: text("attachments").array(), // URLs to attached files
  isRead: boolean("is_read").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Patient progress images
export const patientImages = pgTable("patient_images", {
  id: serial("id").primaryKey(),
  patientId: integer("patient_id").notNull().references(() => users.id),
  imageUrl: text("image_url").notNull(),
  type: text("type").notNull(), // before, after, progress
  date: timestamp("date").notNull(),
  notes: text("notes"),
  doctorFeedback: text("doctor_feedback"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Services table
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

// Enhanced appointments table
export const appointments = pgTable("appointments", {
  id: serial("id").primaryKey(),
  patientId: integer("patient_id").notNull().references(() => users.id),
  doctorId: integer("doctor_id").notNull().references(() => users.id),
  serviceId: integer("service_id").notNull().references(() => services.id),
  date: timestamp("date").notNull(),
  time: text("time").notNull(),
  status: text("status").notNull(), // pending, confirmed, completed, cancelled
  type: text("type").notNull(), // initial, followup, control
  notes: text("notes"),
  patientNotes: text("patient_notes"), // Notes from patient
  doctorNotes: text("doctor_notes"), // Private notes for doctor
  documents: text("documents").array(), // URLs to related documents
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Schema validations with extended rules
export const insertUserSchema = createInsertSchema(users).extend({
  email: z.string().email("Geçerli bir e-posta adresi giriniz"),
  phone: z.string().min(10, "Geçerli bir telefon numarası giriniz"),
  password: z.string().min(8, "Şifre en az 8 karakter olmalıdır"),
});

export const insertMessageSchema = createInsertSchema(messages);
export const insertPatientImageSchema = createInsertSchema(patientImages);
export const insertServiceSchema = createInsertSchema(services);
export const insertAppointmentSchema = createInsertSchema(appointments);

// Types
export type User = typeof users.$inferSelect;
export type Message = typeof messages.$inferSelect;
export type PatientImage = typeof patientImages.$inferSelect;
export type Service = typeof services.$inferSelect;
export type Appointment = typeof appointments.$inferSelect;

export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type InsertPatientImage = z.infer<typeof insertPatientImageSchema>;
export type InsertService = z.infer<typeof insertServiceSchema>;
export type InsertAppointment = z.infer<typeof insertAppointmentSchema>;

// Geriye dönük uyumluluk için alias
export const insertPatientSchema = insertUserSchema;
export type InsertPatient = InsertUser;