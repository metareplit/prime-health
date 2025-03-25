import { pgTable, text, serial, timestamp, boolean, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

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

export const insertMessageSchema = createInsertSchema(messages).extend({
  content: z.string().min(1, "Mesaj içeriği boş olamaz"),
  attachments: z.array(z.string()).optional().default([]),
});

export type Message = typeof messages.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;

// Admin user model
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").unique(),
  password: text("password").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull().unique(),
  role: text("role").notNull().default("admin"),
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
  status: text("status").notNull().default("draft"),
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
  inStock: boolean("in_stock").notNull().default(true),
  featured: boolean("featured").default(false),
  specifications: text("specifications"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
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
  type: text("type").notNull(),
  group: text("group").notNull(),
  label: text("label").notNull(),
  description: text("description"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Contact Info table
export const contactInfo = pgTable("contact_info", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(),
  label: text("label").notNull(),
  value: text("value").notNull(),
  icon: text("icon"),
  order: integer("order").default(0),
  isActive: boolean("is_active").default(true),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Sliders table
export const sliders = pgTable("sliders", {
  id: serial("id").primaryKey(),
  imageUrl: text("image_url").notNull(),
  order: integer("order").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Schema validations
export const insertUserSchema = createInsertSchema(users).extend({
  username: z.string().min(3, "Kullanıcı adı en az 3 karakter olmalıdır"),
  password: z.string().min(8, "Şifre en az 8 karakter olmalıdır"),
  email: z.string().email("Geçerli bir e-posta adresi giriniz"),
  firstName: z.string().min(2, "Ad en az 2 karakter olmalıdır"),
  lastName: z.string().min(2, "Soyad en az 2 karakter olmalıdır"),
});

export const insertPostSchema = createInsertSchema(posts);
export const insertProductSchema = createInsertSchema(products);
export const insertServiceSchema = createInsertSchema(services);
export const insertMediaSchema = createInsertSchema(media);
export const insertSettingSchema = createInsertSchema(settings);
export const insertSliderSchema = createInsertSchema(sliders);
export const insertContactInfoSchema = createInsertSchema(contactInfo).extend({
  label: z.string().min(1, "Etiket alanı zorunludur"),
  value: z.string().min(1, "Değer alanı zorunludur"),
  type: z.enum(["address", "phone", "email", "social"]),
  icon: z.string().optional(),
});

// Types
export type User = typeof users.$inferSelect;
export type Post = typeof posts.$inferSelect;
export type Product = typeof products.$inferSelect;
export type Service = typeof services.$inferSelect;
export type Media = typeof media.$inferSelect;
export type Setting = typeof settings.$inferSelect;
export type Slider = typeof sliders.$inferSelect;
export type ContactInfo = typeof contactInfo.$inferSelect;
export type InsertContactInfo = z.infer<typeof insertContactInfoSchema>;
export type InsertPost = z.infer<typeof insertPostSchema>;
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type InsertService = z.infer<typeof insertServiceSchema>;
export type InsertMedia = z.infer<typeof insertMediaSchema>;
export type InsertSetting = z.infer<typeof insertSettingSchema>;
export type InsertSlider = z.infer<typeof insertSliderSchema>;
export type InsertUser = z.infer<typeof insertUserSchema>;


// Settings için Zod şeması
export const settingSchema = z.object({
  key: z.string(),
  value: z.string(),
  type: z.enum(["text", "secret", "number", "boolean"]),
  group: z.enum(["admin", "general"]),
  label: z.string(),
  description: z.string().optional(),
  updatedAt: z.date().optional(),
});

// Default settings
export const defaultSettings = [
  {
    key: "admin_key",
    value: "",
    type: "secret",
    group: "admin",
    label: "Admin Anahtarı",
    description: "Admin paneline erişim için güvenlik anahtarı"
  }
];

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

// Success Stories schema
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
});

export type SuccessStory = typeof successStories.$inferSelect;
export type InsertSuccessStory = z.infer<typeof successStorySchema>;