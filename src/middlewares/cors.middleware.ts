import cors from 'cors'
import { DEV_HOST, FRONTEND_ORIGIN, FRONTEND_URL, LANDING_HOST } from '../config/env.config'

const allowedOrigins = [FRONTEND_ORIGIN, FRONTEND_URL, DEV_HOST, LANDING_HOST]
  .map((origin) => origin?.trim())
  .filter(Boolean);

const corsOptions = {
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  credentials: true,
  optionsSuccessStatus: 200
}

export const corsMiddleware = cors(corsOptions)
