import { pgTable, text, serial, integer, timestamp, boolean, jsonb, decimal } from "drizzle-orm/pg-core";
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

// Blog posts table
export const posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  content: text("content").notNull(),
  excerpt: text("excerpt").notNull(),
  featuredImage: text("featured_image"),
  status: text("status").notNull().default("draft"), // draft, published
  authorId: integer("author_id").references(() => users.id),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  seoTitle: text("seo_title"),
  seoDescription: text("seo_description"),
  category: text("category"),
  tags: text("tags").array(),
});

// Products table
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull(),
  longDescription: text("long_description"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  images: text("images").array(),
  category: text("category").notNull(),
  inStock: boolean("in_stock").notNull().default(true),
  featured: boolean("featured").default(false),
  specifications: jsonb("specifications"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Media library
export const media = pgTable("media", {
  id: serial("id").primaryKey(),
  filename: text("filename").notNull(),
  originalName: text("original_name").notNull(),
  mimeType: text("mime_type").notNull(),
  size: integer("size").notNull(),
  url: text("url").notNull(),
  uploadedById: integer("uploaded_by_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Site settings
export const settings = pgTable("settings", {
  id: serial("id").primaryKey(),
  key: text("key").notNull().unique(),
  value: text("value").notNull(),
  type: text("type").notNull(), // text, json, number, boolean
  group: text("group").notNull(), // general, contact, seo, social
  label: text("label").notNull(),
  description: text("description"),
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
  price: decimal("price", { precision: 10, scale: 2 }),
  imageUrl: text("image_url").notNull(),
  slug: text("slug").notNull().unique(),
  featured: boolean("featured").default(false),
  order: integer("order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Success Stories table
export const successStories = pgTable("success_stories", {
  id: serial("id").primaryKey(),
  patientName: text("patient_name").notNull(),
  age: integer("age"),
  treatmentType: text("treatment_type").notNull(),
  description: text("description").notNull(),
  testimonial: text("testimonial"),
  beforeImages: text("before_images").array(),
  afterImages: text("after_images").array(),
  treatmentDate: timestamp("treatment_date").notNull(),
  recoveryTime: text("recovery_time"),
  satisfaction: integer("satisfaction").default(5),
  featured: boolean("featured").default(false),
  published: boolean("published").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
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

// Email şablonları tablosu
export const emailTemplates = pgTable("email_templates", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  subject: text("subject").notNull(),
  body: text("body").notNull(),
  type: text("type").notNull(), // appointment_reminder, welcome, custom
  variables: text("variables").array(),
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
export const insertPostSchema = createInsertSchema(posts);
export const insertProductSchema = createInsertSchema(products);
export const insertMediaSchema = createInsertSchema(media);
export const insertSettingSchema = createInsertSchema(settings);
export const insertEmailTemplateSchema = createInsertSchema(emailTemplates);

// Add success stories validation schema
export const successStoriesSchema = z.object({
  patientName: z.string().min(1, "Hasta adı gereklidir"),
  age: z.number().nullable(),
  treatmentType: z.string().min(1, "Tedavi tipi gereklidir"),
  description: z.string().min(1, "Açıklama gereklidir"),
  testimonial: z.string().nullable(),
  beforeImages: z.array(z.string()).default([]),
  afterImages: z.array(z.string()).default([]),
  treatmentDate: z.date(),
  recoveryTime: z.string().nullable(),
  satisfaction: z.number().min(1).max(5).default(5),
  featured: z.boolean().default(false),
  published: z.boolean().default(false),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date())
});

// Update the insert schema
export const insertSuccessStorySchema = successStoriesSchema;


// Types
export type User = typeof users.$inferSelect;
export type Message = typeof messages.$inferSelect;
export type PatientImage = typeof patientImages.$inferSelect;
export type Service = typeof services.$inferSelect;
export type Appointment = typeof appointments.$inferSelect;
export type Post = typeof posts.$inferSelect;
export type Product = typeof products.$inferSelect;
export type Media = typeof media.$inferSelect;
export type Setting = typeof settings.$inferSelect;
export type EmailTemplate = typeof emailTemplates.$inferSelect;
export type SuccessStory = typeof successStories.$inferSelect;

export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type InsertPatientImage = z.infer<typeof insertPatientImageSchema>;
export type InsertService = z.infer<typeof insertServiceSchema>;
export type InsertAppointment = z.infer<typeof insertAppointmentSchema>;
export type InsertPost = z.infer<typeof insertPostSchema>;
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type InsertMedia = z.infer<typeof insertMediaSchema>;
export type InsertSetting = z.infer<typeof insertSettingSchema>;
export type InsertEmailTemplate = z.infer<typeof insertEmailTemplateSchema>;
export type InsertSuccessStory = z.infer<typeof insertSuccessStorySchema>;

// Geriye dönük uyumluluk için alias
export const insertPatientSchema = insertUserSchema;
export type InsertPatient = InsertUser;