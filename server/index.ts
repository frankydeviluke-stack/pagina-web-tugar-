import "dotenv/config";
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";

export function createServer() {
  const app = express();

  // Middlewares base
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Health check
  app.get("/api/ping", (_req: Request, res: Response) => {
    const ping = process.env.PING_MESSAGE ?? "pong";
    res.json({ message: ping });
  });

  // Rutas API
  app.get("/api/demo", handleDemo);

  // Manejo de rutas no existentes
  app.use((req: Request, res: Response) => {
    res.status(404).json({
      error: "Ruta no encontrada",
      path: req.originalUrl,
    });
  });

  // Manejo global de errores
  app.use(
    (err: unknown, _req: Request, res: Response, _next: NextFunction) => {
      console.error("❌ Error en el servidor:", err);

      res.status(500).json({
        error: "Error interno del servidor",
      });
    }
  );

  return app;
}
