import { Pool } from 'pg';

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || '5432'),
});


pool.on('connect', () => {
  console.log('Connected to the PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

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

