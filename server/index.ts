import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { storage } from "./storage";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { setupAuth } from "./auth";

// ES Modules için __dirname alternatifi
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

declare module "express-session" {
  interface SessionData {
    userId: number;
  }
}

const app = express();

// Basic middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Auth ve session kurulumu
setupAuth(app);

// Logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

// Main application setup
(async () => {
  try {
    log('Sunucu başlatılıyor...');

    // Register routes first
    log('API rotaları kaydediliyor...');
    const server = await registerRoutes(app);
    log('API rotaları başarıyla kaydedildi');

    // Create public directory if it doesn't exist
    const publicDir = path.join(__dirname, 'public');
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
      log('Public dizini oluşturuldu');
    }

    // Development modunda Vite HMR kullan
    if (process.env.NODE_ENV !== 'production') {
      log('Vite geliştirme sunucusu ayarlanıyor...');
      await setupVite(app, server);
      log('Vite geliştirme sunucusu yapılandırıldı');
    } else {
      // Production modunda static file serving kullan
      log('Statik dosya sunumu ayarlanıyor...');
      serveStatic(app);
      log('Statik dosya sunumu yapılandırıldı');
    }

    // Error handling middleware
    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      console.error('Sunucu hatası:', err);
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Sunucu Hatası";
      res.status(status).json({ message });
    });

    // Start server
    const port = process.env.PORT || 5000;
    log(`Sunucu ${port} portunda başlatılıyor...`);

    server.listen({
      port,
      host: "0.0.0.0",
      reusePort: true,
    }, () => {
      log(`Sunucu başarıyla başlatıldı ve ${port} portunu dinliyor`);
    });

  } catch (error) {
    console.error('Sunucu başlatılamadı:', error);
    process.exit(1);
  }
})();