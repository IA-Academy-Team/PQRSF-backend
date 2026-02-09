import rateLimit from 'express-rate-limit'
import { FRONTEND_URL } from '../config/env.config'

export const rateLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000'), // 60 seconds
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many requests, please try again later.',
  skip: (req) => req.method === 'OPTIONS' || req.method === 'GET' || req.method === 'HEAD',
  handler: (req, res, _next, options) => {
    res.setHeader('Access-Control-Allow-Origin', FRONTEND_URL)
    res.setHeader('Access-Control-Allow-Credentials', 'true')
    res.setHeader('Vary', 'Origin')
    res.status(options.statusCode).json({
      error: {
        code: 'RATE_LIMITED',
        message: options.message,
      },
    })
  },
})
