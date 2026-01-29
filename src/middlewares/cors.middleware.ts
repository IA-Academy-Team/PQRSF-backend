import cors from 'cors'
import { FRONTEND_ORIGIN, LANDING_HOST } from '../config/env.config'

const corsOptions = {
  origin: [FRONTEND_ORIGIN, LANDING_HOST].filter(Boolean),
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  credentials: true,
  optionsSuccessStatus: 200
}

export const corsMiddleware = cors(corsOptions)
