import path from "path";
import { createServer } from "./index";
import express from "express";

const app = createServer();
const port = process.env.PORT || 3000;

const __dirname = import.meta.dirname;
const distPath = path.join(__dirname, "../spa");

// Archivos estáticos
app.use(express.static(distPath));

// Fallback para React Router (solo rutas NO API)
app.get("*", (req, res, next) => {
  if (req.path.startsWith("/api/") || req.path.startsWith("/health")) {
    return next();
  }

  res.sendFile(path.join(distPath, "index.html"));
});

// (Opcional pero recomendado)
app.use((req, res) => {
  res.status(404).json({
    error: "Ruta no encontrada",
    path: req.path,
  });
});

app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
