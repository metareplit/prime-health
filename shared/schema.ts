import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";
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
  medicalHistory: text("medical_history"), // Stores detailed medical history
  preferences: text("preferences"), // Stores user preferences
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
  authorId: serial("author_id").references(() => users.id),
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
  price: text("price").notNull(),
  images: text("images").array(),
  category: text("category").notNull(),
  inStock: text("in_stock").notNull().default(true),
  featured: text("featured").default(false),
  specifications: text("specifications"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Media library
export const media = pgTable("media", {
  id: serial("id").primaryKey(),
  filename: text("filename").notNull(),
  originalName: text("original_name").notNull(),
  mimeType: text("mime_type").notNull(),
  size: serial("size").notNull(),
  url: text("url").notNull(),
  uploadedById: serial("uploaded_by_id").references(() => users.id),
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
  senderId: serial("sender_id").notNull().references(() => users.id),
  receiverId: serial("receiver_id").notNull().references(() => users.id),
  content: text("content").notNull(),
  attachments: text("attachments").array(), // URLs to attached files
  isRead: text("is_read").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Patient progress images
export const patientImages = pgTable("patient_images", {
  id: serial("id").primaryKey(),
  patientId: serial("patient_id").notNull().references(() => users.id),
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
  price: text("price", { precision: 10, scale: 2 }),
  imageUrl: text("image_url").notNull(),
  slug: text("slug").notNull().unique(),
  featured: text("featured").default(false),
  order: serial("order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});


// Appointments table
export const appointments = pgTable("appointments", {
  id: serial("id").primaryKey(),
  patientId: serial("patient_id").notNull().references(() => users.id),
  doctorId: serial("doctor_id").notNull().references(() => users.id),
  serviceId: serial("service_id").notNull().references(() => services.id),
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

// Öncesi Sonrası tablosu
export const beforeAfter = pgTable("before_after", {
  id: serial("id").primaryKey(),
  patientName: text("patient_name").notNull(),
  treatmentType: text("treatment_type").notNull(),
  beforeImages: text("before_images").array(),
  afterImages: text("after_images").array(),
  treatmentDate: timestamp("treatment_date").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Sliders tablosu
export const sliders = pgTable("sliders", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  imageUrl: text("image_url").notNull(),
  buttonText: text("button_text"),
  buttonUrl: text("button_url"),
  order: serial("order").default(0),
  isActive: text("is_active").default("true"),
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

// Öncesi Sonrası şeması
export const beforeAfterSchema = z.object({
  patientName: z.string().min(1, "Hasta adı gereklidir"),
  treatmentType: z.string().min(1, "Tedavi tipi gereklidir"),
  beforeImages: z.array(z.string()).default([]),
  afterImages: z.array(z.string()).default([]),
  treatmentDate: z.date(),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date())
});

// Update the insert schema
export const insertBeforeAfterSchema = beforeAfterSchema;

// Slider şeması
export const sliderSchema = z.object({
  title: z.string().min(1, "Başlık gereklidir"),
  description: z.string().optional(),
  imageUrl: z.string().min(1, "Resim URL'si gereklidir"),
  buttonText: z.string().optional(),
  buttonUrl: z.string().optional(),
  order: z.number().default(0),
  isActive: z.string().default("true"),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date())
});

// Insert şeması
export const insertSliderSchema = sliderSchema;


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
export type BeforeAfter = typeof beforeAfter.$inferSelect;
export type Slider = typeof sliders.$inferSelect;

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
export type InsertBeforeAfter = z.infer<typeof insertBeforeAfterSchema>;
export type InsertSlider = z.infer<typeof insertSliderSchema>;

// Geriye dönük uyumluluk için alias
export const insertPatientSchema = insertUserSchema;
export type InsertPatient = InsertUser;