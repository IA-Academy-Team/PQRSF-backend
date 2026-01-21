import express from "express";
import dotenv from "dotenv";
// import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
// este error es meramente de typescript pero igualmente funciona, es por las importaciones de modulos que no se pueden importar por el commonjs y el type module
import swaggerDocument from '../swagger_output.json' with { type: 'json' };
import { log } from "node:console";

dotenv.config();

const app = express();
const PORT = 3000;
// const PORT = process.env.PORT || 3000;


// desactivar el header x-powered-by por defecto en express para mayor seguridad
app.disable('x-powered-by')
// middleware de json para express
app.use(express.json());
// middleware de logging en consola
// app.use(morgan('dev'))


app.get('/', (req, res) => {
  res.send('Hello backend!');
});

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


// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en: http://localhost:${PORT}`)
  console.log(`📘 Documentación Swagger: http://localhost:${PORT}/api-docs`)
})
