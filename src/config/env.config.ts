import dotenv from 'dotenv';
dotenv.config();

// base de datos
export const PORT = process.env.PORT || 3000;
export const DB_HOST = process.env.DB_HOST || 'localhost';
export const DB_PORT = process.env.DB_PORT || 5432;
export const DB_USER = process.env.DB_USER || 'postgres';
export const DB_PASSWORD = process.env.DB_PASSWORD || 'postgres';
export const DB_NAME = process.env.DB_NAME || 'pqrs';

// recuperar constraseña
export const SMTP_HOST = process.env.SMTP_HOST || 'smtp.mailtrap.io';
export const SMTP_PORT = process.env.SMTP_PORT || 2525;
export const SMTP_SECURE = process.env.SMTP_SECURE || false;
export const SMTP_USER = process.env.SMTP_USER || '';
export const SMTP_PASS = process.env.SMTP_PASS || '';
export const MAIL_FROM = process.env.MAIL_FROM || '';

// CORS
export const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// TELEGRAM