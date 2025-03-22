import { 
  users, posts, products, media, settings, services,
  messages, patientImages, appointments,
  type User, type Post, type Product, type Media, type Setting, type Service,
  type Message, type PatientImage, type Appointment,
  type InsertUser, type InsertPost, type InsertProduct, type InsertMedia, type InsertSetting, type InsertService,
  type InsertMessage, type InsertPatientImage, type InsertAppointment
} from "@shared/schema";
import { db } from "./db";
import { eq, or } from "drizzle-orm";
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
  updateSetting(key: string, value: string): Promise<Setting>;

  // Services methods
  getServices(): Promise<Service[]>;
  getServiceBySlug(slug: string): Promise<Service | undefined>;
  createService(service: InsertService): Promise<Service>;
  updateService(id: number, data: Partial<Service>): Promise<Service>;
  deleteService(id: number): Promise<void>;

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

  sessionStore: session.SessionStore;
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.SessionStore;

  constructor() {
    this.sessionStore = new PostgresSessionStore({
      conObject: {
        connectionString: process.env.DATABASE_URL,
      },
      createTableIfMissing: true,
    });
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
    return await db.select().from(settings);
  }

  async getSettingByKey(key: string): Promise<Setting | undefined> {
    const [setting] = await db.select().from(settings).where(eq(settings.key, key));
    return setting;
  }

  async updateSetting(key: string, value: string): Promise<Setting> {
    const [updatedSetting] = await db
      .update(settings)
      .set({ value })
      .where(eq(settings.key, key))
      .returning();
    return updatedSetting;
  }

  // Services methods
  async getServices(): Promise<Service[]> {
    return await db.select().from(services);
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
      .set(data)
      .where(eq(services.id, id))
      .returning();
    return updatedService;
  }

  async deleteService(id: number): Promise<void> {
    await db.delete(services).where(eq(services.id, id));
  }

  // Messages methods
  async getUserMessages(userId: number): Promise<Message[]> {
    return await db
      .select()
      .from(messages)
      .where(or(eq(messages.senderId, userId), eq(messages.receiverId, userId)));
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
    return await db
      .select()
      .from(appointments)
      .where(eq(appointments.patientId, userId));
  }

  async createAppointment(appointment: InsertAppointment): Promise<Appointment> {
    const [newAppointment] = await db.insert(appointments).values(appointment).returning();
    return newAppointment;
  }

  async updateAppointmentStatus(id: number, status: string): Promise<Appointment> {
    const [updatedAppointment] = await db
      .update(appointments)
      .set({ status })
      .where(eq(appointments.id, id))
      .returning();
    return updatedAppointment;
  }
}

export const storage = new DatabaseStorage();