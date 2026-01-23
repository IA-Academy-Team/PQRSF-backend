import cors from 'cors'
import { FRONTEND_URL } from '../config/env.config'

const corsOptions = {
  origin: FRONTEND_URL || 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  credentials: true,
  optionsSuccessStatus: 200
}

export const corsMiddleware = cors(corsOptions)
