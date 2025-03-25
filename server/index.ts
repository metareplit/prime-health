import express, { type Request, Response, NextFunction } from "express";
import session from "express-session";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { storage } from "./storage";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// ES Modules için __dirname alternatifi
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

declare module "express-session" {
  interface SessionData {
    userId: number;
    userRole: string;
  }
}

const app = express();

// Basic middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Session middleware setup - before any routes
app.use(
  session({
    store: storage.sessionStore,
    secret: process.env.SESSION_SECRET || "your-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      sameSite: 'lax'
    },
  })
);

// Logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  // Intercept JSON responses
  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;

      // Add session info to logs
      if (req.session) {
        logLine += ` [Session: userId=${req.session.userId}, role=${req.session.userRole}]`;
      }

      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      log(logLine);
    }
  });

  next();
});

// Main application setup
(async () => {
  try {
    log('Starting server initialization...');

    // Register API routes first, before Vite middleware
    log('Registering routes...');
    const server = await registerRoutes(app);
    log('Routes registered successfully');

    // Create public directory if it doesn't exist
    const publicDir = path.join(__dirname, 'public');
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
      log('Created public directory');
    }

    // Set up Vite or static serving after API routes
    if (process.env.NODE_ENV !== 'production') {
      log('Setting up Vite development server...');
      await setupVite(app, server);
      log('Vite development server configured');
    } else {
      log('Setting up static file serving...');
      serveStatic(app);
      log('Static file serving configured');
    }

    // Error handling middleware
    app.use((err: any, req: Request, res: Response, _next: NextFunction) => {
      console.error('Server error:', {
        error: err,
        stack: err.stack,
        path: req.path,
        method: req.method,
        session: req.session
      });

      // Set proper content type
      res.setHeader('Content-Type', 'application/json');

      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";
      res.status(status).json({ 
        message,
        error: process.env.NODE_ENV === 'development' ? err.stack : undefined
      });
    });

    // Start server
    const port = 5000;
    log(`Attempting to start server on port ${port}...`);

    server.listen({
      port,
      host: "0.0.0.0",
      reusePort: true,
    }, () => {
      log(`Server successfully started and listening on port ${port}`);
    });

  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
})();