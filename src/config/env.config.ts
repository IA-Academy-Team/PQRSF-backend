import dotenv from 'dotenv';
dotenv.config();

const normalize = (value: string | undefined, fallback = '') =>
  (value ?? fallback).toString().trim();

// base de datos
export const DB_HOST = normalize(process.env.DB_HOST, 'localhost');
export const DB_PORT = Number(normalize(process.env.DB_PORT, '5432'));
export const DB_USER = normalize(process.env.DB_USER, 'postgres');
export const DB_PASSWORD = normalize(process.env.DB_PASSWORD, 'postgres');
export const DB_NAME = normalize(process.env.DB_NAME, 'pqrs');

// recuperar constraseña
export const SMTP_HOST = normalize(process.env.SMTP_HOST, 'smtp.mailtrap.io');
export const SMTP_PORT = Number(normalize(process.env.SMTP_PORT, '2525'));
export const SMTP_SECURE = normalize(process.env.SMTP_SECURE, 'false') === 'true';
export const SMTP_USER = normalize(process.env.SMTP_USER);
export const SMTP_PASS = normalize(process.env.SMTP_PASS);
export const MAIL_FROM = normalize(process.env.MAIL_FROM);

// CORS
export const FRONTEND_URL = normalize(process.env.FRONTEND_URL, 'http://localhost:5173');
export const DEV_HOST = normalize(process.env.DEV_HOST, 'http://localhost:13131313');
export const LANDING_HOST = normalize(process.env.LANDING_HOST, 'https://sdvcdsfsdfdsf.com.co');
export const PROD_HOST = normalize(process.env.PROD_HOST, 'https://sdfsfasdfjls.com.co');
export const PORT = Number(normalize(process.env.PORT, '3000'));

const detectLocalhost = (value: string) =>
  value.includes("localhost") || value.includes("127.0.0.1");

export const IS_LOCALHOST = detectLocalhost(FRONTEND_URL) || detectLocalhost(DEV_HOST);

export const FRONTEND_ORIGIN = IS_LOCALHOST ? (DEV_HOST || FRONTEND_URL) : (PROD_HOST || FRONTEND_URL);

// WHATSAPP
export const WHATSAPP_PHONE_ID = normalize(process.env.WHATSAPP_PHONE_ID);
export const WHATSAPP_ACCESS_TOKEN = normalize(process.env.WHATSAPP_ACCESS_TOKEN);
export const WHATSAPP_VERIFY_TOKEN = normalize(process.env.WHATSAPP_VERIFY_TOKEN);

// N8N (webhook)
export const N8N_WEBHOOK_URL_DEV = normalize(process.env.N8N_WEBHOOK_URL_DEV);
export const N8N_WEBHOOK_URL_PROD = normalize(process.env.N8N_WEBHOOK_URL_PROD);
// export const N8N_WEBHOOK_URL = IS_LOCALHOST ? N8N_WEBHOOK_URL_DEV : N8N_WEBHOOK_URL_PROD;
export const N8N_WEBHOOK_URL = N8N_WEBHOOK_URL_PROD;

// S3 backend
export const AWS_KEY = normalize(process.env.AWS_KEY);
export const AWS_SECRET = normalize(process.env.AWS_SECRET);
export const AWS_BUCKET = normalize(process.env.AWS_BUCKET);
export const AWS_REGION = normalize(process.env.AWS_REGION);