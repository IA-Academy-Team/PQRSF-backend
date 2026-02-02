import cors from "cors";
import { DEV_HOST, FRONTEND_ORIGIN, FRONTEND_URL, LANDING_HOST } from "../config/env.config";

const allowedOrigins = [FRONTEND_ORIGIN, FRONTEND_URL, DEV_HOST, LANDING_HOST]
  .map((o) => o?.trim())
  .filter(Boolean);

export const corsMiddleware = cors({
  origin: (origin, cb) => {
    if (!origin) return cb(null, true); // curl/postman
    if (allowedOrigins.includes(origin)) return cb(null, true);
    return cb(new Error(`CORS blocked: ${origin}`));
  },
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 200,
});
