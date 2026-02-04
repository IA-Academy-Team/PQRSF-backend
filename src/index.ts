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
import { prisma } from "./config/db.config";
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
app.use(corsMiddleware)
// rate limiter
app.use(rateLimiter)

// usar rutas principales
app.use("/api", routes)

// A simple health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

prisma.$queryRaw`SELECT 1`
  .then(() => console.log('Prisma connection OK'))
  .catch((error: unknown) => console.error('Prisma connection FAILED', error));

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
