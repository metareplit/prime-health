import type { Request, Response, NextFunction } from "express";
import { storage } from "./storage";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function comparePasswords(supplied: string, stored: string) {
  try {
    const [hashed, salt] = stored.split(".");
    const hashedBuf = Buffer.from(hashed, "hex");
    const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
    return timingSafeEqual(hashedBuf, suppliedBuf);
  } catch (error) {
    console.error('Password comparison error:', error);
    return false;
  }
}

export const adminAuth = async (req: Request, res: Response, next: NextFunction) => {
  console.log('Admin auth check - Session:', req.session);

  if (!req.session.userId) {
    console.log('No userId in session');
    return res.status(401).json({ message: "Unauthorized" });
  }

  const user = await storage.getUserById(req.session.userId);
  console.log('Found user:', user ? { ...user, password: '[REDACTED]' } : null);

  if (!user || user.role !== "admin") {
    console.log('User not found or not admin');
    return res.status(403).json({ message: "Forbidden" });
  }

  next();
};

export function setupAuthRoutes(app: any) {
  // Login endpoint
  app.post("/api/auth/login", async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;
      console.log(`Login attempt for username: ${username}`);

      const user = await storage.getUserByUsername(username);
      if (!user) {
        console.log('User not found');
        return res.status(401).json({ message: "Kullanıcı adı veya şifre hatalı" });
      }

      console.log('Found user:', { ...user, password: '[REDACTED]' });

      const isValidPassword = await comparePasswords(password, user.password);
      console.log('Password validation result:', isValidPassword);

      if (!isValidPassword) {
        console.log('Invalid password');
        return res.status(401).json({ message: "Kullanıcı adı veya şifre hatalı" });
      }

      // Set session
      req.session.userId = user.id;
      req.session.userRole = user.role;
      console.log('Session set:', req.session);

      // Return user info without password
      const { password: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Giriş yapılırken bir hata oluştu" });
    }
  });

  // Profile endpoint
  app.get("/api/user/profile", async (req: Request, res: Response) => {
    try {
      console.log('Profile request - Session:', req.session);

      if (!req.session.userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const user = await storage.getUserById(req.session.userId);
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      const { password: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      console.error("Profile fetch error:", error);
      res.status(500).json({ message: "Profil bilgileri alınırken bir hata oluştu" });
    }
  });

  // Logout endpoint
  app.post("/api/auth/logout", (req: Request, res: Response) => {
    req.session.destroy((err) => {
      if (err) {
        console.error("Logout error:", err);
        return res.status(500).json({ message: "Çıkış yapılırken bir hata oluştu" });
      }
      res.json({ message: "Başarıyla çıkış yapıldı" });
    });
  });
}