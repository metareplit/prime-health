import {
  users,
  posts,
  products,
  media,
  settings,
  services,
  messages,
  sliders,
  type User,
  type Post,
  type Product,
  type Media,
  type Setting,
  type Service,
  type Message,
  type Slider,
  type InsertUser,
  type InsertPost,
  type InsertProduct,
  type InsertMedia,
  type InsertSetting,
  type InsertService,
  type InsertMessage,
  type InsertSlider,
  defaultSettings,
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";

const PostgresSessionStore = connectPg(session);

export interface IStorage {
  // User methods (only for admin)
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, data: Partial<User>): Promise<User>;

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
  createMessage(message: InsertMessage): Promise<Message>;
  getMessages(): Promise<Message[]>;
  getMessageById(id: number): Promise<Message | undefined>;
  updateMessageStatus(id: number, isRead: boolean): Promise<Message>;

  // Slider methods
  getAllSliders(): Promise<Slider[]>;
  getSliderById(id: number): Promise<Slider | undefined>;
  createSlider(data: InsertSlider): Promise<Slider>;
  updateSlider(id: number, data: Partial<Slider>): Promise<Slider>;
  deleteSlider(id: number): Promise<void>;
  updateSliderOrder(id: number, order: number): Promise<Slider>;

  sessionStore: session.Store;
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = new PostgresSessionStore({
      conObject: {
        connectionString: process.env.DATABASE_URL,
      },
      createTableIfMissing: true,
    });

    this.initializeDefaultSettings().catch(console.error);
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
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
  async createMessage(message: InsertMessage): Promise<Message> {
    const [newMessage] = await db.insert(messages).values(message).returning();
    return newMessage;
  }

  async getMessages(): Promise<Message[]> {
    return await db.select().from(messages).orderBy(messages.createdAt);
  }

  async getMessageById(id: number): Promise<Message | undefined> {
    const [message] = await db.select().from(messages).where(eq(messages.id, id));
    return message;
  }

  async updateMessageStatus(id: number, isRead: boolean): Promise<Message> {
    const [updatedMessage] = await db
      .update(messages)
      .set({ isRead, readAt: isRead ? new Date() : null })
      .where(eq(messages.id, id))
      .returning();
    return updatedMessage;
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