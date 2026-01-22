import cors from 'cors'
import { CORS_ORIGIN } from '../config/env.config'

const corsOptions = {
  origin: CORS_ORIGIN || 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  credentials: true,
  optionsSuccessStatus: 200
}

export const corsMiddleware = cors(corsOptions)
