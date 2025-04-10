import {
  users,
  posts,
  products,
  media,
  settings,
  services,
  messages,
  patientImages,
  appointments,
  emailTemplates,
  beforeAfter,
  type User,
  type Post,
  type Product,
  type Media,
  type Setting,
  type Service,
  type Message,
  type PatientImage,
  type Appointment,
  type EmailTemplate,
  type BeforeAfter,
  type InsertUser,
  type InsertPost,
  type InsertProduct,
  type InsertMedia,
  type InsertSetting,
  type InsertService,
  type InsertMessage,
  type InsertPatientImage,
  type InsertAppointment,
  type InsertEmailTemplate,
  type InsertBeforeAfter,
  sliders,
  type Slider,
  type InsertSlider,
  defaultSettings,
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";

const PostgresSessionStore = connectPg(session);

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserById(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, data: Partial<User>): Promise<User>;
  authenticateUser(username: string, password: string): Promise<User | null>;
  getUserByEmail(email: string): Promise<User | undefined>;

  // Posts methods
  getPosts(): Promise<Post[]>;
  getPostBySlug(slug: string): Promise<Post | undefined>;
  createPost(post: InsertPost): Promise<Post>;
  updatePost(id: number, data: Partial<Post>): Promise<Post>;
  deletePost(id: number): Promise<void>;

  // Products methods
  getProducts(): Promise<Product[]>;
  getProductBySlug(slug: string): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, data: Partial<Product>): Promise<Product>;
  deleteProduct(id: number): Promise<void>;

  // Media methods
  getMedia(): Promise<Media[]>;
  getMediaById(id: number): Promise<Media | undefined>;
  createMedia(media: InsertMedia): Promise<Media>;
  deleteMedia(id: number): Promise<void>;

  // Settings methods
  getSettings(): Promise<Setting[]>;
  getSettingByKey(key: string): Promise<Setting | undefined>;
  getSettingValue(key: string): Promise<string>;
  updateSetting(key: string, value: string): Promise<Setting>;
  initializeDefaultSettings(): Promise<void>;

  // Services methods
  getAllServices(): Promise<Service[]>;
  getServiceById(id: number): Promise<Service | undefined>;
  getServiceBySlug(slug: string): Promise<Service | undefined>;
  createService(service: InsertService): Promise<Service>;
  updateService(id: number, data: Partial<Service>): Promise<Service>;
  deleteService(id: number): Promise<void>;
  updateServiceOrder(id: number, order: number): Promise<Service>;
  getService(id: number): Promise<Service | undefined>;


  // Messages methods
  getUserMessages(userId: number): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;

  // Patient Images methods
  getPatientImages(patientId: number): Promise<PatientImage[]>;
  createPatientImage(image: InsertPatientImage): Promise<PatientImage>;

  // Appointments methods
  getUserAppointments(userId: number): Promise<Appointment[]>;
  createAppointment(appointment: InsertAppointment): Promise<Appointment>;
  updateAppointmentStatus(id: number, status: string): Promise<Appointment>;
  getAllAppointments(): Promise<Appointment[]>;
  getAppointment(id: number): Promise<Appointment | undefined>;
  updateAppointment(id: number, data: Partial<Appointment>): Promise<Appointment>;

  // Email Template methods
  getAllEmailTemplates(): Promise<EmailTemplate[]>;
  createEmailTemplate(template: InsertEmailTemplate): Promise<EmailTemplate>;
  updateEmailTemplate(id: number, data: Partial<EmailTemplate>): Promise<EmailTemplate>;
  deleteEmailTemplate(id: number): Promise<void>;

  // Before After methods
  getAllBeforeAfter(): Promise<BeforeAfter[]>;
  getBeforeAfterById(id: number): Promise<BeforeAfter | undefined>;
  createBeforeAfter(data: InsertBeforeAfter): Promise<BeforeAfter>;
  updateBeforeAfter(id: number, data: Partial<BeforeAfter>): Promise<BeforeAfter>;
  deleteBeforeAfter(id: number): Promise<void>;

  // Slider methods
  getAllSliders(): Promise<Slider[]>;
  getSliderById(id: number): Promise<Slider | undefined>;
  createSlider(data: InsertSlider): Promise<Slider>;
  updateSlider(id: number, data: Partial<Slider>): Promise<Slider>;
  deleteSlider(id: number): Promise<void>;
  updateSliderOrder(id: number, order: number): Promise<Slider>;
  sessionStore: any;
}

