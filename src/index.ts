import express from "express";
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

dotenv.config();

// define app con express
const app = express();
const PORT = process.env.PORT || 3000;


// desactivar el header x-powered-by por defecto en express para mayor seguridad
app.disable('x-powered-by')
// middleware de json para express
app.use(express.json());
// middleware de logging en consola
app.use(morgan('dev'))
// rate limiter
app.use(rateLimiter)
// middleware de CORS
app.use(corsMiddleware)

// usar rutas principales
app.use("/api", routes)

// A simple health check endpoint
app.get('/health', (req, res) => {
  // In a real app, you might also check database connection, etc.
  if (isAppHealthy()) {
    res.status(200).send({
      status: 'ok',
    });
  } else {
    res.send({
      status: 'error',
    });
  }
});

function isAppHealthy(): boolean {
  // Implement logic to check critical dependencies
  return true; 
}

// 📘 Swagger
const swaggerPath = path.resolve(__dirname, "..", "swagger_output.json");
const swaggerFile = JSON.parse(readFileSync(swaggerPath, "utf-8"));

// Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));

// usar middleware de errores
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en: http://localhost:${PORT}`)
  console.log(`📘 Documentación Swagger: http://localhost:${PORT}/api-docs`)
})
