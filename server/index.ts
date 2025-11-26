import path from "path";
import { createServer } from "./index";
import express from "express";

const app = createServer();
const port = process.env.PORT || 3000;

const __dirname = import.meta.dirname;
const distPath = path.join(__dirname, "../spa");

// 👉 Archivos estáticos
app.use(express.static(distPath));

// 👉 Fallback para React Router (solo rutas NO API)
app.get("*", (req, res, next) => {
  if (req.path.startsWith("/api/") || req.path.startsWith("/health")) {
    return next(); // deja pasar a la API
  }

  res.sendFile(path.join(distPath, "index.html"));
});

// 👉 No agregamos un 404 aquí.
// El 404 de createServer() cubre solo rutas API.

app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
