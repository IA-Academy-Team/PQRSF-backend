import { Pool } from 'pg';
import dotenv from "dotenv";

dotenv.config();

// crea el objeto de conexión a la base de datos
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || '5432'),
});

// log de conexión
pool.on('connect', () => {
  console.log('Connected to the PostgreSQL database');
});

// log de error
pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

// log asynctronic de cierre de conexión
(async () => {
  try {
    const client = await pool.connect();
    console.log('DB connection OK');
    client.release();
  } catch (err) {
    console.error('DB connection FAILED', err);
  }
})();


export default pool;
