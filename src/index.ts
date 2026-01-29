import express from "express";
import http from "http";
import dotenv from "dotenv";
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import { errorHandler } from "./middlewares/error.middleware";
// import de rutas principales
import routes from "./routes/indexRoutes";
import { readFileSync } from "node:fs";
import path from "node:path";
import { rateLimiter } from "./middlewares/rateLimit.middleware";
import { corsMiddleware } from "./middlewares/cors.middleware";
import pool from "./config/db.config";
import { initWebsocket } from "./config/websocket.config";

dotenv.config();

// define app con express
const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3000;


// desactivar el header x-powered-by por defecto en express para mayor seguridad
app.disable('x-powered-by')
app.set("trust proxy", 1) // si estás detrás de un proxy (ej. Heroku, Nginx)
// middleware de logging en consola
app.use(morgan('dev'))
// middleware de json para express
app.use(express.json());
// middleware de CORS
app.options("*", corsMiddleware);
app.use(corsMiddleware)
// rate limiter
app.use(rateLimiter)

// usar rutas principales
app.use("/api", routes)

// A simple health check endpoint
app.get('/health', async (req, res) => {
  // In a real app, you might also check database connection, etc.
  if (await isAppHealthy()) {
    res.status(200).send({
      status: 'ok',
    });
  } else {
    res.send({
      status: 'error',
    });
  }
});

const HEALTH_CHECK_TTL_MS = 5_000;
const REQUIRED_ENV_VARS = ["DB_USER", "DB_HOST", "DB_NAME", "DB_PASSWORD", "DB_PORT"] as const;
let lastHealthCheckAt = 0;
let lastHealthStatus = false;

function hasCriticalEnvVars(): boolean {
  return REQUIRED_ENV_VARS.every((key) => {
    const value = process.env[key];
    return typeof value === "string" && value.trim().length > 0;
  });
}

async function checkCriticalDependencies(): Promise<boolean> {
  if (!hasCriticalEnvVars()) {
    return false;
  }

  try {
    await pool.query("SELECT 1");
    return true;
  } catch {
    return false;
  }
}

async function isAppHealthy(): Promise<boolean> {
  const now = Date.now();
  if (now - lastHealthCheckAt < HEALTH_CHECK_TTL_MS) {
    return lastHealthStatus;
  }

  // verificar si hay dependencias críticas como la base de datos
  lastHealthStatus = await checkCriticalDependencies();
  lastHealthCheckAt = now;

  return lastHealthStatus;
}

// 📘 Swagger
const swaggerPath = path.resolve(__dirname, "..", "swagger_output.json");
const swaggerFile = JSON.parse(readFileSync(swaggerPath, "utf-8"));

// Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));

// usar middleware de errores
app.use(errorHandler);

initWebsocket(server);

server.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en: http://localhost:${PORT}`)
  console.log(`📘 Documentación Swagger: http://localhost:${PORT}/api-docs`)
})
