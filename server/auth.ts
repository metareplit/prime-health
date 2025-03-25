import type { Request, Response, NextFunction } from "express";
import type { Express } from 'express';

const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "admin123";

export function adminAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Yetkilendirme başlığı eksik" });
  }

  const auth = Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
  const username = auth[0];
  const password = auth[1];

  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    next();
  } else {
    res.status(401).json({ message: "Kullanıcı adı veya şifre hatalı" });
  }
}

export function setupAuthRoutes(app: Express) {
  app.post("/api/auth/login", (req: Request, res: Response) => {
    const { username, password } = req.body;

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      res.json({ 
        username: ADMIN_USERNAME,
        role: "admin"
      });
    } else {
      res.status(401).json({ message: "Kullanıcı adı veya şifre hatalı" });
    }
  });
}