export class DatabaseStorage implements IStorage {
  sessionStore: any;

  constructor() {
    this.sessionStore = new PostgresSessionStore({
      conObject: {
        connectionString: process.env.DATABASE_URL,
      },
      createTableIfMissing: true,
    });

    // Initialize default settings on startup
    this.initializeDefaultSettings().catch(console.error);
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserById(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(user: InsertUser): Promise<User> {
    const [newUser] = await db.insert(users).values(user).returning();
    return newUser;
  }

  async updateUser(id: number, data: Partial<User>): Promise<User> {
    const [updatedUser] = await db
      .update(users)
      .set(data)
      .where(eq(users.id, id))
      .returning();
    return updatedUser;
  }

  async authenticateUser(username: string, password: string): Promise<User | null> {
    const user = await this.getUserByUsername(username);
    if (!user || user.password !== password) return null;
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    try {
      const [user] = await db.select().from(users).where(eq(users.email, email));
      return user;
    } catch (error) {
      console.error('Error in getUserByEmail:', error);
      return undefined;
    }
  }

  // Posts methods
  async getPosts(): Promise<Post[]> {
    return await db.select().from(posts);
  }

  async getPostBySlug(slug: string): Promise<Post | undefined> {
    const [post] = await db.select().from(posts).where(eq(posts.slug, slug));
    return post;
  }

  async createPost(post: InsertPost): Promise<Post> {
    const [newPost] = await db.insert(posts).values(post).returning();
    return newPost;
  }

  async updatePost(id: number, data: Partial<Post>): Promise<Post> {
    const [updatedPost] = await db
      .update(posts)
      .set(data)
      .where(eq(posts.id, id))
      .returning();
    return updatedPost;
  }

  async deletePost(id: number): Promise<void> {
    await db.delete(posts).where(eq(posts.id, id));
  }

  // Products methods
  async getProducts(): Promise<Product[]> {
    return await db.select().from(products);
  }

  async getProductBySlug(slug: string): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.slug, slug));
    return product;
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const [newProduct] = await db.insert(products).values(product).returning();
    return newProduct;
  }

  async updateProduct(id: number, data: Partial<Product>): Promise<Product> {
    const [updatedProduct] = await db
      .update(products)
      .set(data)
      .where(eq(products.id, id))
      .returning();
    return updatedProduct;
  }

  async deleteProduct(id: number): Promise<void> {
    await db.delete(products).where(eq(products.id, id));
  }

  // Media methods
  async getMedia(): Promise<Media[]> {
    return await db.select().from(media);
  }

  async getMediaById(id: number): Promise<Media | undefined> {
    const [mediaItem] = await db.select().from(media).where(eq(media.id, id));
    return mediaItem;
  }

  async createMedia(mediaItem: InsertMedia): Promise<Media> {
    const [newMedia] = await db.insert(media).values(mediaItem).returning();
    return newMedia;
  }

  async deleteMedia(id: number): Promise<void> {
    await db.delete(media).where(eq(media.id, id));
  }

  // Settings methods
  async getSettings(): Promise<Setting[]> {
    try {
      return await db.select().from(settings);
    } catch (error) {
      console.error('Error fetching settings:', error);
      return [];
    }
  }

  async getSettingByKey(key: string): Promise<Setting | undefined> {
    try {
      const [setting] = await db.select().from(settings).where(eq(settings.key, key));
      return setting;
    } catch (error) {
      console.error(`Error fetching setting with key ${key}:`, error);
      return undefined;
    }
  }

  async getSettingValue(key: string): Promise<string> {
    try {
      const setting = await this.getSettingByKey(key);
      return setting?.value || '';
    } catch (error) {
      console.error(`Error getting setting value for key ${key}:`, error);
      return '';
    }
  }

  async updateSetting(key: string, value: string): Promise<Setting> {
    try {
      const existing = await this.getSettingByKey(key);

      if (!existing) {
        // If setting doesn't exist, create it
        const [newSetting] = await db.insert(settings)
          .values({
            key,
            value,
            type: 'text',
            group: 'general',
            label: key,
            updatedAt: new Date()
          })
          .returning();
        return newSetting;
      }

      // Update existing setting
      const [updatedSetting] = await db
        .update(settings)
        .set({ value, updatedAt: new Date() })
        .where(eq(settings.key, key))
        .returning();
      return updatedSetting;
    } catch (error) {
      console.error(`Error updating setting ${key}:`, error);
      throw error;
    }
  }

  async initializeDefaultSettings(): Promise<void> {
    try {
      for (const setting of defaultSettings) {
        const existing = await this.getSettingByKey(setting.key);
        if (!existing) {
          await db.insert(settings).values({
            ...setting,
            updatedAt: new Date()
          });
          console.log(`Initialized default setting: ${setting.key}`);
        }
      }
    } catch (error) {
      console.error('Error initializing default settings:', error);
    }
  }

  // Services methods
  async getAllServices(): Promise<Service[]> {
    return await db.select().from(services).orderBy(services.order);
  }

  async getServiceById(id: number): Promise<Service | undefined> {
    const [service] = await db.select().from(services).where(eq(services.id, id));
    return service;
  }

  async getServiceBySlug(slug: string): Promise<Service | undefined> {
    const [service] = await db.select().from(services).where(eq(services.slug, slug));
    return service;
  }

  async createService(service: InsertService): Promise<Service> {
    const [newService] = await db.insert(services).values(service).returning();
    return newService;
  }

  async updateService(id: number, data: Partial<Service>): Promise<Service> {
    const [updatedService] = await db
      .update(services)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(services.id, id))
      .returning();
    return updatedService;
  }

  async deleteService(id: number): Promise<void> {
    await db.delete(services).where(eq(services.id, id));
  }

  async updateServiceOrder(id: number, order: number): Promise<Service> {
    const [updatedService] = await db
      .update(services)
      .set({ order, updatedAt: new Date() })
      .where(eq(services.id, id))
      .returning();
    return updatedService;
  }

  async getService(id: number): Promise<Service | undefined> {
    try {
      const [service] = await db
        .select()
        .from(services)
        .where(eq(services.id, id));
      return service;
    } catch (error) {
      console.error('Error in getService:', error);
      throw error;
    }
  }

  // Messages methods
  async getUserMessages(userId: number): Promise<Message[]> {
    return await db
      .select()
      .from(messages)
      .where(eq(messages.senderId, userId));
  }

  async createMessage(message: InsertMessage): Promise<Message> {
    const [newMessage] = await db.insert(messages).values(message).returning();
    return newMessage;
  }

  // Patient Images methods
  async getPatientImages(patientId: number): Promise<PatientImage[]> {
    return await db
      .select()
      .from(patientImages)
      .where(eq(patientImages.patientId, patientId));
  }

  async createPatientImage(image: InsertPatientImage): Promise<PatientImage> {
    const [newImage] = await db.insert(patientImages).values(image).returning();
    return newImage;
  }

  // Appointments methods
  async getUserAppointments(userId: number): Promise<Appointment[]> {
    try {
      const result = await db
        .select()
        .from(appointments)
        .where(eq(appointments.patientId, userId))
        .orderBy(appointments.createdAt);

      console.log('Fetched user appointments:', result);
      return result;
    } catch (error) {
      console.error('Error in getUserAppointments:', error);
      throw error;
    }
  }

  async createAppointment(appointment: InsertAppointment): Promise<Appointment> {
    try {
      console.log('Creating appointment with data:', appointment);
      const [newAppointment] = await db
        .insert(appointments)
        .values(appointment)
        .returning();

      console.log('Created appointment:', newAppointment);
      return newAppointment;
    } catch (error) {
      console.error('Error in createAppointment:', error);
      throw error;
    }
  }

  async updateAppointmentStatus(id: number, status: string): Promise<Appointment> {
    const [updatedAppointment] = await db
      .update(appointments)
      .set({ status })
      .where(eq(appointments.id, id))
      .returning();
    return updatedAppointment;
  }

  async getAllAppointments(): Promise<Appointment[]> {
    try {
      const result = await db
        .select()
        .from(appointments)
        .orderBy(appointments.createdAt);

      console.log('Fetched all appointments:', result);
      return result;
    } catch (error) {
      console.error('Error in getAllAppointments:', error);
      throw error;
    }
  }

  async updateAppointment(id: number, data: Partial<Appointment>): Promise<Appointment> {
    const [updatedAppointment] = await db
      .update(appointments)
      .set(data)
      .where(eq(appointments.id, id))
      .returning();
    return updatedAppointment;
  }
  async getAppointment(id: number): Promise<Appointment | undefined> {
    try {
      const [appointment] = await db
        .select()
        .from(appointments)
        .where(eq(appointments.id, id));
      return appointment;
    } catch (error) {
      console.error('Error in getAppointment:', error);
      throw error;
    }
  }

  // Email Template methods
  async getAllEmailTemplates(): Promise<EmailTemplate[]> {
    return await db.select().from(emailTemplates);
  }

  async createEmailTemplate(template: InsertEmailTemplate): Promise<EmailTemplate> {
    const [newTemplate] = await db.insert(emailTemplates).values(template).returning();
    return newTemplate;
  }

  async updateEmailTemplate(id: number, data: Partial<EmailTemplate>): Promise<EmailTemplate> {
    const [updatedTemplate] = await db
      .update(emailTemplates)
      .set(data)
      .where(eq(emailTemplates.id, id))
      .returning();
    return updatedTemplate;
  }

  async deleteEmailTemplate(id: number): Promise<void> {
    await db.delete(emailTemplates).where(eq(emailTemplates.id, id));
  }

  // Before After methods
  async getAllBeforeAfter(): Promise<BeforeAfter[]> {
    return await db.select().from(beforeAfter).orderBy(beforeAfter.createdAt);
  }

  async getBeforeAfterById(id: number): Promise<BeforeAfter | undefined> {
    const [item] = await db
      .select()
      .from(beforeAfter)
      .where(eq(beforeAfter.id, id));
    return item;
  }

  async createBeforeAfter(data: InsertBeforeAfter): Promise<BeforeAfter> {
    const [newItem] = await db
      .insert(beforeAfter)
      .values(data)
      .returning();
    return newItem;
  }

  async updateBeforeAfter(id: number, data: Partial<BeforeAfter>): Promise<BeforeAfter> {
    const [updatedItem] = await db
      .update(beforeAfter)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(beforeAfter.id, id))
      .returning();
    return updatedItem;
  }

  async deleteBeforeAfter(id: number): Promise<void> {
    await db.delete(beforeAfter).where(eq(beforeAfter.id, id));
  }

  // Slider methods
  async getAllSliders(): Promise<Slider[]> {
    return await db.select().from(sliders).orderBy(sliders.order);
  }

  async getSliderById(id: number): Promise<Slider | undefined> {
    const [slider] = await db
      .select()
      .from(sliders)
      .where(eq(sliders.id, id));
    return slider;
  }

  async createSlider(data: InsertSlider): Promise<Slider> {
    const [newSlider] = await db
      .insert(sliders)
      .values(data)
      .returning();
    return newSlider;
  }

  async updateSlider(id: number, data: Partial<Slider>): Promise<Slider> {
    const [updatedSlider] = await db
      .update(sliders)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(sliders.id, id))
      .returning();
    return updatedSlider;
  }

  async deleteSlider(id: number): Promise<void> {
    await db.delete(sliders).where(eq(sliders.id, id));
  }

  async updateSliderOrder(id: number, order: number): Promise<Slider> {
    const [updatedSlider] = await db
      .update(sliders)
      .set({ order, updatedAt: new Date() })
      .where(eq(sliders.id, id))
      .returning();
    return updatedSlider;
  }
}

export const storage = new DatabaseStorage();