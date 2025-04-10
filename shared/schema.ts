import { pgTable, text, serial, timestamp, boolean, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User roles enum
export const UserRole = {
  ADMIN: "admin",
  DOCTOR: "doctor",
  PATIENT: "patient",
} as const;

export type UserRoleType = typeof UserRole[keyof typeof UserRole];

// Gender enum
export const Gender = {
  MALE: "male",
  FEMALE: "female",
  OTHER: "other",
} as const;

export type GenderType = typeof Gender[keyof typeof Gender];

// Extended User model with patient-specific fields
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").unique(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone").notNull(),
  role: text("role").notNull().default(UserRole.PATIENT),
  profileImage: text("profile_image"),
  dateOfBirth: timestamp("date_of_birth").notNull(),
  gender: text("gender").notNull(),
  address: text("address"),
  medicalHistory: text("medical_history"),
  preferences: text("preferences"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Blog posts table with enhanced SEO features
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
  readingTime: text("reading_time"),
  metaKeywords: text("meta_keywords"),
  canonical: text("canonical_url"),
  ogImage: text("og_image"),
  structuredData: text("structured_data")
});

// Update products table boolean fields
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull(),
  longDescription: text("long_description"),
  price: text("price").notNull(),
  images: text("images").array(),
  category: text("category").notNull(),
  inStock: boolean("in_stock").notNull().default(true),
  featured: boolean("featured").default(false),
  specifications: text("specifications"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Update services table boolean field
export const services = pgTable("services", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  longDescription: text("long_description").notNull(),
  benefits: text("benefits").array().notNull(),
  process: text("process").array().notNull(),
  faqs: text("faqs").array().notNull(),
  duration: text("duration").notNull(),
  price: text("price"),
  imageUrl: text("image_url").notNull(),
  slug: text("slug").notNull().unique(),
  featured: boolean("featured").default(false),
  order: serial("order").default(0),
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
  type: text("type").notNull(), // text, secret, number, boolean
  group: text("group").notNull(), // telegram, admin, general
  label: text("label").notNull(),
  description: text("description"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Contact Info table for managing clinic contact details
export const contactInfo = pgTable("contact_info", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(), // address, phone, email, social
  label: text("label").notNull(),
  value: text("value").notNull(),
  icon: text("icon"),
  order: integer("order").default(0),
  isActive: boolean("is_active").default(true),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Messages table with enhanced features
export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  senderId: serial("sender_id").notNull().references(() => users.id),
  receiverId: serial("receiver_id").notNull().references(() => users.id),
  content: text("content").notNull(),
  attachments: text("attachments").array(),
  isRead: boolean("is_read").default(false),
  readAt: timestamp("read_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
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

// Appointments table schema update
export const appointments = pgTable("appointments", {
  id: serial("id").primaryKey(),
  fullName: text("full_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  date: timestamp("date").notNull(),
  time: text("time").notNull(),
  status: text("status").notNull().default("confirmed"),
  type: text("type").notNull().default("initial"),
  notes: text("notes"),
  patientId: serial("patient_id").references(() => users.id),
  doctorId: serial("doctor_id").references(() => users.id),
  serviceId: serial("service_id").references(() => services.id),
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
  beforeDate: timestamp("before_date"),
  afterDate: timestamp("after_date"),
  treatmentDate: timestamp("treatment_date").notNull(),
  notes: text("notes"),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Sliders tablosu
export const sliders = pgTable("sliders", {
  id: serial("id").primaryKey(),
  imageUrl: text("image_url").notNull(),
  order: integer("order").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Schema validations with extended rules
export const insertUserSchema = createInsertSchema(users).extend({
  firstName: z.string().min(2, "Ad en az 2 karakter olmalıdır"),
  lastName: z.string().min(2, "Soyad en az 2 karakter olmalıdır"),
  email: z.string().email("Geçerli bir e-posta adresi giriniz"),
  phone: z.string().min(10, "Geçerli bir telefon numarası giriniz"),
  password: z.string().min(8, "Şifre en az 8 karakter olmalıdır"),
  dateOfBirth: z.date().max(new Date(), "Doğum tarihi bugünden büyük olamaz"),
  gender: z.enum(["male", "female", "other"], {
    errorMap: () => ({ message: "Lütfen cinsiyet seçiniz" }),
  }),
  role: z.enum([UserRole.ADMIN, UserRole.DOCTOR, UserRole.PATIENT]).default(UserRole.PATIENT),
});

export const insertMessageSchema = createInsertSchema(messages).extend({
  content: z.string().min(1, "Mesaj içeriği boş olamaz"),
  attachments: z.array(z.string()).optional().default([]),
});
export const insertContactInfoSchema = createInsertSchema(contactInfo).extend({
  label: z.string().min(1, "Etiket alanı zorunludur"),
  value: z.string().min(1, "Değer alanı zorunludur"),
  type: z.enum(["address", "phone", "email", "social"]),
  icon: z.string().optional(),
});

export const insertPatientImageSchema = createInsertSchema(patientImages);
export const insertServiceSchema = createInsertSchema(services);
// Update appointment schema
export const insertAppointmentSchema = createInsertSchema(appointments).extend({
  date: z.date().min(new Date(), "Randevu tarihi geçmiş bir tarih olamaz"),
  time: z.string().min(1, "Randevu saati gereklidir"),
  fullName: z.string().min(2, "Ad Soyad gereklidir"),
  email: z.string().email("Geçerli bir email adresi giriniz"),
  phone: z.string().min(10, "Geçerli bir telefon numarası giriniz"),
  type: z.enum(["initial", "followup", "control"]).default("initial"),
  status: z.enum(["confirmed", "completed", "cancelled"]).default("confirmed"),
  notes: z.string().optional(),
});

// Export the insert schema with validations
export const insertPostSchema = createInsertSchema(posts).extend({
  title: z.string().min(1, "Başlık gereklidir"),
  slug: z.string().min(1, "URL gereklidir"),
  content: z.string().min(1, "İçerik gereklidir"),
  excerpt: z.string().min(1, "Özet gereklidir"),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  category: z.string().optional(),
  tags: z.array(z.string()).optional(),
  metaKeywords: z.string().optional(),
  canonical: z.string().optional(),
  ogImage: z.string().optional(),
  structuredData: z.string().optional()
});

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
  beforeDate: z.date().optional(),
  afterDate: z.date().optional(),
  treatmentDate: z.date(),
  notes: z.string().optional(),
  description: z.string().optional(),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date())
});

// Update the insert schema
export const insertBeforeAfterSchema = beforeAfterSchema;

// Slider şeması
export const sliderSchema = z.object({
  imageUrl: z.string().min(1, "Resim URL'si gereklidir"),
  order: z.number().default(0),
  isActive: z.boolean().default(true),
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
export type ContactInfo = typeof contactInfo.$inferSelect;
export type InsertContactInfo = z.infer<typeof insertContactInfoSchema>;
export type InsertMessage = z.infer<typeof insertMessageSchema>;

export type InsertUser = z.infer<typeof insertUserSchema>;
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

// Success Stories tablosu
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

// Settings için Zod şeması
export const settingSchema = z.object({
  key: z.string(),
  value: z.string(),
  type: z.enum(["text", "secret", "number", "boolean"]),
  group: z.enum(["telegram", "admin", "general"]),
  label: z.string(),
  description: z.string().optional(),
  updatedAt: z.date().optional(),
});

export type Setting = typeof settings.$inferSelect;
export type InsertSetting = z.infer<typeof settingSchema>;

// Telegram ve Admin ayarları için default değerler
export const defaultSettings = [
  {
    key: "telegram_api_id",
    value: "",
    type: "secret",
    group: "telegram",
    label: "Telegram API ID",
    description: "Telegram API geliştirici portalından alınan API ID"
  },
  {
    key: "telegram_api_hash",
    value: "",
    type: "secret",
    group: "telegram",
    label: "Telegram API Hash",
    description: "Telegram API geliştirici portalından alınan API Hash"
  },
  {
    key: "telegram_bot_token",
    value: "",
    type: "secret",
    group: "telegram",
    label: "Bot Token",
    description: "BotFather'dan alınan bot token"
  },
  {
    key: "telegram_chat_id",
    value: "",
    type: "secret",
    group: "telegram",
    label: "Chat ID",
    description: "Bildirimlerin gönderileceği chat ID"
  },
  {
    key: "admin_key",
    value: "",
    type: "secret",
    group: "admin",
    label: "Admin Anahtarı",
    description: "Admin paneline erişim için güvenlik anahtarı"
  }
];

// Success Stories şeması
export const successStorySchema = z.object({
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
  updatedAt: z.date().default(() => new Date()),
});

// Export types
export type SuccessStory = typeof successStories.$inferSelect;
export type InsertSuccessStory = z.infer<typeof successStorySchema>;
export type InsertPost = z.infer<typeof insertPostSchema>;