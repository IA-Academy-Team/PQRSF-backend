import express from "express";
import dotenv from "dotenv";
import swaggerUi from 'swagger-ui-express';
// este error es meramente de typescript pero igualmente funciona, es por las importaciones de modulos que no se pueden importar por el commonjs y el type module
import swaggerDocument from '../swagger_output.json' with { type: 'json' };

dotenv.config();

const app = express();
const PORT = 3000;
// const PORT = process.env.PORT || 3000;

// middleware de json para express
app.use(express.json());

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
  console.log(`Server running on http://localhost:${PORT} :DDDDD`);
});
